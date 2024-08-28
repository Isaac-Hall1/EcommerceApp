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
  createProduct: publicProcedure
  .input(z.object({name: z.string(), description: z.string().optional(),
     price: z.number(), photos: z.array(z.object({
        url: z.string().url()
      }).optional()), orders: z.array(z.number()).optional(),
      discountAmount: z.number().default(0),
   }))
   .mutation(async (opts) => {
    const { input } = opts;
    await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        discountAmount: input.discountAmount,
        photos: {
          create: input.photos?.filter((photo) => photo !== undefined) || [],
        },
        orders: {
          connect: input.orders?.map((id) => ({ id })) || []
        }
      }
    })
   }),
   updateProduct: publicProcedure
   .input(z.object({id:z.number(), name: z.string(), description: z.string().optional(),
    price: z.number(), photos: z.array(z.object({
       url: z.string().url()
     }).optional()),
     discountAmount: z.number().default(0),}))
     .mutation(async (opts) => {
      const {input} = opts;
      await prisma.product.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          discountAmount: input.discountAmount,
          description: input.description,
          photos: {
            create: input.photos?.filter((photo) => photo !== undefined) || [],
          }
        }
      })
     }),
   deleteProductById: publicProcedure
   .input(z.number())
   .mutation(async (opts) => {
    const {input} = opts;
    await prisma.product.delete({
      where: {
        id: input
      }
    })
   }),
})