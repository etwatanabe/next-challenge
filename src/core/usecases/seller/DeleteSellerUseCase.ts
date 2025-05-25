import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class DeleteSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(id: string): Promise<void> {
    return await this.sellerRepository.delete(id);

  }
}