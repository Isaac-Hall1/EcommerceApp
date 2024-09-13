import { useState } from "react";
import ProfileContent from "./components/ProfileContent";
import { trpc } from "@/utils/trpc";

export default function Profile() {
  const[isSettings, setIsSettings] = useState(false)
  const[isCreate, setIsCreate] = useState(false)
  const[isDelete, setIsDelete] = useState(false)

  if(isSettings === false && isCreate === false && isDelete === false)
    setIsSettings(true)

  return (
    <main className="bg-gray-200">
      <div className="flex flex-row min-h-screen max-w-screen-2xl mx-auto">
        <div className="relative basis-1/6">
          <div className="text-black font-bold flex flex-row">
            <div className="basis-1/5"></div>
            <div className="flex flex-col">
              <h2 className="text-xl mt-4">Profile Options</h2>
              <button className="flex justify-start hover:text-[#BE0000] mt-2" onClick={() => {setIsSettings(true); setIsCreate(false); setIsDelete(false)}}>Settings</button>
              <button className="flex justify-start hover:text-[#BE0000] mt-2" onClick={() => {setIsCreate(true); setIsSettings(false); setIsDelete(false)}}>Create Product</button>
              <button className="flex justify-start hover:text-[#BE0000] mt-2" onClick={() => {setIsDelete(true); setIsSettings(false); setIsCreate(false)}}>My Products</button>
            </div>
            <div className="basis-1/5"></div>
          </div>
          <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-gray-300 via-gray-500 via-50% to-gray-300"></div>
        </div>
        <div className="basis-5/6 min-h-screen">
          <ProfileContent Settings={isSettings} Create={isCreate} Delete={isDelete}/>
        </div>
      </div>
    </main>
  )
}
