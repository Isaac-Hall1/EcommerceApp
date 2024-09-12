
type prop = {
  name: string,
  price: number,
  photo: string, 
  username: string
}

export default function ProductCard({name, price, photo, username}: prop) {
  // TODO: A product card should be div that takes up like 80-90% of the top of the card thats the image, under the image will be 
  // the name and price, when clicked the product will bring you to the product details window

  return (
    <div className="flex flex-col mt-4">
      <div className="basis-4/5">
        <img src={photo} alt='ImageNotFound'/>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold">{name}</span>
        <div className="flex flex-row justify-between">
          <span className="">Price: ${price}</span>
          <span className="flex justify-end">{username}</span>
        </div>
      </div>
    </div>
  )
}