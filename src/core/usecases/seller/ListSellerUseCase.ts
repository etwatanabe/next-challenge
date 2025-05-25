import { Seller } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class ListSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(): Promise<Seller[]> {
    return await this.sellerRepository.findAll();
  }
}
