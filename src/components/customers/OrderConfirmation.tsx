"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderConfirmation({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const response = await fetch(`/api/v1/orders/${id}`);

        if (!response.ok)
          throw new Error("Pedido não existe ou não foi encontrado");

        const status = await response.json();
        setOrderStatus(status);
      } catch (err) {
        console.log("Error fetching order data:", err);
        setError("Ocorreu um erro ao verificar o status do pedido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando informações do pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-lg mx-auto">
          <div className="card-content text-center">
            <h2 className="text-2xl font-bold mb-4">Ops!</h2>
            <p className="text-[var(--error)] mb-6">{error}</p>
            <Link href="/products" className="btn btn-primary">
              Voltar para loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Se o status não for COMPLETED, mostrar mensagem amigável
  if (orderStatus !== "COMPLETED") {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="bg-[var(--card)] border-b border-[var(--border)]">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Status do Pedido</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="card max-w-lg mx-auto">
            <div className="card-content text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-[color:rgba(var(--warning),0.1)] rounded-full p-4">
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
                    className="text-[var(--warning)]"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">
                Pedido em Processamento
              </h2>
              <p className="text-muted mb-6">
                Seu pedido #{id.substring(0, 8)} está sendo processado. O status
                atual é: <strong>{orderStatus}</strong>. Aguarde enquanto
                confirmamos seu pagamento.
              </p>

              <div className="bg-[color:rgba(var(--foreground),0.03)] rounded-md p-4 mb-6">
                <p className="font-medium">Próximos passos:</p>
                <p className="text-sm mt-2">
                  Assim que seu pagamento for confirmado, você receberá um email
                  com os detalhes do seu pedido.
                </p>
              </div>

              <Link href="/products" className="btn btn-primary">
                Voltar para loja
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <p className="text-lg">{id.substring(0, 8)}</p>
            </div>

            <Link href="/products" className="btn btn-primary">
              Voltar para loja
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
