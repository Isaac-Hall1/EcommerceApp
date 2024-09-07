import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'

export const productRouter = router({
  productList: publicProcedure
  .query(async () => {
    try{
      const products = await prisma.product.findMany();
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
      }
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
      }
    })
    return product
  }),
  createProduct: publicProcedure
  .input(z.object({name: z.string(), description: z.string().optional(),
     price: z.number(), photos: z.array(z.object({
        File: z.string().url()
      }).optional()), orders: z.array(z.number()).optional(),
      sellLocation: z.string(), category: z.string()
   }))
   .mutation(async (opts) => {
    const { input } = opts;
    const product = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        sellLocation: input.sellLocation,
        Category: input.category,
        photos: {
          create: input.photos?.filter((photo) => photo !== undefined) || [],
        },
        orders: {
          connect: input.orders?.map((id) => ({ id })) || []
        }
      }
    })
    return product
   }),
   updateProduct: publicProcedure
   .input(z.object({id:z.number(), name: z.string(), description: z.string().optional(),
    price: z.number(), photos: z.array(z.object({
       url: z.string().url()
     }).optional()),
     sellLocation: z.string(),}))
     .mutation(async (opts) => {
      const {input} = opts;
      const product = await prisma.product.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          sellLocation: input.sellLocation,
          description: input.description,
          photos: {
            create: input.photos?.filter((photo): photo is {url: string} => photo !== undefined) || [],
          }
        }
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
      }
    })
    return product
   }),
})