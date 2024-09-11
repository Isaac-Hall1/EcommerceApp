import { protectedProcedure, publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'
import {s3} from '../../utils/awsConfig'
import { v4 as uuidv4} from 'uuid';

export const productRouter = router({
  productList: publicProcedure
  .query(async () => {
    try{
      const products = await prisma.product.findMany({
        include: {
          photos: true
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
    const { input } = opts;
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
  productsByCategory: publicProcedure
  .input(z.string())
  .query(async (opts) => {
    const { input } = opts;
    const product = await prisma.product.findMany({
      where: {
        Category: input
      },
      include: {
        photos: true,  // Include the photos relation in the returned product
      },
    })
    return product
  }),
  createProduct: protectedProcedure
  .input(z.object({name: z.string(), description: z.string().optional(),
     price: z.number(), orders: z.array(z.number()).optional(),
      sellLocation: z.string(), category: z.string(), photos: z.number(),
   }))
   .mutation(async ({input, ctx}) => {
    const { id } = ctx.session
    const { name, description, price, orders, sellLocation, category, photos } = input;
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
        user : {
          connect: {id: id}
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