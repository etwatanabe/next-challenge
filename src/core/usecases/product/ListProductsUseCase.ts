import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export class ListProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(sellerId: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.findAllBySellerId(sellerId);

    return products.map((product) => {
      return ProductMapper.toResponseDTO(product);
    });
  }
}
