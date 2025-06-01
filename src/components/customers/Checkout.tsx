"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import Image from "next/image";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Checkout({ productId }: { productId: string }) {
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState("");

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
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/${productId}`);

        if (!response.ok) throw new Error("Produto não encontrado");

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar produto"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsProcessingPayment(true);
    setError("");

    try {
      // Chamar a API de checkout do Stripe com os dados do produto e do cliente
      const stripeResponse = await fetch("/api/v1/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: `${customerInfo.address}, ${customerInfo.bairro}, ${
            customerInfo.city
          }-${customerInfo.state}, ${customerInfo.zipcode} ${
            customerInfo.complemento ? ", " + customerInfo.complemento : ""
          }`,
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
          Carregando detalhes do produto...
        </div>
      </div>
    );
  }

  if (error || !product) {
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

  if (!product) {
    return (
      <div className="card">
        <div className="card-content text-center py-8">
          <p className="text-muted mb-4">Produto não encontrado</p>
          <Link href="/products" className="btn btn-outline">
            Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Detalhes do produto */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Detalhes do Produto</h2>
        </div>
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Imagem do produto */}
            {product.imageUrl && (
              <div className="w-full md:w-1/3 relative h-48 md:h-64 rounded-md overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            )}

            {/* Informações do produto */}
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-[var(--primary)]">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário com dados do cliente */}
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
                    Finalizar Compra
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
