import ProductsPage from "../../components/ProductList"
import { useRouter } from "next/router"

export default function CategoryProducts() {
  const router = useRouter();
  const {category} = router.query;

  return (
    <ProductsPage productType={String(category)}/>
  );
}