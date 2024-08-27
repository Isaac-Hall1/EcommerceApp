import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'
import { connect } from "http2";

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
     totalAmount: z.number(), status: z.string()}))
   .mutation(async (opts) => {
    const { input } = opts;
    await prisma.order.create({
      data: {
        userId: input.userId,
        products: {
          connect: input.products.map((id) => ({ id }))
        },
        totalAmount: input.totalAmount,
        status: input.status,
      }
    })
   }),
   deleteOrderById: publicProcedure
   .input(z.number())
   .mutation(async (opts) => {
    const {input} = opts;
    await prisma.order.delete({
      where: {
        id: input
      }
    })
   }),
})