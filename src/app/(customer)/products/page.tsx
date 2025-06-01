import { Metadata } from "next";
import CustomerProductGrid from "@/components/customers/CustomerProductGrid";

export const metadata: Metadata = {
  title: "Produtos | Loja Online",
  description: "Conheça nossos produtos e faça suas compras",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Nossa Loja</h1>
          <p className="text-muted mt-2">
            Confira nossos produtos e faça sua compra
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CustomerProductGrid />
      </main>
    </div>
  );
}
