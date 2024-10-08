import { trpc } from "@/utils/trpc"
import utahBanner from '../../assets/utahBanner.jpg'

type prop = {
  id: number,
  name: string,
  price: number,
  photo: string, 
  username: string,
  personal: boolean,
  refreshProducts: () => void,
}

export default function ProductCard({id, name, price, photo, username, personal, refreshProducts}: prop) {
  const delProd = trpc.products.deleteProductById.useMutation({
    onSuccess: () => {
      refreshProducts()
    }
  })
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.stopPropagation()
    delProd.mutate(id)
  }

  return (
    <div className="flex flex-col mt-4">
      <div className="basis-4/5 flex">
        <img className='h-64 w-96 object-cover shadow-md shadow-gray-500 hover:shadow-gray-700 duration-100 rounded-md' src={photo}/>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold">{name}</span>
        <div className="flex flex-row justify-between">
          <span className="">Price: ${price}</span>
          <span className="flex justify-end">{username}</span>
        </div>
        {personal &&
          <div>
            <button className="bg-[#BE0000] px-8 py-2 rounded-md text-white hover:bg-white hover:shadow-md shadow-gray-600 hover:text-black" onClick={(e) => handleClick(e)}>Delete</button>
          </div>
        }
      </div>
    </div>
  )
}