import { encrypt } from "@/utils/lib"
import { trpcClient } from "@/utils/trpc"
import { TRPCError } from "@trpc/server"

export async function login(email: string, password: string) {
  let user;
  try {
    user = await trpcClient.user.getUserByCreds.query({ email: email, password: password })
      // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    document.cookie = 'auth-token=' + session + '; path=/'
    window.location.reload()
  } catch (error) {
    console.log(error)
  }
}

export async function logout() {
  document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload()
}
