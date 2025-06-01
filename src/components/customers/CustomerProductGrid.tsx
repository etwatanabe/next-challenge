"use client";

import { useState, useEffect } from "react";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";
import ProductCard from "./ProductCard";

export default function CustomerProductGrid() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "price_high",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/v1/products");
        if (!response.ok) throw new Error("Falha ao buscar produtos");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar produtos"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar e ordenar os produtos
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
    )
    .sort((a, b) => {
      if (filters.sortBy === "price_low") return a.price - b.price;
      if (filters.sortBy === "price_high") return b.price - a.price;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-[var(--muted)]">
          Carregando produtos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card my-8">
        <div className="card-content">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-muted mb-4">
          Não há produtos disponíveis no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:max-w-xs flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 px-3 py-2">
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
            className="text-muted mr-2 flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full outline-none bg-transparent"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            className="input w-full sm:w-auto"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="price_low">Menor preço</option>
            <option value="price_high">Maior preço</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-muted">
            Nenhum produto encontrado para sua busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
