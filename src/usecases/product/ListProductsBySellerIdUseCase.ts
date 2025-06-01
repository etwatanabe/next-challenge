import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";

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

    const filteredProducts = products.filter((product) => product.isActive);

    return filteredProducts.map((product) => {
      return ProductMapper.toResponseDTO(product);
    });
  }
}
