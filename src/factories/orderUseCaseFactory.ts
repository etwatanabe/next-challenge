import { CreateOrderUseCase } from "@/core/usecases/order/CreateOrderUseCase";
import { GetOrderByIdUseCase } from "@/core/usecases/order/GetOrderByIdUseCase";
import { ListOrdersUseCase } from "@/core/usecases/order/ListOrdersUseCase";
import { PrismaOrderRepository } from "@/infra/prisma/PrismaOrderRepository";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { GetOrderByIdPublicUseCase } from "@/core/usecases/order/GetOrderByIdPublicUseCase";
import { CompleteOrderUseCase } from "@/core/usecases/order/CompleteOrderUseCase";

const orderRepository = new PrismaOrderRepository();
const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();

export const listOrdersUseCase = new ListOrdersUseCase(
  orderRepository,
  sellerRepository
);

export const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  productRepository,
  sellerRepository
);

export const getOrderByIdUseCase = new GetOrderByIdUseCase(
  orderRepository,
  sellerRepository
);

export const getOrderByIdPublicUseCase = new GetOrderByIdPublicUseCase(
  orderRepository
);

export const completeOrderUseCase = new CompleteOrderUseCase(orderRepository);
