"use client";

import { useState, useEffect } from "react";
import { OrderResponseDTO } from "@/core/order/dtos/OrderResponseDTO";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/v1/dashboard/orders/${orderId}`);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">
          Carregando detalhes do pedido...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button onClick={() => router.back()} className="btn btn-outline">
              Voltar
            </button>
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
          <Link href="/dashboard/orders" className="btn btn-outline">
            Voltar para pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
        <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="ml-1">Voltar</span>
        </Link>
      </div>

      <div className="card-content">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted mb-1">Número do Pedido</p>
              <p className="font-medium">{order.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted mb-1">Status</p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${
                  order.status === "COMPLETED"
                    ? "bg-[color:rgba(var(--success),0.1)] text-[var(--success)]"
                    : order.status === "CANCELLED"
                    ? "bg-[color:rgba(var(--error),0.1)] text-[var(--error)]"
                    : "bg-[color:rgba(var(--warning),0.1)] text-[var(--warning)]"
                }`}
              >
                {order.status === "COMPLETED"
                  ? "Concluído"
                  : order.status === "CANCELLED"
                  ? "Cancelado"
                  : "Pendente"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted mb-2">Valor Total</p>
            <p className="text-lg font-bold">
              R$ {order.product.price.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted mb-2">Itens do Pedido</p>
            <div className="border border-[var(--border)] rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-[color:rgba(var(--foreground),0.02)]">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Item
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium">
                      Quantidade
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium">
                      Preço
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="px-4 py-3 text-sm">{order.product.name}</td>
                    <td className="px-4 py-3 text-sm text-right">1</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      R$ {order.product.price.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
