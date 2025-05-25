import { IProductRepository } from "@/core/domain/repositories/IProductRepository";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    return await this.productRepository.delete(id);
  }
}
