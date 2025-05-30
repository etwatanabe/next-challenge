import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export class ListProductBySellerIdUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(sellerId: string): Promise<ProductResponseDTO[]> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(
        "Could not find seller with the given ID for listing products."
      );
    }

    const products = await this.productRepository.findAllBySellerId(sellerId);

    return products.map((product) => {
      return ProductMapper.toResponseDTO(product);
    });
  }
}
