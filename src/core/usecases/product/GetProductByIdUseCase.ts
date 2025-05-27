import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { GetProductDTO } from "@/core/dtos/product/GetProductDTO";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: GetProductDTO): Promise<ProductResponseDTO | null> {
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
    if (!product) return null;

    return ProductMapper.toResponseDTO(product);
  }
}
