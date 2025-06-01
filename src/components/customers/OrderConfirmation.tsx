"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderConfirmation({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const response = await fetch(`/api/v1/orders/${id}`);
        if (!response.ok) {
          throw new Error("Pedido não existe ou não foi encontrado");
        }

        const status = await response.json();

        console.log("Order status:", status);
        if (!(status !== "COMPLETED")) {
          redirect(`/products?error=invalid-order`);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  });

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
            <h2 className="text-2xl font-bold mb-4">Erro</h2>
            <p className="text-[var(--error)] mb-6">{error}</p>
            <Link href="/products" className="btn btn-primary">
              Voltar para loja
            </Link>
          </div>
        </div>
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
