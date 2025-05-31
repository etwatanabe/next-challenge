"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { useState } from "react";

interface ProductCardProps {
  product: ProductResponseDTO;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="card overflow-hidden group h-full flex flex-col">
      <div className="h-52 w-full relative">
        <Image
          src={
            imageError
              ? "/placeholder.jpg"
              : product.imageUrl || "/placeholder.jpg"
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
          priority={false}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-semibold">R$ {product.price.toFixed(2)}</p>
          <Link href={`/buy/${product.id}`} className="btn btn-primary btn-sm">
            Comprar
          </Link>
        </div>
      </div>
    </div>
  );
}
