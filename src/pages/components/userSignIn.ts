import { encrypt } from "@/utils/lib"
import { trpc, trpcClient } from "@/utils/trpc"
import { TRPCError } from "@trpc/server"


export async function signUp(username: string, password: string, email: string, createUser: any ) {

  try {
  createUser.mutate({
    username: username,
    email: email,
    password: password,
  },
  {
    onSuccess : async (user) => {
      // Create the session
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = await encrypt({ user, expires });
      document.cookie = 'auth-token=' + session + expires + '; path=/'
    }
  })
  } catch (error) {
    throw new TRPCError({code:"BAD_REQUEST", message: "failure to create profile"})
  }
}

export async function login(email: string, password: string) {

  let user;
  try {
    user = await trpcClient.user.getUserByCreds.query({ email: email, password: password })
  } catch (error) {
    throw new TRPCError({code:"UNAUTHORIZED", message:"Invalid Credentials, account does not exist"})
  }
  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  document.cookie = 'auth-token=' + session + expires + '; path=/'
}
