import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";
import { CreateProductDTO } from "@/core/dtos/product/CreateProductDTO";
import { Product, ProductProps } from "@/core/domain/entities/Product";
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

    const existingProduct = await this.productRepository.findByName(data.name);
    if (existingProduct) {
      throw new Error(`Product with name ${data.name} already exists.`);
    }

    const productProps: ProductProps = {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      sellerId: data.sellerId,
    };

    // Create a new product entity
    const product = Product.create(productProps);
    if (!product) {
      throw new Error("Failed to create product entity");
    }

    // Persist the product entity to the repository
    const createdProduct = await this.productRepository.create(product);
    if (!createdProduct) {
      throw new Error("Failed to create product");
    }

    // Add the product to the seller's product list
    seller.addProduct(product);

    // Update the seller with the new product
    const updatedSeller = await this.sellerRepository.update(
      data.sellerId,
      seller
    );
    if (!updatedSeller) {
      throw new Error("Failed to update seller with new product");
    }

    return ProductMapper.toResponseDTO(product);
  }
}
