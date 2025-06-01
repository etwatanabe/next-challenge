import { Metadata } from "next";
import OrderConfirmation from "@/components/customers/OrderConfirmation";

export const metadata: Metadata = {
  title: "Pedido Confirmado | Loja",
  description: "Seu pedido foi confirmado com sucesso",
};

type Params = Promise<{ id: string }>;

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { id } = await params;
  return <OrderConfirmation id={id} />;
}
