import { Seller, SellerProps } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import prisma from "@/utils/prisma";

export class PrismaSellerRepository implements ISellerRepository {
  async create(data: SellerProps): Promise<Seller> {
    const createdSeller = await prisma.seller.create({
      data: {
        ...data,
      },
    });
    return createdSeller;
  }

  async findById(id: string): Promise<Seller | null> {
    const foundSeller = await prisma.seller.findUnique({ where: { id: id } });

    if (!foundSeller) return null;

    return foundSeller;
  }

  async findAll(): Promise<Seller[]> {
    const foundSellers = await prisma.seller.findMany();

    if (!foundSellers) return [];

    return foundSellers;
  }

  async update(id: string, data: SellerProps): Promise<Seller> {
    const updatedSeller = await prisma.seller.update({
      where: { id: id },
      data: { ...data },
    });

    return updatedSeller;
  }

  async delete(id: string): Promise<void> {
    await prisma.seller.delete({ where: { id } });
  }
}
