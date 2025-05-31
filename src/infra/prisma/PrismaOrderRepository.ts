import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { Order } from "@/core/domain/entities/Order";
import { Order as PrismaOrder } from "@prisma/client";
import { Product } from "@/core/domain/entities/Product";
import { Product as PrismaProduct } from "@prisma/client";
import prisma from "@/infra/lib/prisma";

export class PrismaOrderRepository implements IOrderInterface {
  async create(order: Order): Promise<Order> {
    const createdOrder = await prisma.order.create({
      data: {
        sellerId: order.sellerId,
        productId: order.product.id,
        status: order.status,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        customerName: order.customerName,
      },
      include: {
        product: true,
      },
    });

    return this.reconstituteOrder(createdOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const foundOrder = await prisma.order.findUnique({
      where: { id: id },
      include: {
        product: true,
      },
    });

    if (!foundOrder) return null;

    return this.reconstituteOrder(foundOrder);
  }

  async findAllBySellerId(sellerId: string): Promise<Order[]> {
    const foundOrders = await prisma.order.findMany({
      where: { sellerId: sellerId },
      include: {
        product: true,
      },
    });

    return foundOrders.map((order) => this.reconstituteOrder(order));
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: order.status,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
      },
      include: {
        product: true,
      },
    });

    return this.reconstituteOrder(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id: id } });
  }

  private reconstituteProduct(product: PrismaProduct): Product {
    return Product.reconstitute(product.id, {
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      sellerId: product.sellerId,
    });
  }

  private reconstituteOrder(
    order: PrismaOrder & { product: PrismaProduct }
  ): Order {
    return Order.reconstitute(order.id, {
      sellerId: order.sellerId,
      status: order.status as OrderStatus,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      product: this.reconstituteProduct(order.product),
    });
  }
}
