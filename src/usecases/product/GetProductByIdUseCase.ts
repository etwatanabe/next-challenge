import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductInterface) {}

  async execute(id: string): Promise<ProductResponseDTO | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;

    return ProductMapper.toResponseDTO(product);
  }
}
