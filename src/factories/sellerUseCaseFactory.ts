import { RegisterSellerUseCase } from "@/core/usecases/seller/RegisterSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";

const sellerRepository = new PrismaSellerRepository();

export const registerSellerUseCase = new RegisterSellerUseCase(
  sellerRepository
);
