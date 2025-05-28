import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { Product } from "@/core/domain/entities/Product";
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

    return Product.reconstitute(createdProduct.id, {
      name: createdProduct.name,
      description: createdProduct.description,
      price: createdProduct.price.toNumber(),
      imageUrl: createdProduct.imageUrl,
      sellerId: createdProduct.sellerId,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const foundProduct = await prisma.product.findUnique({ where: { id: id } });

    if (!foundProduct) return null;

    return Product.reconstitute(foundProduct.id, {
      name: foundProduct.name,
      description: foundProduct.description,
      price: foundProduct.price.toNumber(),
      imageUrl: foundProduct.imageUrl,
      sellerId: foundProduct.sellerId,
    });
  }

  async findByName(name: string, sellerId: string): Promise<Product | null> {
    const foundProduct = await prisma.product.findFirst({
      where: { name: name, sellerId: sellerId },
    });

    if (!foundProduct) return null;

    return Product.reconstitute(foundProduct.id, {
      name: foundProduct.name,
      description: foundProduct.description,
      price: foundProduct.price.toNumber(),
      imageUrl: foundProduct.imageUrl,
      sellerId: foundProduct.sellerId,
    });
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
      Product.reconstitute(product.id, {
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        sellerId: product.sellerId,
      })
    );
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

    return Product.reconstitute(updatedProduct.id, {
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price.toNumber(),
      imageUrl: updatedProduct.imageUrl,
      sellerId: updatedProduct.sellerId,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id: id } });
  }
}
