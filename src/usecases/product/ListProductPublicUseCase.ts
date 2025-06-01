import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";

export class ListProductPublicUseCase {
  constructor(private readonly productRepository: IProductInterface) {}

  async execute() {
    const products = await this.productRepository.findAllActive();

    const filteredProducts = products.filter((product) => product.isActive);

    return filteredProducts.map((product) => ProductMapper.toResponseDTO(product));
  }
}
