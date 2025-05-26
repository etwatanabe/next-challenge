import { Seller } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class GetSellerByEmailUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(email: string): Promise<Seller | null> {
    const foundSeller = await this.sellerRepository.findByEmail(email);
    if (!foundSeller) {
      throw new Error("Could not find seller with the provided email");
    }

    return foundSeller;
  }
}
