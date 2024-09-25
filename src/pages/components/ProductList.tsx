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
  paymentType: string;
  photos: { 
    id: number; 
    imgData: string; 
    productId: number; 
  }[]; 
  Category: string;  
}

interface props {
  productType: string,
  searchQuery: string
}

type ogProd = {
  id: number,
  object: object,
  Signals: {
    score: 0.7976874
    uncalibrated_relevance: 0.7976874
  }
}

export default function ProductsPage({productType, searchQuery}: props) {
  const [sortOption, setSortOption] = useState('newest');
  const [productsWithPhotos, setProductsWithPhotos] = useState<product[]>([])
  const [personalProduct, setPersonalProduct] = useState<boolean>(false)

  const router = useRouter();

  // Fetch products based on different conditions
  const userProductsQuery = trpc.products.productByUser.useQuery(sortOption);
  const categoryProductsQuery = trpc.products.productsByCategory.useQuery(
    { category: productType, order: sortOption },
    { enabled: productType !== 'mine' && searchQuery === 'N/A' } // Only fetch if necessary
  );
  const searchProductsQuery = trpc.products.productBySearch.useQuery(
    { search: searchQuery, order: sortOption },
    { enabled: searchQuery !== 'N/A' } // Only fetch if necessary
  );

  // Determine loading state and product data
  const isLoading =
    userProductsQuery.isLoading || categoryProductsQuery.isLoading || searchProductsQuery.isLoading;
  let productList: product[] | undefined = [];

  // Assign correct product data based on conditions
  if (productType !== 'mine' && searchQuery === 'N/A') {
    productList = categoryProductsQuery.data;
  } else if (searchQuery !== 'N/A') {
    productList = searchProductsQuery.data?.products.data;
  } else {
    productList = userProductsQuery.data;
  }

  useEffect(() => {
    if (productType === 'mine') setPersonalProduct(true);

    if (!isLoading && productList) {
      const filteredProducts: product[] = [];
      productList.forEach((product) => {
        if (product.photos.length !== 0) {
          filteredProducts.push(product);
        }
      });
      setProductsWithPhotos(filteredProducts);
    }
  }, [isLoading, productList]);

  const refetchProducts = async () => {
    if (productType !== 'mine' && searchQuery === 'N/A') {
      await categoryProductsQuery.refetch();
    } else if (searchQuery !== 'N/A') {
      await searchProductsQuery.refetch();
    } else {
      await userProductsQuery.refetch();
    }
  };

  return (
    <main>
      <div className="min-h-screen bg-gray-200 text-black">
        <div className="max-w-screen-xl mx-auto flex flex-col pt-16 mb-20">
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
                <option value="oldest">Oldest</option>
              </select>
            </form>
          </div>
          <div className="lg:mx-0 mx-4 mb-20">
            {isLoading ? (<div>Loading...</div>):(
              <div className="grid md:grid-cols-4 grid-cols-2 gap-16 gap-y-72 mb-96">
                {productsWithPhotos.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-fit max-h-20 hover:cursor-pointer"
                    onClick={() => {
                      router.push(`/Products/${product.id}`);
                    }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      photo={product.photos[0].imgData}
                      username={product.userName}
                      personal={personalProduct}
                      refreshProducts={refetchProducts}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
