import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'

export const userRouter = router({
  userList: publicProcedure
  .query(async () => {
    try{
      const users = await prisma.user.findMany();
      return users
    } catch (error) {
      console.log(error)
    }
  }),
  getUserById: publicProcedure
  .input(z.number())
  .query(async (opts) => {
    const { input } = opts;
    const user = await prisma.user.findUnique({
      where: {id: input}
    });
    return user;
  }),
  createUser: publicProcedure
  .input(z.object({email: z.string(), password: z.string()}))
  .mutation(async (opts) => {
    const {input} = opts;
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: input.password,
      },
    });
    return user
  }),
  deleteUser: publicProcedure
  .input(z.number())
  .mutation(async (opts) => {
    const {input} = opts;
    const user = await prisma.user.delete({
      where: {
        id: input
      }
    })
    return user
  }),
  updateUser: publicProcedure
  .input(z.object({
    id: z.number(),
    email: z.string(),
    password:z.string()
  }))
  .mutation(async ({ input }) => {
    const {email, password, id} = input;
    const user = await prisma.user.update({
      where:{
        id: id
      },
      data: {
        email: email,
        password: password
      }
    })
    return user
  })
})