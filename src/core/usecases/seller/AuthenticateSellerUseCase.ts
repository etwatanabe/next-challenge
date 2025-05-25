import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

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
    
    const token = jwt.sign(
      { id: seller.id, email: seller.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    return {
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        email: seller.email
      }
    };
  }
}
