import { RegisterSellerUseCase } from "@/core/usecases/seller/RegisterSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { GetSellerByProductIdUseCase } from "@/core/usecases/seller/GetSellerByProductIdUseCase";

const sellerRepository = new PrismaSellerRepository();

export const registerSellerUseCase = new RegisterSellerUseCase(
  sellerRepository
);

export const getSellerByProductIdUseCase = new GetSellerByProductIdUseCase(
  sellerRepository
);
