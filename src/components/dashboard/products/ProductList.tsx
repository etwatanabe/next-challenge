"use client";

import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import Image from "next/image";
import Link from "next/link";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export default function ProductList() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductResponseDTO | null>(null);
  const [hasStripeConnected, setHasStripeConnected] = useState(true); // Assume que tem conexão até verificar

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/v1/dashboard/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para verificar se o vendedor tem conta Stripe configurada
  const checkStripeConnection = async () => {
    try {
      const response = await fetch("/api/v1/dashboard/stripe/connect");
      if (response.ok) {
        const data = await response.json();
        // Se o status for "complete", o vendedor tem uma conta Stripe válida
        setHasStripeConnected(data.status === "complete");
      } else {
        // Se não conseguir verificar, assume que não tem conexão
        setHasStripeConnected(false);
      }
    } catch (error) {
      console.error("Erro ao verificar conexão com Stripe:", error);
      setHasStripeConnected(false);
    }
  };

  useEffect(() => {
    // Verificar status do Stripe antes de buscar produtos
    checkStripeConnection();
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/dashboard/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir produto");
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir produto");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">
          Carregando produtos...
        </div>
      </div>
    );
  }

  // Exibir aviso se não tiver conexão com Stripe
  if (!hasStripeConnected) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Seus Produtos</h2>
        </div>

        <div className="card p-6 border border-yellow-300 bg-yellow-50">
          <div className="flex items-start gap-3">
            <div className="text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Configure sua conta de pagamentos primeiro
              </h3>
              <p className="text-gray-600 mb-4">
                Para cadastrar produtos e receber pagamentos pelas vendas, você
                precisa conectar sua conta bancária através do Stripe.
              </p>
              <Link href="/dashboard/payments" className="btn btn-primary">
                Configurar Pagamentos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Seus Produtos</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          Adicionar Produto
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted mb-4">
            Você ainda não tem produtos cadastrados
          </p>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="btn btn-outline"
          >
            Adicionar seu primeiro produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card overflow-hidden">
              <div className="h-48 w-full relative">
                <Image
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                <p className="text-muted text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-semibold mb-4">
                  R$ {product.price.toFixed(2)}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setIsFormOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "var(--error)",
                      borderColor: "var(--error)",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
