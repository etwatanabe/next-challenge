import { IProductRepository } from "@/core/domain/interfaces/IProductInterface";
import { ISellerRepository } from "@/core/domain/interfaces/ISellerInterface";
import { DeleteProductDTO } from "@/core/dtos/product/DeleteProductDTO";

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: DeleteProductDTO): Promise<void> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(`Could not find seller with id ${data.sellerId}`);
    }

    if (!seller.products.some((product) => product.id === data.id)) {
      throw new Error(
        `Seller with id ${data.sellerId} does not own product with id ${data.id}`
      );
    }

    const product = await this.productRepository.findById(data.id);
    if (!product) {
      throw new Error(`Could not find product with id ${data.id}`);
    }

    seller.removeProduct(data.id);

    await this.productRepository.delete(data.id);
  }
}
