import { IProductRepository } from "@/core/domain/repositories/IProductRepository";

export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string) {
    return await this.productRepository.findById(id);
  }
}
