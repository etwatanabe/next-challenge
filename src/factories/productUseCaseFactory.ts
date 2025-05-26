import { CreateProductUseCase } from "@/core/usecases/product/CreateProductUseCase";
import { DeleteProductUseCase } from "@/core/usecases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "@/core/usecases/product/GetProductByIdUseCase";
import { ListProductUseCase } from "@/core/usecases/product/ListProductsUseCase";
import { UpdateProductUseCase } from "@/core/usecases/product/UpdateProductUseCase";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";

const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();

export const createProductUseCase = new CreateProductUseCase(
  productRepository,
  sellerRepository
);

export const deleteProductUseCase = new DeleteProductUseCase(
  productRepository,
  sellerRepository
);

export const listProductUseCase = new ListProductUseCase(productRepository);

export const getProductByIdUseCase = new GetProductByIdUseCase(
  productRepository
);

export const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  sellerRepository
);
