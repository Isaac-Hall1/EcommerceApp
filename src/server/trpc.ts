/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v11/router
 * @link https://trpc.io/docs/v11/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { decrypt } from '@/utils/lib';

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const {req, res} = _opts
  return {
    req,
    res,
  }
}

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

const isAuthed = t.middleware(async ({next, ctx}) => {
    const {req, res} = ctx

    const token = req.cookies['auth-token']

    if(!token) throw new TRPCError({code:'UNAUTHORIZED'})

    const payload = await decrypt(token)

    return next({
      ctx: {
        session: payload
      }
    })
  })

/**
 * Unprotected procedure
 **/
export const middleware = t.middleware

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed)

export const router = t.router;
