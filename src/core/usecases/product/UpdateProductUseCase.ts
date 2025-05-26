import { UpdateProductDTO } from "@/core/dtos/product/UpdateProductDTO";
import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: UpdateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(data.id);
    if (!product) {
      throw new Error(`Could not find product with id ${data.id}`);
    }

    const seller = await this.sellerRepository.findById(product.sellerId);
    if (!seller) {
      throw new Error(`Could not find seller with id ${product.sellerId}`);
    }

    if (!seller.products.includes(product)) {
      throw new Error(
        `Product with id ${data.id} is not associated with seller ${seller.id}`
      );
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
