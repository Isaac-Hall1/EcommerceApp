import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'

export const orderRouter = router({
  orderList: publicProcedure
  .query(async () => {
    try{
      const order = await prisma.order.findMany();
      return order
    } catch (error) {
      console.log(error)
    }
  }),
  ordersByUserId: publicProcedure
  .input(z.number())
  .query(async (opts) => {
    const {input} = opts;
    const orders = await prisma.order.findMany({
      where:{
        userId: input
      }
    });
    return orders;
  }),
  orderById: publicProcedure
  .input(z.number())
  .query(async (opts) => {
    const { input } = opts;
    const order = await prisma.order.findUnique({
      where: {
        id: input
      }
    })
    return order
  }),
  createOrder: publicProcedure
  .input(z.object({userId: z.number(), products: z.array(z.number()),
     totalAmount: z.number(), status: z.string().default("pending")}))
   .mutation(async (opts) => {
    const { input } = opts;
    const order = await prisma.order.create({
      data: {
        userId: input.userId,
        products: {
          connect: input.products.map((id) => ({ id }))
        },
        totalAmount: input.totalAmount,
        status: input.status,
      }
    })
    return order
   }),
   deleteOrderById: publicProcedure
   .input(z.number())
   .mutation(async (opts) => {
    const {input} = opts;
    const order = await prisma.order.delete({
      where: {
        id: input
      }
    })
    return order
   }),
})