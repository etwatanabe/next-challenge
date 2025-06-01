import { Metadata } from "next";
import OrderDetails from "@/components/dashboard/orders/OrderDetails";

export const metadata: Metadata = {
  title: "Detalhes do Pedido | Seller Dashboard",
  description: "Visualize os detalhes do pedido",
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full">
      <OrderDetails orderId={params.id} />
    </div>
  );
}
