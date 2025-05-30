import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { Seller } from "@/core/domain/entities/Seller";
import { RegisterSellerDTO } from "@/core/dtos/seller/RegisterSellerDTO";
import { SellerResponseDTO } from "@/core/dtos/seller/SellerResponseDTO";
import bcryptjs from "bcryptjs";
import { SellerMapper } from "@/core/dtos/seller/SellerMapper";

export class RegisterSellerUseCase {
  constructor(private readonly sellerRepository: ISellerInterface) {}

  async execute(data: RegisterSellerDTO): Promise<SellerResponseDTO> {
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

    return SellerMapper.toResponseDTO(createdSeller);
  }
}
