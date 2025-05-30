import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { CreateProductDTO } from "@/core/dtos/product/CreateProductDTO";
import { Product } from "@/core/domain/entities/Product";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";

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

    const productProps: CreateProductDTO = {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      sellerId: data.sellerId,
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
