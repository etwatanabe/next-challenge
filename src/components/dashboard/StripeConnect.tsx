"use client";

import { useState, useEffect } from "react";

export default function StripeConnect() {
  const [status, setStatus] = useState("loading"); // loading, not_connected, pending, complete, error
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStripeStatus();
  }, []);

  // Verificar status da conta Stripe
  const checkStripeStatus = async () => {
    try {
      const res = await fetch("/api/v1/dashboard/stripe/connect");
      if (!res.ok) throw new Error("Falha ao verificar status");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStatus(data.status || "not_connected");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Falha ao verificar status da conta");
    }
  };

  // Conectar conta Stripe
  const connectStripeAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/dashboard/stripe/connect", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao conectar conta");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("URL de onboarding não recebida");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-bold">Receber Pagamentos</h2>
      </div>
      <div className="card-content">
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {status === "not_connected" && (
          <>
            <p className="mb-4">
              Para receber pagamentos das suas vendas, você precisa conectar sua
              conta bancária através do Stripe, nosso processador de pagamentos.
            </p>
            <button
              onClick={connectStripeAccount}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "Conectando..." : "Conectar Conta Bancária"}
            </button>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="flex items-center gap-2 text-yellow-600 mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Configuração em andamento</span>
            </div>
            <p className="mb-4">
              Você iniciou a configuração da sua conta, mas é necessário
              completar todas as informações para começar a receber pagamentos.
            </p>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Completar Configuração
            </a>
          </>
        )}

        {status === "complete" && (
          <>
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Conta conectada com sucesso!</span>
            </div>
            <p className="mb-4">
              Sua conta está configurada e você receberá automaticamente os
              pagamentos das suas vendas. O marketplace cobra uma taxa de 15%
              por venda.
            </p>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Gerenciar Conta Stripe
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Erro na configuração</span>
            </div>
            <p className="mb-4">
              Ocorreu um erro ao verificar sua conta. Tente novamente ou entre
              em contato com o suporte.
            </p>
            <button onClick={checkStripeStatus} className="btn btn-outline">
              Tentar Novamente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
