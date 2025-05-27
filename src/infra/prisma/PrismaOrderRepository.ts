import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { Order } from "@/core/domain/entities/Order";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { OrderItem } from "@/core/domain/entities/OrderItem";
import { $Enums } from "@prisma/client";
import prisma from "@/infra/lib/prisma";

export class PrismaOrderRepository implements IOrderRepository {
  async create(order: Order): Promise<Order> {
    const createdOrder = await prisma.order.create({
      data: {
        id: order.id,
        status: order.status,
        amount: order.amount,
        sellerId: order.sellerId,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return Order.reconstitute(createdOrder.id, {
      status: this.mapPrismaEnumToOrderStatus(createdOrder.status),
      amount: createdOrder.amount.toNumber(),
      sellerId: createdOrder.sellerId,
      items: createdOrder.items.map((item) =>
        OrderItem.reconstitute(createdOrder.id, item.productId, {
          quantity: item.quantity,
        })
      ),
    });
  }

  async findById(id: string): Promise<Order | null> {
    const foundOrder = await prisma.order.findUnique({
      where: { id: id },
      include: { items: true },
    });

    if (!foundOrder) return null;

    return Order.reconstitute(foundOrder.id, {
      status: this.mapPrismaEnumToOrderStatus(foundOrder.status),
      amount: foundOrder.amount.toNumber(),
      sellerId: foundOrder.sellerId,
      items: foundOrder.items.map((item) =>
        OrderItem.reconstitute(foundOrder.id, item.productId, {
          quantity: item.quantity,
        })
      ),
    });
  }

  async findAllBySellerId(sellerId: string): Promise<Order[]> {
    const foundOrders = await prisma.order.findMany({
      where: { sellerId: sellerId },
      include: { items: true },
    });

    return foundOrders.map((order) =>
      Order.reconstitute(order.id, {
        status: this.mapPrismaEnumToOrderStatus(order.status),
        amount: order.amount.toNumber(),
        sellerId: order.sellerId,
        items: order.items.map((item) =>
          OrderItem.reconstitute(order.id, item.productId, {
            quantity: item.quantity,
          })
        ),
      })
    );
  }

  async update(order: Order): Promise<Order> {
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: order.status,
        amount: order.amount,
      }
    });

    return Order.reconstitute(updatedOrder.id, {
      status: this.mapPrismaEnumToOrderStatus(updatedOrder.status),
      amount: updatedOrder.amount.toNumber(),
      sellerId: updatedOrder.sellerId,
      items: order.items.map((item) =>
        OrderItem.reconstitute(updatedOrder.id, item.productId, {
          quantity: item.quantity,
        })
      ),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id: id } });
  }

  private mapPrismaEnumToOrderStatus(status: $Enums.OrderStatus): OrderStatus {
    switch (status) {
      case $Enums.OrderStatus.PENDING:
        return OrderStatus.PENDING;
      case $Enums.OrderStatus.COMPLETED:
        return OrderStatus.COMPLETED;
      case $Enums.OrderStatus.CANCELLED:
        return OrderStatus.CANCELLED;
      default:
        throw new Error("Invalid order status");
    }
  }
}
