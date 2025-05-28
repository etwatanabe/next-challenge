import { Metadata } from "next";
import ProductPurchase from "@/components/products/ProductPurchase";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comprar Produto | Loja",
  description: "Compre o produto selecionado",
};

export default function BuyPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Finalizar Compra</h1>
          <Link
            href="/"
            className="text-[var(--primary)] hover:underline text-sm"
          >
            Voltar para loja
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ProductPurchase productId={params.id} />
      </main>
    </div>
  );
}
