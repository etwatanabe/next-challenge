import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { Product, ProductProps } from "@/core/domain/entities/Product";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: ProductProps): Promise<Product> {
    const product = Product.create(data);
    return await this.productRepository.create(product);
  }
}
