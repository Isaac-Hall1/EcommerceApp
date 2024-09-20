import { protectedProcedure, publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'
import {s3} from '../../utils/awsConfig'
import { v4 as uuidv4} from 'uuid';
import Fuse from "fuse.js";

interface product { 
  id: number; 
  createdAt: string; 
  updatedAt: string; 
  name: string; 
  description: string | null; 
  price: number; 
  sellLocation: string; 
  userName: string;
  tags: string[]
  photos: { 
    id: number; 
    imgData: string; 
    productId: number; 
  }[]; 
  Category: string;  
}

export const productRouter = router({
  productList: publicProcedure
  .query(async () => {
    try{
      const products = await prisma.product.findMany({
        include: {
          photos: true,

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
    .input(z.string())
    .query(async ({input}) => {
      const search = input
      const allProducts = await prisma.product.findMany({
        include: {
          photos: true,
        },
      });
      // Step 2: Set up Fuse.js
      const fuseOptions = {
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'description', weight: 0.3 },
          { name: 'Category', weight: 0.2 },
          { name: 'tags.name', weight: 0.2 },
        ],
        threshold: 0.7, // Adjust this for fuzziness
      };
      const fuse = new Fuse(allProducts, fuseOptions);
      const fuzzyResults = fuse.search(search);
      const matchedProducts = fuzzyResults.map(result => result.item);
      return matchedProducts;
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
    return product
   }),

   deleteAllProducts: publicProcedure
   .mutation(async () => {
      const products = await prisma.product.findMany()
      return products
   }),
})