import { Seller } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class GetSellerByIdUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(id: string): Promise<Seller | null> {
    const foundSeller = await this.sellerRepository.findById(id);
    if (!foundSeller) {
      throw new Error("Could not find seller with the provided email");
    }

    return foundSeller;
  }
}
