import { ConnectStripeAccountUseCase } from "@/usecases/seller/ConnectStripeAccountUseCase";
import { RegisterSellerUseCase } from "@/usecases/seller/RegisterSellerUseCase";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { GetSellerByProductIdUseCase } from "@/usecases/seller/GetSellerByProductIdUseCase";
import { CheckStripeConnectionStatusUseCase } from "@/usecases/seller/CheckStripeConnectionStatusUseCase";

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