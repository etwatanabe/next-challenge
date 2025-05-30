import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { Seller } from "@/core/domain/entities/Seller";
import bcryptjs from "bcryptjs";
import { RegisterSellerDTO } from "@/core/dtos/seller/RegisterSellerDTO";

export class RegisterSellerUseCase {
  constructor(private readonly sellerRepository: ISellerInterface) {}

  async execute(data: RegisterSellerDTO): Promise<Seller> {
    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const seller = Seller.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      products: data.products ?? [],
      orders: data.orders ?? [],
    });

    const createdSeller = await this.sellerRepository.create(seller);
    if (!createdSeller) {
      throw new Error("Failed to create seller");
    }

    return createdSeller;
  }
}
