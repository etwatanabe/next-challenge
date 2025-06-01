import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { Seller } from "@/core/seller/entity/Seller";
import { RegisterSellerDTO } from "@/core/seller/dtos/RegisterSellerDTO";
import { SellerResponseDTO } from "@/core/seller/dtos/SellerResponseDTO";
import bcryptjs from "bcryptjs";
import { SellerMapper } from "@/core/seller/dtos/SellerMapper";

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
