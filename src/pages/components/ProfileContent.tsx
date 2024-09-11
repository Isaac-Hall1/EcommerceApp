import { useState } from "react";
import PhotoUpload from "./Photos";
import { trpc } from "@/utils/trpc";
import { logout } from "./userSignIn";

type props = {
  Settings: boolean,
  Create: boolean,
  Delete: boolean,
}

export default function ProfileContent({Settings, Create, Delete} : props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('Kitchen Appliance')
  const [photos, setPhotos] = useState<File[]>([]);
  const [sellLocation, setSellLocation] = useState('Kahlert')

  const handlePhotoChange = (newPhotos: File[]) => {
    setPhotos(newPhotos)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  // TODO: create s3 bucket, tell backend to create however many unique url's for every image and store urls in product
  // then send each image to s3 bucket with its url, when grabbing product, have it get s3 bucket images from url's that 
  // are gotten from product.

  const newProd = trpc.products.createProduct.useMutation()
  const createProduct = async () => {
      const photoLen: number = photos.length
      try {
        // Call the mutation to create the product
        if(photos.length === 0){
          alert('must have at least one photo')
          return
        }
        newProd.mutate(
          {
            name: productName,
            price: price,
            sellLocation: sellLocation,
            category: category,
            description: productDescription,
            photos: photoLen
          },
          {
            onSuccess: async (data) => {
              // Use the photo URLs from the newly created product
              await Promise.all(
                data.urls.map(async (url, index) => {
                  try {
                    await fetch(url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "multipart/form-data"
                      },
                      body: photos[index] // Assuming `photos` is an array of files
                    });
                  } catch (error) {
                    console.error('Error uploading photo:', error);
                  }
                })
              );
            },
            onError: (error) => {
              console.error('Error creating product:', error);
              alert('Failed to create product. Please try again.');
            }
          }
        );
        setProductName("")
        setCategory('Kitchen Appliance')
        handlePhotoChange([])
        setPrice(0)
        setProductDescription("")
        setSellLocation('Kahlert')
      } catch (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product. Please try again.');
      }
  };    
  


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
        <button onClick={() => logout()}>Logout</button>
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
        <form onSubmit={(e) => {e.preventDefault(); createProduct();}}>
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
            <div className="photo-preview mt-4">
              {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="text-red-500 mt-2"
                >
                  Remove
                </button>
              </div>
        ))}
      </div>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="bg-[#BE0000]  text-white mb-28 px-4 p-2 rounded-md hover:bg-[#8c3030]">Create Product</button>
          </div>
        </form>
      </div>
    </div>
      </div>
    ) : Delete ? (
      <div>
        
      </div>
    ) : (
      <p>Loading...</p>
    )}
    </div>
  )
}