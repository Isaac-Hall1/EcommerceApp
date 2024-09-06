import { useState } from "react";

type props = {
  Settings: boolean,
  Create: boolean,
  Delete: boolean,
}

export default function ProfileContent({Settings, Create, Delete} : props) {
  return (
    <div className="text-black">
    {Settings ? (
      <div className="relative flex flex-col h-screen">
      <div className="flex flex-row justify-center">
        <h2 className="font-bold text-4xl mt-4 underline underline-offset-8">Settings</h2>
      </div>
      <div className="mt-4 ml-8">
        <h3 className="text-2xl font-bold">Manage Profile</h3>
        <div className="mt-2">
          <label htmlFor="Username">Change Username: </label>
          <input id="Username" name="Username" type="text" placeholder="New Username" className="pl-2 rounded-md"></input>
        </div>
        <div className="mt-2">
          <label htmlFor="Password">Change Password: </label>
          <input id="Password" name="Password" type="text" placeholder="New Password" className="pl-2 rounded-md"></input>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button className="bg-[#BE0000]  text-white mb-28 px-4 p-2 rounded-md hover:bg-[#8c3030]">Save Settings</button>
      </div>
    </div>
    ) : Create ? (
      <div>
        Create
      </div>
    ) : Delete ? (
      <div>
        Delete
      </div>
    ) : (
      <p>Loading...</p>
    )}
    </div>
  )
}