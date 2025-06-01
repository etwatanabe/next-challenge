import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { SellerMapper } from "@/core/seller/dtos/SellerMapper";
import { SellerResponseDTO } from "@/core/seller/dtos/SellerResponseDTO";

export class GetSellerByProductIdUseCase {
  constructor(private readonly sellerRepository: ISellerInterface) {}

  async execute(productId: string): Promise<SellerResponseDTO | null> {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const seller = await this.sellerRepository.findByProductId(productId);

    if (!seller) return null;

    return SellerMapper.toResponseDTO(seller);
  }
}
