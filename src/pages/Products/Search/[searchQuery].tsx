import ProductsPage from "../../components/ProductList"
import { useRouter } from "next/router"

export default function CategoryProducts() {
  const router = useRouter();
  const {searchQuery} = router.query;
  return (
    <ProductsPage productType='N/A' searchQuery={String(searchQuery)}/>
  );
}