import { protectedProcedure, publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'
import {s3} from '../../utils/awsConfig'
import { v4 as uuidv4} from 'uuid';
import { Objective } from '@objective-inc/sdk';
import { json } from "stream/consumers";

type product = { 
  id: number; 
  createdAt: string; 
  updatedAt: string; 
  name: string; 
  description: string | null; 
  price: number; 
  sellLocation: string; 
  userName: string;
  paymentType: string,
  photos: { 
    id: number; 
    imgData: string; 
    productId: number; 
  }[]; 
  Category: string;  
}

type searchProduct = {
  id: string,
  object: product,
}

export const productRouter = router({
  productList: publicProcedure
  .query(async () => {
    try{
      const products = await prisma.product.findMany({
        include: {
          photos: true,
          Tags: true
        }
      });

      return products
    } catch (error) {
      console.log(error)
    }
  }),
  productById: publicProcedure
  .input(z.number())
  .query(async (opts) => {
    const {input} = opts
    const product = await prisma.product.findUnique({
      where: {
        id: input
      },
      include: {
        photos: true,  // Include the photos relation in the returned product
      },
    })
    return product
  }),
  productByUser: protectedProcedure
  .input(z.string())
  .query(async ({input, ctx}) => {
    let product;
    const { username } = ctx.session.user;
    if(input === 'newest'){
      product = await prisma.product.findMany({
        where: {
          userName: username
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(input === 'low-to-high') {
      product = await prisma.product.findMany({
        where: {
          userName: username
        },
        orderBy: {
          price: 'asc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(input === 'high-to-low') {
      product = await prisma.product.findMany({
        where: {
          userName: username
        },
        orderBy: {
          price: 'desc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(input === 'oldest') {
      product = await prisma.product.findMany({
        where: {
          userName: username
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    }
    return product
  }),
  productsByCategory: publicProcedure
  .input(z.object({category: z.string(), order: z.string()}))
  .query(async ({input}) => {
    const { category, order } = input;
    let product;
    if(order === 'newest'){
      product = await prisma.product.findMany({
        where: {
          Category: category
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(order === 'low-to-high') {
      product = await prisma.product.findMany({
        where: {
          Category: category
        },
        orderBy: {
          price: 'asc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(order === 'high-to-low') {
      product = await prisma.product.findMany({
        where: {
          Category: category
        },
        orderBy: {
          price: 'desc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    } else if(order === 'oldest') {
      product = await prisma.product.findMany({
        where: {
          Category: category
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
    }
    return product
  }),
  createProduct: protectedProcedure
  .input(z.object({name: z.string(), description: z.string().optional(),
     price: z.number(), orders: z.array(z.number()).optional(),
      sellLocation: z.string(), category: z.string(), photos: z.number(),
      paymentType: z.string(), Tags: z.array(z.number())
   }))
   .mutation(async ({input, ctx}) => {
    const { username } = ctx.session.user
    const { name, description, price, orders, sellLocation, category, photos, paymentType, Tags } = input;
    const urlArr: string[] = []
    const imgLink: string[] = []
    for(let i = 0; i < photos; i++){
      let keyVal: string = uuidv4()
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
        Key: keyVal, // Generate a unique file name
        Expires: 60, // URL expires in 60 seconds
      };
      // Generate a presigned URL for the client to use to upload the file
      const url = await s3.getSignedUrlPromise('putObject', params);
      imgLink[i] = 'https://utemarketbucket.s3.amazonaws.com/' + keyVal
      urlArr[i] = url
    }
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        sellLocation: sellLocation,
        Category: category,
        paymentType: paymentType,
        user : {
          connect: {username: username}
        },
        orders: {
          connect: orders?.map((id) => ({ id })) || []
        },
        photos: {
          // for each photo in the photo array make imgData the url
          create: imgLink.map(url => ({
            imgData: url,
          })),
        },
        Tags: {
          connect: Tags?.map(id => ({
            id: id
          })) || []
        }
      },
      include: {
        photos: true,  // Include the photos relation in the returned product
      },
    })
    try {
      let tempProd = product
      const response = await fetch('https://api.objective.inc/v1/objects', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${process.env.AOI_API_KEY}`, // Replace with actual API key
          'content-type': 'application/json'
        },
        body: JSON.stringify(tempProd)
      });
      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.statusText}`);
      }
    } catch (error) {
      console.log(error)
    }

    return {'product': product, 'urls': urlArr}
   }),
   updateProduct: publicProcedure
   .input(z.object({id:z.number(), name: z.string(), description: z.string().optional(),
    price: z.number(), photos: z.number(),
     sellLocation: z.string(),}))
     .mutation(async (opts) => {
      const {input} = opts;
      const urlArr: string[] = []
      for(let i = 0; i < input.photos; i++){
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
          Key: uuidv4(), // Generate a unique file name
          Expires: 60, // URL expires in 60 seconds
        };
        // Generate a presigned URL for the client to use to upload the file
        const url = await s3.getSignedUrlPromise('putObject', params);
        urlArr[i] = url
      }
      const product = await prisma.product.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          sellLocation: input.sellLocation,
          description: input.description,
          photos: {
            // for each photo in the photo array make imgData the url
            create: urlArr.map(url => ({
              imgData: url,
            })),
          },
        },
        include: {
          photos: true,  // Include the photos relation in the returned product
        },
      })
      return product
     }),
  productBySearch: publicProcedure
    .input(z.object({ search: z.string(), order: z.string() }))
    .query(async ({ input }) => {
      const { search, order } = input;

      const client = new Objective({ apiKey: process.env.AOI_API_KEY });
      const searchResponse = await client.indexes.search(
        "idx_QA6DU7Z9kkIL",
        {
          query: search,
          object_fields: "id,name,description,Category,photos,userName,price,sellLocation,paymentType",
          relevance_cutoff: 'great',
          limit: 10
        }
      );
      let retVal: product[] = []
      searchResponse.results.map((res) => {
        let pushVal = res.object as product
        retVal.push(pushVal)
      })
      return {products: {data: retVal}, searchResponse}
  }),
  addProductToObjectStore: publicProcedure
  .mutation(async () => {
  let retVal;
  
  try {
    // Await the product retrieval from Prisma
    const products = await prisma.product.findMany({
      include: {
        photos: true,
        Tags: true
      }
    });
    
    if (products.length > 0) {
      // Use Promise.all to handle all fetch requests concurrently
      const results = await Promise.all(
        products.map(async (product) => {
          const response = await fetch('https://api.objective.inc/v1/objects', {
            method: 'PUT',
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${process.env.AOI_API_KEY}`, // Replace with actual API key
              'content-type': 'application/json'
            },
            body: JSON.stringify(product)
          });

          if (!response.ok) {
            throw new Error(`Failed to add product: ${response.statusText}`);
          }

          return await response.json(); // Return the response JSON
        })
      );

      retVal = results; // Assign all fetch responses to retVal
    }

    return retVal; // Return the results

  } catch (error) {
    console.error('Error adding products:', error);
    throw new Error('Could not add products');
  }
}),

  deleteProductById: publicProcedure
   .input(z.number())
   .mutation(async (opts) => {
    const {input} = opts;
    const product = await prisma.product.delete({
      where: {
        id: input
      },
      include: {
        photos: true,  // Include the photos relation in the returned product
      },
    })
    product.photos.map(async (photo) => {
      let keyVal = photo.imgData.split('/').slice(3).join('/'); // Join back into a string
      if (keyVal && process.env.AWS_BUCKET_NAME) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
          Key: keyVal, // S3 object key as a string
        };
        try {
          // Delete the object from S3
          await s3.deleteObject(params).promise(); 
        } catch (err) {
          console.error(`Error deleting object ${keyVal}`, err);
        }
      }
    })

    const client = new Objective({ apiKey: process.env.AOI_API_KEY });
    const searchResponse = await client.indexes.search(
      "idx_QA6DU7Z9kkIL",
      {
        query: product.name,
        object_fields: "id,name,description,Category,photos,userName,price,sellLocation,paymentType",
        relevance_cutoff: 'great',
        limit: 10
      }
    );

   try{   
    searchResponse.results.forEach(async (res) => {
       let prod = res.object as product;
       if (prod.id === product.id) {
         const del = await fetch(`https://api.objective.inc/v1/objects/${res.id}`, {
           method: 'DELETE',
           headers: {
             Authorization: `Bearer ${process.env.AOI_API_KEY}`
           }
         });
         console.log(del)
       }
     })
    } catch (error) {
      console.log(error)
    }
    return product
   }),

   deleteAllProducts: publicProcedure
   .mutation(async () => {
      const products = await prisma.product.findMany()
      return products
   }),
})