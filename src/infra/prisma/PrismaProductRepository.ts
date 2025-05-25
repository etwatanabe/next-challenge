import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { Product, ProductProps } from "@/core/domain/entities/Product";
import prisma from "@/utils/prisma";

export class PrismaProductRepository implements IProductRepository {
  async create(data: ProductProps): Promise<Product> {
    const createdProduct = await prisma.product.create({
      data: { ...data },
    });
    return {
      ...createdProduct,
      price: Number(createdProduct.price),
    };
  }

  async findById(id: string): Promise<Product | null> {
    const foundProduct = await prisma.product.findUnique({ where: { id: id } });

    if (!foundProduct) return null;

    return {
      ...foundProduct,
      price: Number(foundProduct.price),
    };
  }

  async findAll(): Promise<Product[]> {
    const foundProduct = await prisma.product.findMany();

    if (!foundProduct) return [];

    return foundProduct.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  }

  async update(id: string, data: ProductProps): Promise<Product> {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: { ...data },
    });

    return {
      ...updatedProduct,
      price: Number(updatedProduct.price),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
