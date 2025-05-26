import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { Seller, SellerProps } from "@/core/domain/entities/Seller";
import bcryptjs from "bcryptjs";

export class CreateSellerUseCase {
  constructor(private readonly sellerRepository: ISellerRepository) {}

  async execute(data: SellerProps): Promise<Seller> {
    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const seller = Seller.create({
      ...data,
      password: hashedPassword,
    });

    const createdSeller = await this.sellerRepository.create(seller);
    if (!createdSeller) {
      throw new Error("Failed to create seller");
    }

    return createdSeller;
  }
}
