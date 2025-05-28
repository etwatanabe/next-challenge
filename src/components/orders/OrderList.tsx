"use client";

import { useState, useEffect } from "react";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";
import Link from "next/link";

export default function OrderList() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/v1/dashboard/orders");
        if (!response.ok) throw new Error("Falha ao buscar pedidos");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">Carregando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">Você ainda não possui pedidos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link 
            key={order.id} 
            href={`/dashboard/orders/${order.id}`}
            className="card block hover:bg-[color:rgba(var(--foreground),0.01)] transition-colors"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  Pedido #{order.id.substring(0, 8)}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === "COMPLETED" 
                    ? "bg-[color:rgba(var(--success),0.1)] text-[var(--success)]"
                    : order.status === "CANCELLED" 
                      ? "bg-[color:rgba(var(--error),0.1)] text-[var(--error)]" 
                      : "bg-[color:rgba(var(--warning),0.1)] text-[var(--warning)]"
                }`}>
                  {order.status === "COMPLETED" 
                    ? "Concluído" 
                    : order.status === "CANCELLED" 
                      ? "Cancelado" 
                      : "Pendente"}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">
                  {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                </span>
                <span className="font-medium">
                  R$ {order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}