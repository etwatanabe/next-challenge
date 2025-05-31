import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(id: string, sellerId: string): Promise<void> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with id ${sellerId} not found.`);
    }

    const ownProduct = !seller.products.some((product) => product.id === id);
    if (!ownProduct) {
      throw new Error(
        `Seller with id ${sellerId} does not own product with id ${id}`
      );
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Could not find product with id ${id}`);
    }

    const hasOrders = await this.productRepository.hasOrders(id);
    if (hasOrders) {
      product.deactivate();
      await this.productRepository.update(product);
    } else {
      seller.removeProduct(id);
      await this.productRepository.delete(id);
    }
  }
}
