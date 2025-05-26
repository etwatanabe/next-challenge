import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Could not find product with id ${id}`);
    }

    const seller = await this.sellerRepository.findById(product.sellerId);
    if (!seller) {
      throw new Error(`Could not find seller with id ${product.sellerId}`);
    }

    if (!seller.products.includes(product)) {
      throw new Error(`Product with id ${id} is not associated with seller ${seller.id}`);
    }

    // Remove the product from the seller's product list
    seller.removeProduct(id);

    // Update the seller to reflect the product deletion
    const updatedSeller = await this.sellerRepository.update(seller.id, seller);
    if (!updatedSeller) {
      throw new Error(`Failed to update seller with id ${seller.id} after product deletion.`);
    }

    // Delete the product from the repository
    await this.productRepository.delete(id);
  }
}
