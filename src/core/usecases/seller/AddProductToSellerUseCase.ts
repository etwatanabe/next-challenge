import { Seller } from "@/core/domain/entities/Seller";
import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class AddProductToSellerUseCase {
  constructor(
    private readonly sellerRepository: ISellerRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(sellerId: string, productId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new Error("Seller not found");
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    seller.addProduct(product);

    const updatedSeller = await this.sellerRepository.update(sellerId, {
      products: seller.products,
    });
    if (!updatedSeller) {
      throw new Error("Failed to update seller with new product");
    }

    return updatedSeller;
  }
}
