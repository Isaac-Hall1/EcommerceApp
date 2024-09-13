import { trpc } from "@/utils/trpc";
import { Photo } from "@prisma/client";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const router = useRouter();
  const {id} = router.query;
  const {data: product, isLoading} = trpc.products.productById.useQuery(Number(id))
  const [currentPhoto, setCurrentPhoto] = useState<string | undefined>(product?.photos[0].imgData)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setCurrentPhoto(product.photos[0]?.imgData); // Set initial photo when data is loaded
    }
  }, [isLoading, product])

  if(isLoading) {
    return (
      <main className="bg-gray-200 text-black min-h-screen flex justify-center items-center">
        <div className="text-3xl font-bold">Loading...</div>
      </main>
    )
  }

  return (
    <main className="bg-gray-200 text-black">
      <div className="max-w-screen-xl min-h-screen mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-row mt-10">
            <div className="basis-2/3 flex flex-row">
              <div className="basis-[10%] flex flex-col">
                {product?.photos.map((photo, index) => (
                  <div className="mb-4">
                    {index === currentIndex ? (
                      <>
                        <img className='w-full h-20 object-cover rounded-md border-2 border-black' src={photo.imgData} alt="preview image"/>
                      </>
                    ):(
                      <>
                        <img className='w-full h-20 object-cover rounded-md' src={photo.imgData} alt="preview image"/>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="pl-10 flex flex-row basis-[90%] min-h-[600px]">
                <div className="basis-1/12 flex justify-start">
                  <div className="flex items-center">
                    <button className='p-4 mr-3 rounded-full bg-white shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100' onClick={() => {
                      if(product?.photos){
                        if(currentIndex >= 1) {
                          setCurrentIndex(currentIndex - 1)
                          setCurrentPhoto(product?.photos[currentIndex - 1].imgData)
                        } else {
                          setCurrentIndex(product?.photos.length - 1)
                          setCurrentPhoto(product?.photos[product?.photos.length - 1].imgData)
                        }
                      }
                    }}>
                      left
                    </button>
                  </div>
                </div>
                <div className="basis-10/12 fles justify-center">
                  <img className="h-[600px] w-full object-cover shadow-md shadow-gray-500" src={currentPhoto} alt={product?.photos[0].imgData}/>
                </div>
                <div className="basis-1/12 flex justify-end">
                  <div className="flex items-center">
                    <button className='ml-3 p-4 rounded-full bg-white shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100' onClick={() => {
                      if(product?.photos){
                        if(currentIndex < product?.photos.length - 1) {
                          setCurrentIndex(currentIndex + 1)
                          setCurrentPhoto(product?.photos[currentIndex + 1].imgData)
                        } else {
                          setCurrentIndex(0)
                          setCurrentPhoto(product?.photos[0].imgData)
                        }
                      }
                    }}>right</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-8 basis-1/3">
              <h1 className="text-4xl font-bold">{product?.name}</h1>
              <h2 className="text-2xl mt-4">Price: ${product?.price}</h2>
              <span className="text-md mt-4">{product?.description}</span>
              <button className="text-white mt-40 px-36 py-3 bg-[#BE0000] rounded-lg shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100">Contact {product?.userName}</button>
              <button className="text-white mt-10 px-36 py-3 bg-[#BE0000] rounded-lg shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100">Favorite</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}