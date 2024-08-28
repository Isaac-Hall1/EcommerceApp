import { publicProcedure, router } from "../trpc"
import { prisma } from "../db"
import {z} from 'zod'

export const shoppingCartRouter = router({
  addItem: publicProcedure
  .input(
    z.object({
      userId: z.number(),
      productId: z.number(),
      quantity: z.number().default(1),
    })
  )
  .mutation( async ({ input }) => {
    const {userId, productId, quantity} = input;
    let cart = await prisma.shoppingCart.findUnique({
      where: {
        userId: userId
      }
    })

    if(!cart) {
      cart = await prisma.shoppingCart.create({
        data: {userId}
      })
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        shoppingCartId_productId: {
          shoppingCartId: cart.id,
          productId: productId,
        }
      },
      update: {
        quantity: {increment: quantity}
      },
      create: {
        shoppingCartId: cart.id,
        productId: productId,
        quantity: quantity,
      }
    })
    return cartItem
  }),
  deleteItem: publicProcedure
  .input(z.object({
    userId: z.number(),
    productId: z.number(),
  }))
  .mutation( async ({ input }) => {
    const {userId, productId} = input;
    let cart = await prisma.shoppingCart.findUnique({
      where: {
        userId: userId
      }
    })

    if(!cart) {
      cart = await prisma.shoppingCart.create({
        data: {userId}
      })
    }

    const cartItem = await prisma.cartItem.delete({
      where: {
        shoppingCartId_productId: {
          shoppingCartId: cart.id,
          productId: productId
        }
      }
    })
    return cartItem
  }),
  changeQuantity: publicProcedure
  .input(z.object({
    userId: z.number(),
    productId: z.number(),
    quantityChange: z.number(),
  }))
  .mutation( async ({input}) => {
    const {userId,productId, quantityChange} = input;
    let cart = await prisma.shoppingCart.findUnique({
      where: {
        userId: userId
      }
    })

    if(!cart)
      return

    const cartItem = await prisma.cartItem.update({
      where:{
        shoppingCartId_productId: {
          shoppingCartId: cart.id,
          productId: productId
        }
      },
      data: {
        quantity: quantityChange
      }
    })
    return cartItem
  })

})