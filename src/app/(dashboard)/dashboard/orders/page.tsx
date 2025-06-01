import { Metadata } from "next";
import OrderList from "@/components/dashboard/orders/OrderList";

export const metadata: Metadata = {
  title: "Pedidos | Seller Dashboard",
  description: "Visualize e gerencie seus pedidos",
};

export default function OrdersPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Seus Pedidos</h1>
        <p className="text-muted">Acompanhe e gerencie seus pedidos</p>
      </div>

      <div className="card">
        <div className="card-content">
          <OrderList />
        </div>
      </div>
    </div>
  );
}
