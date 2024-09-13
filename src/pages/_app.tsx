import type { AppType } from 'next/app'
import { trpc } from '@/utils/trpc'
import Navbar from './components/navbar'
import './globals.css'
import { useEffect, useState } from 'react'
import { decrypt } from '@/utils/lib'
import { logout } from './components/userSignIn'
import { AuthContextProvider } from './components/AuthProvider'

interface User {
  user: {
    id: number,
    username: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string,
  },
  expires: string,
  iat: string,
  exp: string,
}

const MyApp: AppType = ({Component, pageProps}) => {

  useEffect(() => {
    const checkAuthToken = async () => {
      let cookies: string = document.cookie;
      if (cookies) {
        // Split to find 'auth-token' cookie
        const part = cookies.split('; ').find(cookie => cookie.startsWith('auth-token='));

        if (part) {
          // Extract token value
          const token = part.split('auth-token=')[1];

          if (token) {
            // Decrypt the token (this is asynchronous)
            try {
              const user: User | null = await decrypt(token);

              if (user && user.expires) {
                const currentDate = new Date().getTime();
                const exDate = new Date(user.expires).getTime();

                // Compare expiration date
                if (exDate < currentDate) {
                  logout();
                }
              }
            } catch (error) {
              console.error("Error decrypting token", error);
              logout(); // Optionally log out if decryption fails
            }
          }
        }
      }
    };
    checkAuthToken(); // Call the async function inside useEffect
    }, []); // Empty dependency array means it runs once on mount
  return (
    <div>
      <AuthContextProvider>
        <Navbar/>
        <Component {...pageProps}/>
      </AuthContextProvider>
    </div>
)
}
export default trpc.withTRPC(MyApp)