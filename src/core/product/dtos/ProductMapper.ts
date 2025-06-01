import { Product } from "@/core/product/entity/Product";
import { ProductResponseDTO } from "./ProductResponseDTO";

export class ProductMapper {
  static toResponseDTO(product: Product): ProductResponseDTO {
    return {
      id: product.id as string,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? true,
    };
  }
}
