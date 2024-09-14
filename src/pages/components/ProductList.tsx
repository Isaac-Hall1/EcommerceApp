import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
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
    productId: number; 
  }[]; 
  Category: string;  
}

interface props {
  productType: string,
}

export default function ProductsPage({productType}: props) {
  const [sortOption, setSortOption] = useState('Newest');
  const [productsWithPhotos, setProductsWithPhotos] = useState<product[]>([])
  const [personalPorduct, setPersonalProduct] = useState<boolean>(false)

  const router = useRouter();


  const { data: products, isLoading } = 
  productType === 'mine'
    ? trpc.products.productByUser.useQuery() // Use a specific query for this product type
    : trpc.products.productList.useQuery();   

  useEffect(() => {
    if(productType === 'mine')
      setPersonalProduct(true)
    if(!isLoading && products){
      const filteredProducts: product[] = []
      products.forEach((product) =>{
        if(product.photos.length !== 0) {
          filteredProducts.push(product)
        }
      })
      setProductsWithPhotos(filteredProducts)
    }
  }, [isLoading, products])

  return (
    <main>
      <div className="min-h-screen bg-gray-200 text-black">
        <div className="max-w-screen-xl mx-auto flex flex-col pt-16">
          <div className="flex flex-row justify-between border-b-2 border-gray-500">
            <span className="flex flex-start text-4xl font-bold lg:ml-0 ml-4">Products</span>
            <form className="flex justify-end pb-2 items-center mr-4 lg:mr-0">
              <label htmlFor="Sort" className="mr-8">Sort By: </label>
              <select
                name="Sort"
                id="Sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="ml-8 text-black p-1 rounded-md"
                >
                <option value="newest">Newest</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
                <option value="relevant">Relevant</option>
                <option value="oldest">Oldest</option>
              </select>
            </form>
          </div>
          <div className="lg:mx-0 mx-4">
            {!isLoading &&(
            <div className="grid md:grid-cols-4 grid-cols-2 gap-16 gap-y-64">
              {productsWithPhotos.map((product) => (
                <>
                <div className="min-w-fit max-h-20 hover:cursor-pointer" onClick={() => {
                  router.push(`/Products/${product.id}`)
                }}>
                  <ProductCard id={product.id} name={product.name} price={product.price} photo={product.photos[0].imgData} username={product.userName} personal={personalPorduct} key={product.id}/>
                </div>
                </>
                ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}