import React from 'react'

type prop = {
  setSignInOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignIn({setSignInOpen}: prop) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] text-black">
        <h2 className="text-2xl mb-4">Sign In</h2>
        <input type="email" placeholder="Umail" className="w-full mb-4 p-2 border rounded"/>
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded"/>
        <button className="w-full bg-blue-500 text-white py-2 rounded">Submit</button>
        <button
          className="pt-4 text-blue-500 hover:underline"
          onClick={() => setSignInOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  )
}