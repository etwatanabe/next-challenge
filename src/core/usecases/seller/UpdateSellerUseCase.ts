import { Seller, SellerProps } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class UpdateSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(id: string, data: SellerProps): Promise<Seller> {
    const updatedSeller = await this.sellerRepository.update(id, data);
    if (!updatedSeller) {
      throw new Error("Failed to update seller");
    }
    
    return updatedSeller;
  }
}
