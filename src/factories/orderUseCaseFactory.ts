import { ListOrdersUseCase } from "@/core/usecases/order/ListOrdersUseCase";
import { PrismaOrderRepository } from "@/infra/prisma/PrismaOrderRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";

const orderRepository = new PrismaOrderRepository();
const sellerRepository = new PrismaSellerRepository();

export const listOrdersUseCase = new ListOrdersUseCase(
  orderRepository,
  sellerRepository
);
