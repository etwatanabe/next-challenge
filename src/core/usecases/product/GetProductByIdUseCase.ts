import { IProductRepository } from "@/core/domain/repositories/IProductRepository";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string) {
    const foundProduct = await this.productRepository.findById(id);
    if (!foundProduct) {
      throw new Error(`Could not find product with id ${id}`);
    }

    return foundProduct;
  }
}
