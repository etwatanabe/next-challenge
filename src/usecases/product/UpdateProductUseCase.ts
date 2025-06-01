import { UpdateProductDTO } from "@/core/product/dtos/UpdateProductDTO";
import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(data: UpdateProductDTO): Promise<ProductResponseDTO> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(`Seller with id ${data.sellerId} not found.`);
    }

    if (!seller.products.some((product) => product.id === data.id)) {
      throw new Error(
        `Seller with id ${data.sellerId} does not own product with id ${data.id}`
      );
    }

    const product = await this.productRepository.findById(data.id);
    if (!product) {
      throw new Error(`Product with id ${data.id} not found.`);
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
