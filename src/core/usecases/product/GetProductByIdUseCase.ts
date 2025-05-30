import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";

export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(id: string, sellerId: string): Promise<ProductResponseDTO | null> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Could not find seller with id ${sellerId}`);
    }

    if (!seller.products.some((product) => product.id === id)) {
      throw new Error(
        `Seller with id ${sellerId} does not own product with id ${id}`
      );
    }

    const product = await this.productRepository.findById(id);
    if (!product) return null;

    return ProductMapper.toResponseDTO(product);
  }
}
