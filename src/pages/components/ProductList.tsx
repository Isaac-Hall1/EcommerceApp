import { trpc } from "@/utils/trpc";
import { useState } from "react";
import ProductCard from "./ProductCards";
import { useRouter } from "next/router";

type product = { 
  id: number; 
  createdAt: string; 
  updatedAt: string; 
  name: string; 
  description: string | null; 
  price: number; 
  sellLocation: string; 
  userName: string;
  photos: { 
    id: number; 
    imgData: string; 
    productId: number; }[]; 
    Category: string; 
  }

export default function ProductsPage() {
  const [sortOption, setSortOption] = useState('Newest');
  const router = useRouter();

  const allProducts = trpc.products.productList.useQuery()
  const productsWithPhotos: product[] = []
  allProducts.data?.forEach((product) =>{
    if(product.photos.length !== 0) {
      productsWithPhotos.push(product)
    }
  })

  
  return (
    <main>
      <div className="min-h-screen bg-gray-200 text-black">
        <div className="max-w-screen-xl mx-auto flex flex-col pt-16">
          <div className="flex flex-row justify-between border-b-2 border-gray-500">
            <span className="flex flex-start text-4xl font-bold">Products</span>
            <form className="flex justify-end pb-2">
              <label htmlFor="Sort" className="mr-8">Sort By: </label>
              <select
                name="Sort"
                id="Sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="ml-8 text-black"
                >
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
                <option value="relevant">Relevant</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </form>
          </div>
          <div>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-16">
              {productsWithPhotos.map((product) => (
                <>
                <div className="w-fit hover:cursor-pointer" onClick={() => {
                  router.push(`/Products/${product.id}`)
                }}>
                  <ProductCard name={product.name} price={product.price} photo={product.photos[0].imgData} username={product.userName} key={product.id}/>
                </div>
                </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}