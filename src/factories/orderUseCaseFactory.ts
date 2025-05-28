import { AddItemToOrderUseCase } from "@/core/usecases/order/AddItemToOrderUseCase";
import { CreateOrderUseCase } from "@/core/usecases/order/CreateOrderUseCase";
import { GetOrderByIdUseCase } from "@/core/usecases/order/GetOrderByIdUseCase";
import { ListOrdersUseCase } from "@/core/usecases/order/ListOrdersUseCase";
import { PrismaOrderRepository } from "@/infra/prisma/PrismaOrderRepository";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";

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

export const addItemToOrderUseCase = new AddItemToOrderUseCase(
  orderRepository,
  productRepository,
  sellerRepository
);

export const getOrderByIdUseCase = new GetOrderByIdUseCase(
  orderRepository,
  sellerRepository
);
