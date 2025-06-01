import { Metadata } from "next";
import OrderDetails from "@/components/dashboard/orders/OrderDetails";

export const metadata: Metadata = {
  title: "Detalhes do Pedido | Seller Dashboard",
  description: "Visualize os detalhes do pedido",
};

type Params = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <div className="w-full">
      <OrderDetails orderId={id} />
    </div>
  );
}
