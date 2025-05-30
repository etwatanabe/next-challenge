import { UpdateProductDTO } from "@/core/dtos/product/UpdateProductDTO";
import { IProductRepository } from "@/core/domain/interfaces/IProductInterface";
import { ISellerRepository } from "@/core/domain/interfaces/ISellerInterface";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: UpdateProductDTO): Promise<ProductResponseDTO> {
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

    product.update({
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
    });

    const updatedProduct = await this.productRepository.update(product);
    if (!updatedProduct) {
      throw new Error("Failed to update product");
    }

    return ProductMapper.toResponseDTO(updatedProduct);
  }
}
