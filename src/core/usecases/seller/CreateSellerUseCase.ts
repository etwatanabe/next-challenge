import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { Seller, SellerProps } from "@/core/domain/entities/Seller";

export class CreateSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(data: SellerProps): Promise<Seller> {
    const seller = await Seller.create(data);
    return await this.sellerRepository.create(seller);
  }
}
