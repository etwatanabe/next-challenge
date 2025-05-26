import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { compare } from "bcryptjs";
import { signToken } from "@/utils/jwt";

export class AuthenticateSellerUseCase {
  constructor(private sellerRepository: PrismaSellerRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const seller = await this.sellerRepository.findByEmail(email);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const passWordMatch = await compare(password, seller.password);
    if (!passWordMatch) {
      throw new Error("Invalid password");
    }

    const token = await signToken({ sub: seller.id });

    return {
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
      },
    };
  }
}
