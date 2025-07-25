import { CreateOrderUseCase } from "@/usecases/order/CreateOrderUseCase";
import { GetOrderByIdUseCase } from "@/usecases/order/GetOrderByIdUseCase";
import { ListOrdersUseCase } from "@/usecases/order/ListOrdersUseCase";
import { PrismaOrderRepository } from "@/infra/prisma/PrismaOrderRepository";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { UpdateOrderStatusUseCase } from "@/usecases/order/UpdateOrderStatusUseCase";
import { GetOrderStatusUseCase } from "@/usecases/order/GetOrderStatusUseCase";

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

export const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
  orderRepository
);

export const getOrderStatusUseCase = new GetOrderStatusUseCase(
  orderRepository
);
