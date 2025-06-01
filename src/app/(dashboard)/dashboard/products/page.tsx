import { Metadata } from "next";
import ProductList from "@/components/dashboard/products/ProductList";

export const metadata: Metadata = {
  title: "Produtos | Seller Dashboard",
  description: "Gerencie seu catálogo de produtos",
};

export default function ProductsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Seus Produtos</h1>
        <p className="text-muted">Gerencie seu catálogo de produtos</p>
      </div>

      <div className="card">
        <div className="card-content">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
