"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import Link from "next/link";

interface ProductPurchaseProps {
  productId: string;
}

export default function ProductPurchase({ productId }: ProductPurchaseProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    quantity: 1,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/public/${productId}`);
        if (!response.ok) throw new Error("Produto não encontrado");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar produto");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/orders/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId,
              quantity: formData.quantity,
            },
          ],
          customerInfo: {
            name: formData.name,
            email: formData.email,
            address: formData.address,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar pedido");
      }

      const order = await response.json();
      router.push(`/order/confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">
          Carregando produto...
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Link href="/" className="btn btn-outline">
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
          <Link href="/" className="btn btn-outline">
            Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  // Calcular o total
  const total = product.price * formData.quantity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-48 md:h-auto relative">
              <Image
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted mt-2">{product.description}</p>
              <p className="text-xl font-semibold mt-4">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold">Dados para compra</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="alert alert-error">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="label">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="seu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="label">
                Endereço de entrega
              </label>
              <textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input"
                rows={3}
                placeholder="Endereço completo para entrega"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="label">
                Quantidade
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="input w-32"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg">Total:</span>
                <span className="text-lg font-bold">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? "Processando..." : "Finalizar Compra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}