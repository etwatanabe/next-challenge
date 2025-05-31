import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { SellerMapper } from "@/core/dtos/seller/SellerMapper";
import { SellerResponseDTO } from "@/core/dtos/seller/SellerResponseDTO";

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