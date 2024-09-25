import { protectedProcedure, publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'
import bcrypt from 'bcrypt'
import { TRPCError } from "@trpc/server";

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
  getUserByCreds: publicProcedure
  .input(z.object({email: z.string(), password: z.string()}))
  .query(async ({input}) => {
    const { email, password } = input;
    let user = null
    user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });
    if(!user)
      throw new TRPCError({code:'UNAUTHORIZED', message:'Invalid email or password, user was null'})
    //!(await bcrypt.compare(password, user.password)
    if(!(await bcrypt.compare(password, user.password)))
      throw new TRPCError({code:'UNAUTHORIZED', message:'Invalid email or password, password was incorrect'})
    return user;
  }),
  createUser: publicProcedure
  .input(z.object({username: z.string(), email: z.string(), password: z.string()}))
  .mutation(async (opts) => {
    const {input} = opts;

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashedPassword,
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
  updateUser: protectedProcedure
  .input(z.object({
    newUsername: z.string(),
    newPassword:z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    const {id, username, password} = ctx.session.user
    let {newUsername, newPassword} = input;
    if(newUsername === "") 
      newUsername = username
    if(password === "")
      newPassword = password

    const user = await prisma.user.update({
      where:{
        id: id
      },
      data: {
        username: newUsername,
        password: newPassword
      }
    })
    return user
  })
})