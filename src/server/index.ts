import { router } from './trpc';
import { userRouter } from './routes/user';
import { productRouter } from './routes/product';
import { shoppingCartRouter } from './routes/shoppingCart';
import { orderRouter } from './routes/order';

export const appRouter = router({
  user: userRouter,
  products: productRouter,
  shoppingCart: shoppingCartRouter,
  orders: orderRouter
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;