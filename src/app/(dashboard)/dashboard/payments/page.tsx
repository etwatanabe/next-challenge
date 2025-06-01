import { Metadata } from "next";
import StripeConnect from "@/components/dashboard/StripeConnect";

export const metadata: Metadata = {
  title: "Pagamentos | Seller Dashboard",
  description: "Configure como você recebe pagamentos das suas vendas",
};

export default function PaymentsPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pagamentos</h1>
        <p className="text-muted">
          Conecte sua conta bancária para receber o valor das vendas
        </p>
      </div>

      <StripeConnect />
    </div>
  );
}
