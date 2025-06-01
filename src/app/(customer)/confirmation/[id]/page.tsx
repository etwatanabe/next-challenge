import { Metadata } from "next";
import OrderConfirmation from "@/components/customers/OrderConfirmation";

export const metadata: Metadata = {
  title: "Pedido Confirmado | Loja",
  description: "Seu pedido foi confirmado com sucesso",
};

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderConfirmation id={params.id} />;
}
