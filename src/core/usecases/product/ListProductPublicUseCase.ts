import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ProductMapper } from "@/core/dtos/product/ProductMapper";

export class ListProductPublicUseCase {
  constructor(private readonly productRepository: IProductInterface) {}

  async execute() {
    const products = await this.productRepository.findAllActive();
    
    return products.map((product) => ProductMapper.toResponseDTO(product));
  }
}
