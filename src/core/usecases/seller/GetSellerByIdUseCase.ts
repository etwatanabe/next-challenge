import { Seller } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class GetSellerByIdUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(email: string): Promise<Seller | null> {
    return await this.sellerRepository.findById(email);
  }
}
