import { trpc } from '@/utils/trpc';
import { login } from './userSignIn';
import React, { useState } from 'react'
import { TRPCError } from '@trpc/server';
import { encrypt } from '@/utils/lib';

type prop = {
  setSignInOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignIn({setSignInOpen}: prop) {
  const [hasAccount, setHasAccount] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const title: string = hasAccount ? 'Sign In' : 'Sign Up' 

  const createUser = trpc.user.createUser.useMutation()

  const signUp = async (username: string, password: string, email: string,) => {

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
        document.cookie = 'auth-token=' + session + '; path=/'
      }
    })
  } catch (error) {
    throw new TRPCError({code:"BAD_REQUEST", message: "failure to create profile"})
  }
}


  const handleSubmit = async () => {
    if(hasAccount){
      await login(email, password)
    } else {
      await signUp(username, password, email)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] text-black">
        <h2 className="text-2xl mb-4">{title}</h2>
        <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          {!hasAccount && (
            <input type="username" placeholder="Full Name" className="w-full mb-4 p-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)}/>
          )}
          <input type="email" placeholder="Umail" className="w-full mb-4 p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button className="w-full bg-[#BE0000] text-white py-2 rounded" type='submit'>Submit</button>
            <button
              className="pt-4 text-[#BE0000] hover:underline"
              onClick={() => setSignInOpen(false)}>
              Cancel
            </button>
          </form>
          <button
            className="pt-4 text-[#BE0000] hover:underline"
            onClick={() => setHasAccount(false)}>
            No Account? Sign up!
          </button>
        </div>
      </div>
    
  )
}