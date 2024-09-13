import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router"

export default function ProductDetails() {
  const router = useRouter();
  const {id} = router.query;
  const product = trpc.products.productById.useQuery(Number(id))

  return (
    <main className="bg-gray-200 text-black">
      <div className="max-w-screen-xl min-h-screen mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-row mt-10">
            <div className="basis-2/3 flex flex-row">
              <div className="basis-[10%] flex flex-col">
                {product.data?.photos.map((photo) => (
                  <>
                  <div className="mb-4">
                    <img className='w-full h-20 object-cover' src={photo.imgData} alt="preview image"/>
                  </div>
                  </>
                ))}
              </div>
              <div className="pl-10">hi</div>
            </div>
            <div>
              hi
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}