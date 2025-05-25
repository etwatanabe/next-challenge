import { Seller, SellerProps } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class UpdateSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(id: string, data: SellerProps): Promise<Seller> {
    return await this.sellerRepository.update(id, data);
  }
}
