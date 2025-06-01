import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";
import { CreateProductDTO } from "@/core/product/dtos/CreateProductDTO";
import { Product } from "@/core/product/entity/Product";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${data.sellerId} not found.`);
    }

    const existingProduct = await this.productRepository.findByName(
      data.name,
      data.sellerId
    );
    if (existingProduct) {
      throw new Error(`Product with name ${data.name} already exists.`);
    }

    const productProps = {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      sellerId: data.sellerId,
      isActive: data.isActive ?? true,
    };

    const product = Product.create(productProps);
    if (!product) {
      throw new Error("Failed to create product entity.");
    }

    const createdProduct = await this.productRepository.create(product);
    if (!createdProduct) {
      throw new Error("Failed to create product.");
    }

    seller.addProduct(product);

    return ProductMapper.toResponseDTO(createdProduct);
  }
}
