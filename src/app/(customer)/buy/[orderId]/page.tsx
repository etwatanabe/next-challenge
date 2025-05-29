import { Metadata } from "next";
import OrderCheckout from "@/components/orders/OrderCheckout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Finalizar Pedido | Loja",
  description: "Complete seu pedido e realize o pagamento",
};

export default async function BuyOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const orderId = await params.orderId;
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Finalizar Pedido</h1>
          <Link
            href="/products"
            className="text-[var(--primary)] hover:underline text-sm"
          >
            Voltar para loja
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <OrderCheckout orderId={orderId} />
      </main>
    </div>
  );
}
