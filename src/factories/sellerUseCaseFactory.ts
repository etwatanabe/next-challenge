import { ConnectStripeAccountUseCase } from "@/core/usecases/seller/ConnectStripeAccountUseCase";
import { RegisterSellerUseCase } from "@/core/usecases/seller/RegisterSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { GetSellerByProductIdUseCase } from "@/core/usecases/seller/GetSellerByProductIdUseCase";
import { CheckStripeConnectionStatusUseCase } from "@/core/usecases/seller/CheckStripeConnectionStatusUseCase";

const sellerRepository = new PrismaSellerRepository();

export const registerSellerUseCase = new RegisterSellerUseCase(
  sellerRepository
);

export const getSellerByProductIdUseCase = new GetSellerByProductIdUseCase(
  sellerRepository
);

export const connectStripeAccountUseCase = new ConnectStripeAccountUseCase(
  sellerRepository
);

export const checkStripeConnectionStatusUseCase = new CheckStripeConnectionStatusUseCase(
  sellerRepository
);