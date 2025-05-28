import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";

export class ListProductPublicUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute() {
    const products = await this.productRepository.findAll();
    return products.map((product) => ProductMapper.toResponseDTO(product));
  }
}
