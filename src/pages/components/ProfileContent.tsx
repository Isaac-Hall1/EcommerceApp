import { useState } from "react";
import PhotoUpload from "./Photos";

type props = {
  Settings: boolean,
  Create: boolean,
  Delete: boolean,
}

interface product {
  productName: string,
  productDescription: string,
  productPrice: number,
  sellLocation: string,
  category: string,
  photos: File[]
}

export default function ProfileContent({Settings, Create, Delete} : props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [photos, setPhotos] = useState<File[]>([]);
  const [sellLocation, setSellLocation] = useState('')

  const handlePhotoChange = (newPhotos: File[]) => {
    setPhotos(newPhotos)
  }

  return (
    <div className="text-black">
    {Settings ? (
      <div className="relative flex flex-col h-screen">
      <div className="flex flex-row justify-center">
        <h2 className="font-bold text-4xl mt-4 underline underline-offset-8">Settings</h2>
      </div>
      <div className="mt-4 ml-8">
        <h3 className="text-2xl font-bold">Manage Profile</h3>
        <form>
          <div className="mt-2">
            <label htmlFor="Username">Change Username: </label>
            <input id="Username" name="Username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="New Username" className="pl-2 rounded-md"/>
          </div>
          <div className="mt-2">
            <label htmlFor="Password">Change Password: </label>
            <input id="Password" name="Password" value={password} onChange={(e) => setPassword(e.target.value)}type="text" placeholder="New Password" className="pl-2 rounded-md"/>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="bg-[#BE0000]  text-white mb-28 px-4 p-2 rounded-md hover:bg-[#8c3030]" type="submit">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
    ) : Create ? (
      <div>
        <div className="relative flex flex-col h-screen">
      <div className="flex flex-row justify-center">
        <h2 className="font-bold text-4xl mt-4 underline underline-offset-8">Create Product</h2>
      </div>
      <div className="mt-4 ml-8">
        <h3 className="text-2xl font-bold">Product Values</h3>
        <form>
          <div className="mt-2">
            <label htmlFor="Name">Product Name: </label>
            <input id="Name" name="Name" type="text" placeholder="Product Name" className="pl-2 rounded-md" value={productName} onChange={(e) => setProductName(e.target.value)}></input>
          </div>
          <div className="mt-2">
            <label htmlFor="Description">Product Description: </label>
            <input id="Description" name="Description" type="text" placeholder="Product Description" className="pl-2 rounded-md" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></input>
          </div>
          <div className="mt-2">
            <label htmlFor="Price">Product Price: </label>
            <input id="Price" name="Price" type="number" placeholder="Product Price" className="pl-2 rounded-md" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))}></input>
          </div>
          <div className="mt-2">
            <label htmlFor="Password">Sell Location: </label>
            <select
              value={sellLocation}
              onChange={(e) => setSellLocation(e.target.value)}
              className="rounded-md pl-2"
              >
              <option>Kahlert</option>
              <option>PHC</option>
              <option>Union</option>
              <option>Guest House</option>
              <option>Lassonde</option>
            </select>
          </div>
          <div className="mt-2">
            <label htmlFor="Password">Category: </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md px-2"
              >
              <option>Kitchen Appliances</option>
              <option>Furninture</option>
              <option>Football Tickets</option>
              <option>School Supplies</option>
              <option>Apartment/Living</option>
              <option>Art</option>
            </select>
          </div>
          <div className="flex md:flex-row flex-col mt-2">
            <label htmlFor="Photo" className="mr-2">Add Product Photos (Max of Five): </label>
            <PhotoUpload onPhotoChange={handlePhotoChange}/>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="bg-[#BE0000]  text-white mb-28 px-4 p-2 rounded-md hover:bg-[#8c3030]" type="submit">Create Product</button>
          </div>
        </form>
      </div>
    </div>
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