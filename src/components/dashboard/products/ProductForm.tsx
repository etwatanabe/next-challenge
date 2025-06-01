"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

interface ProductFormProps {
  product?: ProductResponseDTO | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ProductForm({
  product,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product?.imageUrl || null
  );

  // Referência para o input de arquivo (oculto)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = product
        ? `/api/v1/dashboard/products/${product.id}`
        : "/api/v1/dashboard/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao salvar produto");
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir o seletor de arquivo ao clicar na imagem
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Função para lidar com o upload de arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação do tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    // Validação do tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Criar um objeto FormData para enviar o arquivo
      const formData = new FormData();
      formData.append("image", file);

      // Enviar para a API de upload
      const uploadResponse = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Falha ao fazer upload da imagem");
      }

      // Obter a URL da imagem enviada
      const uploadData = await uploadResponse.json();

      // Atualizar a URL da imagem no formulário
      setFormData((prev) => ({ ...prev, imageUrl: uploadData.url }));

      // Atualizar a prévia da imagem
      setPreviewImage(uploadData.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao fazer upload da imagem"
      );
    } finally {
      setIsUploading(false);
      // Limpar o valor do input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Usar a imagem do produto ou o placeholder
  const displayImage = previewImage || "/placeholder.jpg";

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="card-header">
          <h2 className="text-xl font-bold">
            {product ? "Editar Produto" : "Adicionar Produto"}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="card-content">
          {error && (
            <div className="alert alert-error mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Área de imagem clicável */}
          <div className="mb-6">
            <div
              className="relative h-48 w-full cursor-pointer rounded-md overflow-hidden border border-[var(--border)]"
              onClick={handleImageClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              {/* Overlay de loading durante upload */}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="text-white">Enviando...</div>
                </div>
              )}

              <Image
                src={displayImage}
                alt="Imagem do produto"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                onError={() => setPreviewImage(null)}
              />

              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-white font-medium">
                  Clique para alterar a imagem
                </div>
              </div>
            </div>

            <p className="text-sm text-center mt-2 text-muted">
              {previewImage
                ? "Clique na imagem para alterá-la"
                : "Clique para adicionar uma imagem"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label htmlFor="name" className="label">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="label">
                Descrição
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input resize-none"
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="label">
                Preço (R$)
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="input"
                required
              />
            </div>

            {/* Campo de URL oculto - preenchido automaticamente */}
            <input type="hidden" id="imageUrl" value={formData.imageUrl} />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="btn btn-primary"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
