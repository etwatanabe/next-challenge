import { IProductRepository } from "@/core/domain/repositories/IProductRepository";

export class ListProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute() {
    return await this.productRepository.findAll();
  }
}
