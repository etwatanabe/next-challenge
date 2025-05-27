import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { CreateProductDTO } from "@/core/dtos/product/CreateProductDTO";
import { Product } from "@/core/domain/entities/Product";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: CreateProductDTO): Promise<ProductResponseDTO> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(
        "Could not find seller with the given ID for product creation."
      );
    }

    const existingProduct = await this.productRepository.findByName(data.name, data.sellerId);
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
      throw new Error("Failed to create product entity");
    }

    const createdProduct = await this.productRepository.create(product);
    if (!createdProduct) {
      throw new Error("Failed to create product");
    }

    seller.addProduct(product);

    return ProductMapper.toResponseDTO(createdProduct);
  }
}
