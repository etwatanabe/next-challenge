import { ListProductPublicUseCase } from "@/usecases/product/ListProductPublicUseCase";
import { ListProductBySellerIdUseCase } from "@/usecases/product/ListProductsBySellerIdUseCase";
import { CreateProductUseCase } from "@/usecases/product/CreateProductUseCase";
import { DeleteProductUseCase } from "@/usecases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "@/usecases/product/GetProductByIdUseCase";
import { UpdateProductUseCase } from "@/usecases/product/UpdateProductUseCase";
import { CheckoutUseCase } from "@/usecases/product/CheckoutUseCase";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";
import { PrismaOrderRepository } from "@/infra/prisma/PrismaOrderRepository";

const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();
const orderRepository = new PrismaOrderRepository();

export const listProductPublicUseCase = new ListProductPublicUseCase(
  productRepository
);

export const getProductByIdUseCase = new GetProductByIdUseCase(
  productRepository
);

export const listProductBySellerIdUseCase = new ListProductBySellerIdUseCase(
  productRepository,
  sellerRepository
);

export const createProductUseCase = new CreateProductUseCase(
  productRepository,
  sellerRepository
);

export const deleteProductUseCase = new DeleteProductUseCase(
  productRepository,
  sellerRepository
);

export const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  sellerRepository
);

export const checkoutUseCase = new CheckoutUseCase(
  productRepository,
  orderRepository,
  sellerRepository
);
