import { ListProductPublicUseCase } from "@/core/usecases/product/ListProductPublicUseCase";
import { ListProductBySellerIdUseCase } from "@/core/usecases/product/ListProductsBySellerIdUseCase";
import { CreateProductUseCase } from "@/core/usecases/product/CreateProductUseCase";
import { DeleteProductUseCase } from "@/core/usecases/product/DeleteProductUseCase";
import { GetProductByIdUseCase } from "@/core/usecases/product/GetProductByIdUseCase";
import { UpdateProductUseCase } from "@/core/usecases/product/UpdateProductUseCase";
import { PrismaProductRepository } from "@/infra/prisma/PrismaProductRepository";
import { PrismaSellerRepository } from "@/infra/prisma/PrismaSellerRepository";

const productRepository = new PrismaProductRepository();
const sellerRepository = new PrismaSellerRepository();

export const listProductPublicUseCase = new ListProductPublicUseCase(
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

export const getProductByIdUseCase = new GetProductByIdUseCase(
  productRepository,
  sellerRepository
);

export const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  sellerRepository
);
