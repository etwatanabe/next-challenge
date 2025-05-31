import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export class GetProductByIdUseCase {
  constructor(
    private readonly productRepository: IProductInterface,
  ) {}

  async execute(id: string): Promise<ProductResponseDTO | null> {
   const product = await this.productRepository.findById(id);
    if (!product) return null;

    return ProductMapper.toResponseDTO(product);
  }
}
