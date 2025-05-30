import { Product } from "@/core/domain/entities/Product";
import { ProductResponseDTO } from "./ProductResponseDTO";

export class ProductMapper {
  static toResponseDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    };
  }
}