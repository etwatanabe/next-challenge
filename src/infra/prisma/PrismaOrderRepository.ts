import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { Order } from "@/core/domain/entities/Order";
import { Order as PrismaOrder } from "@prisma/client";
import prisma from "@/infra/lib/prisma";

export class PrismaOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const createdOrder = await prisma.order.create({
      data: {
        sellerId: order.sellerId,
        productId: order.productId,
        status: order.status,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        customerName: order.customerName,
      },
    });

    return this.reconstituteOrder(createdOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const foundOrder = await prisma.order.findUnique({
      where: { id: id },
    });

    if (!foundOrder) return null;

    return this.reconstituteOrder(foundOrder);
  }

  async findAllBySellerId(sellerId: string): Promise<Order[]> {
    const foundOrders = await prisma.order.findMany({
      where: { sellerId: sellerId },
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
    });

    return this.reconstituteOrder(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id: id } });
  }

  private reconstituteOrder(order: PrismaOrder): Order {
    return Order.reconstitute(order.id, {
      sellerId: order.sellerId,
      productId: order.productId,
      status: order.status as OrderStatus,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
    });
  }
}
