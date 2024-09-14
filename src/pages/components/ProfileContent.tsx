import { useState } from "react";
import utahBanner from '../../assets/utahBanner.jpg'
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
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (photos.length + filesArray.length <= 5) {
        const updatedPhotos = [...photos, ...filesArray];
        setPhotos(updatedPhotos);
      } else {
        alert('You can only upload up to 5 photos.');
      }
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    if(updatedPhotos.length > 1)
      setCurrentPhoto(updatedPhotos[index - 1])
    else
      setCurrentPhoto(null)
  };

  const updUser = trpc.user.updateUser.useMutation()
  const updateUser = async () => {
    try {
      updUser.mutate({
        newUsername: username,
        newPassword: password
      })
    } catch (error) {
      console.log(error)
    }
  }

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
        setPhotos([])
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
        <form
          onSubmit={() => updateUser()}
          >
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
        <div className="flex flex-row justify-center">
          <h2 className="font-bold text-4xl mt-4 underline underline-offset-8">Create Product</h2>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row mt-16">
            <div className="basis-2/3 flex flex-row">
              <div className="basis-[10%] flex flex-col">
                {photos.map((photo, index) => (
                  <div className="mb-4" onClick={() => removePhoto(index)}>
                    {index === currentIndex ? (
                      <>
                        <img className='w-full h-20 object-cover rounded-md border-2 border-black' src={URL.createObjectURL(photo)} alt="preview image"/>
                      </>
                    ):(
                      <>
                        <img className='w-full h-20 object-cover rounded-md' src={URL.createObjectURL(photo)} alt="preview image"/>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="pl-10 flex flex-row basis-[90%] min-h-[600px]">
                <div className="basis-1/12 flex justify-start">
                  <div className="flex items-center">
                    <button className='size-16 mr-3 rounded-full bg-white shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100' onClick={() => {
                      if(photos.length > 0){
                        if(currentIndex >= 1) {
                          setCurrentIndex(currentIndex - 1)
                          setCurrentPhoto(photos[currentIndex - 1])
                        } else {
                          setCurrentIndex(photos.length - 1)
                          setCurrentPhoto(photos[photos.length - 1])
                        }
                      }
                    }}>
                      left
                    </button>
                  </div>
                </div>
                <div className="basis-10/12 fles justify-center">
                  {currentPhoto ? (
                    <img className="h-[600px] w-full object-cover shadow-md shadow-gray-500 rounded-md" src={URL.createObjectURL(currentPhoto)} alt="Preview photo"/>
                  ):(
                    <div className="h-[600px] w-full object-cover shadow-md shadow-gray-500 rounded-md"/>
                  )}
                </div>
                <div className="basis-1/12 flex justify-end">
                  <div className="flex items-center">
                    <button className='ml-3 size-16 rounded-full bg-white shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100' onClick={() => {
                      if(photos.length > 0){
                        if(currentIndex < photos.length - 1) {
                          setCurrentIndex(currentIndex + 1)
                          setCurrentPhoto(photos[currentIndex + 1])
                        } else {
                          setCurrentIndex(0)
                          setCurrentPhoto(photos[0])
                        }
                      }
                    }}>right</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-8 basis-1/3">
              <form onSubmit={(e) => {e.preventDefault(); createProduct();}}>
                <h1 className="text-4xl font-bold">
                  <label htmlFor="Name">Product Name: </label>
                  <input id="Name" name="Name" type="text" placeholder="Product Name" className="pl-2 rounded-md" value={productName} onChange={(e) => setProductName(e.target.value)}></input>
                </h1>
                <h2 className="text-2xl mt-4">
                  <label htmlFor="Price">Product Price: </label>
                  <input id="Price" name="Price" type="number" placeholder="Product Price" className="pl-2 rounded-md" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))}></input>
                </h2>
                <span className="text-md mt-4">
                  <label htmlFor="Description">Product Description: </label>
                  <input id="Description" name="Description" type="text" placeholder="Product Description" className="pl-2 rounded-md" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></input>
                </span>
                <span className="text-md mt-4">
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
                </span>
                <span className="text-md mt-4">
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
                </span>
                <div>
                  <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={photos.length >= 5}
                  />
                  {photos.length >= 5 && (
                    <p className="text-red-500 mt-2">Maximum of 5 photos uploaded.</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

          <div className="absolute bottom-4 right-4">
            <button className="bg-[#BE0000]  text-white mb-28 px-4 p-2 rounded-md hover:bg-[#8c3030]">Create Product</button>
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