import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pedido Confirmado | Loja",
  description: "Seu pedido foi confirmado com sucesso",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = (await params).id;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Confirmação de Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="card max-w-lg mx-auto">
          <div className="card-content text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:rgba(var(--success),0.1)] rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--success)]"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
            <p className="text-muted mb-6">
              Obrigado pela sua compra. Seu pagamento foi processado com sucesso
              e seu pedido está sendo preparado.
            </p>

            {/* Detalhes do pedido */}
            <div className="bg-[color:rgba(var(--foreground),0.03)] rounded-md p-4 mb-6">
              <p className="font-medium">Número do pedido:</p>
              <p className="text-lg">{orderId.substring(0, 8)}</p>
            </div>

            <p className="text-sm text-muted mb-6">
              Você receberá um email com os detalhes do seu pedido e
              atualizações sobre o status do envio.
            </p>

            <Link href="/products" className="btn btn-primary">
              Voltar para loja
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
