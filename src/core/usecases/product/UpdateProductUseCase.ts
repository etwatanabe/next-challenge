import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { Product, ProductProps } from "@/core/domain/entities/Product";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, data: ProductProps): Promise<Product> {
    return await this.productRepository.update(id, data);
  }
}
