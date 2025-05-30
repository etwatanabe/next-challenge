import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { Product } from "@/core/domain/entities/Product";
import { Product as PrismaProduct } from "@prisma/client";
import prisma from "@/infra/lib/prisma";

export class PrismaProductRepository implements IProductRepository {
  async create(data: Product): Promise<Product> {
    const createdProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        sellerId: data.sellerId,
      },
    });

    return this.reconstituteProduct(createdProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const foundProduct = await prisma.product.findUnique({ where: { id: id } });

    if (!foundProduct) return null;

    return this.reconstituteProduct(foundProduct);
  }

  async findByName(name: string, sellerId: string): Promise<Product | null> {
    const foundProduct = await prisma.product.findFirst({
      where: { name: name, sellerId: sellerId },
    });

    if (!foundProduct) return null;

    return this.reconstituteProduct(foundProduct);
  }

  async findAllBySellerId(sellerId: string): Promise<Product[]> {
    const foundProduct = await prisma.product.findMany({
      where: { sellerId: sellerId },
    });

    return foundProduct.map((product) =>
      Product.reconstitute(product.id, {
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        sellerId: product.sellerId,
      })
    );
  }

  async findAll(): Promise<Product[]> {
    const foundProducts = await prisma.product.findMany();

    return foundProducts.map((product) =>
      this.reconstituteProduct(product));
  }

  async update(data: Product): Promise<Product> {
    const updatedProduct = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
      },
    });

    return this.reconstituteProduct(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id: id } });
  }

  private reconstituteProduct(product: PrismaProduct): Product {
    return Product.reconstitute(product.id, {
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
      imageUrl: product.imageUrl,
      sellerId: product.sellerId,
    });
  }
}
