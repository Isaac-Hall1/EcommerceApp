import React, { useState } from 'react'

type prop = {
  setSignInOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignIn({setSignInOpen}: prop) {
  const [hasAccount, setHasAccount] = useState(true)
  const title: string = hasAccount ? 'Sign In' : 'Sign Up' 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] text-black">
        <h2 className="text-2xl mb-4">{title}</h2>
        {!hasAccount && (
           <input type="text" placeholder="Full Name" className="w-full mb-4 p-2 border rounded"/>
        )}
        <input type="email" placeholder="Umail" className="w-full mb-4 p-2 border rounded"/>
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded"/>
        <button className="w-full bg-[#BE0000] text-white py-2 rounded">Submit</button>
        <div className='flex flex-row justify-between'>
          <button
            className="pt-4 text-[#BE0000] hover:underline"
            onClick={() => setSignInOpen(false)}>
            Cancel
          </button>
          <button
            className="pt-4 text-[#BE0000] hover:underline"
            onClick={() => setHasAccount(false)}>
            No Account? Sign up!
          </button>
        </div>
      </div>
    </div>
  )
}