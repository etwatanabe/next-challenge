"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";
import Link from "next/link";

// Pré-carregue o Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface OrderCheckoutProps {
  orderId: string;
}

export default function OrderCheckout({ orderId }: OrderCheckoutProps) {
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState("");

  // Novo estado para os dados do cliente
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
    city: "",
    state: "",
    bairro: "",
    complemento: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/v1/orders/${orderId}`);
        if (!response.ok) throw new Error("Pedido não encontrado");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar pedido"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsProcessingPayment(true);
    setError("");

    try {
      // Criar uma sessão de checkout do Stripe incluindo os dados do cliente
      const stripeResponse = await fetch("/api/v1/checkout/stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            zipcode: customerInfo.zipcode,
            city: customerInfo.city,
            state: customerInfo.state,
            bairro: customerInfo.bairro,
            complemento: customerInfo.complemento,
          },
        }),
      });

      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        throw new Error(
          errorData.error || "Falha ao criar sessão de pagamento"
        );
      }

      const { sessionId } = await stripeResponse.json();

      // Redirecionar para o checkout do Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Falha ao carregar Stripe");

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) throw new Error(stripeError.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao processar pagamento"
      );
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">
          Carregando detalhes do pedido...
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Link href="/products" className="btn btn-outline">
              Voltar para loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div className="card-content text-center py-8">
          <p className="text-muted mb-4">Pedido não encontrado</p>
          <Link href="/products" className="btn btn-outline">
            Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Resumo do pedido */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Resumo do Pedido</h2>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 pb-4 border-b border-[var(--border)]"
              >
                <div className="w-16 h-16 relative bg-[color:rgba(var(--foreground),0.05)] rounded-md flex items-center justify-center">
                  <span className="text-2xl font-light text-[var(--muted)]">
                    {item.quantity}x
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Produto #{item.productId.substring(0, 8)}
                  </p>
                  <p className="text-sm text-muted">
                    Preço unitário: R$ {item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R$ {(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total do Pedido:</span>
              <span className="text-lg font-bold">
                R$ {order.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário com dados do cliente e pagamento */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Dados para Entrega</h2>
        </div>
        <div className="card-content">
          {error && (
            <div className="alert alert-error mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-3">
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label
                  htmlFor="name"
                  className="text-sm font-medium mb-1 block"
                >
                  Nome completo*
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="email"
                  className="text-sm font-medium mb-1 block"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Telefone e CEP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium mb-1 block"
                >
                  Telefone*
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="zipcode"
                  className="text-sm font-medium mb-1 block"
                >
                  CEP*
                </label>
                <input
                  type="text"
                  id="zipcode"
                  required
                  value={customerInfo.zipcode}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      zipcode: e.target.value,
                    })
                  }
                  className="input py-2 w-full"
                  placeholder="00000-000"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="form-group">
              <label
                htmlFor="address"
                className="text-sm font-medium mb-1 block"
              >
                Endereço (Rua/Av. e número)*
              </label>
              <input
                type="text"
                id="address"
                required
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
                className="input py-2 w-full"
                placeholder="Rua das Flores, 123"
              />
            </div>

            {/* Bairro e Complemento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group">
                <label
                  htmlFor="bairro"
                  className="text-sm font-medium mb-1 block"
                >
                  Bairro*
                </label>
                <input
                  type="text"
                  id="bairro"
                  required
                  value={customerInfo.bairro}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, bairro: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="Seu bairro"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="complemento"
                  className="text-sm font-medium mb-1 block"
                >
                  Complemento
                </label>
                <input
                  type="text"
                  id="complemento"
                  value={customerInfo.complemento}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      complemento: e.target.value,
                    })
                  }
                  className="input py-2 w-full"
                  placeholder="Apto, bloco (opcional)"
                />
              </div>
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-3 gap-3">
              <div className="form-group col-span-2">
                <label
                  htmlFor="city"
                  className="text-sm font-medium mb-1 block"
                >
                  Cidade*
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  value={customerInfo.city}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, city: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="Sua cidade"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="state"
                  className="text-sm font-medium mb-1 block"
                >
                  Estado*
                </label>
                <input
                  type="text"
                  id="state"
                  required
                  value={customerInfo.state}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, state: e.target.value })
                  }
                  className="input py-2 w-full"
                  placeholder="UF"
                  maxLength={2}
                />
              </div>
            </div>

            {/* Botão de pagamento */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="btn btn-primary w-full py-2.5"
              >
                {isProcessingPayment ? (
                  "Processando..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="1"
                        y="4"
                        width="22"
                        height="16"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Pagar com Stripe
                  </span>
                )}
              </button>
              <p className="text-xs text-center text-[var(--muted)] mt-2">
                Pagamento seguro processado pelo Stripe
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
