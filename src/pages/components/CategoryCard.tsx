type props = {
  Category: string
}

export default function Card({Category}: props) {
  return (
    <div className="min-h-52 bg-[#BE0000] rounded-lg shadow-black hover:shadow-2xl
      hover:-top-10 hover:border-white duration-300 border-2 border-solid border-gray-400 flex items-center
      justify-center hover:cursor-pointer">
      <a className="text-gray-200 text-center text-3xl">
        {Category}
      </a>
    </div>
  )
}