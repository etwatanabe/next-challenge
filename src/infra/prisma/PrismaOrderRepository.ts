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
        status: order.status,
        amount: order.amount,
        sellerId: order.sellerId,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return Order.reconstitute(createdOrder.id, {
      sellerId: createdOrder.sellerId,
      items: createdOrder.items.map((item) =>
        OrderItem.create(
          item.productId,
          item.quantity,
          item.priceAtPurchase.toNumber()
        )
      ),
    });
  }

  async addItem(orderId: string, item: OrderItem): Promise<Order> {
    await prisma.orderItem.upsert({
      where: {
        orderId_productId: {
          orderId: orderId,
          productId: item.productId,
        },
      },
      create: {
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      },
      update: {
        quantity: {
          increment: item.quantity,
        },
        priceAtPurchase: item.priceAtPurchase,
      },
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return Order.reconstitute(updatedOrder.id, {
      sellerId: updatedOrder.sellerId,
      items: updatedOrder.items.map((item) =>
        OrderItem.create(
          item.productId,
          item.quantity,
          item.priceAtPurchase.toNumber()
        )
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
      sellerId: foundOrder.sellerId,
      items: foundOrder.items.map((item) =>
        OrderItem.create(
          item.productId,
          item.quantity,
          item.priceAtPurchase.toNumber()
        )
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
        sellerId: order.sellerId,
        items: order.items.map((item) =>
          OrderItem.create(
            item.productId,
            item.quantity,
            item.priceAtPurchase.toNumber()
          )
        ),
      })
    );
  }

  async findAllByStatus(status: OrderStatus): Promise<Order[]> {
    const prismaEnum = this.mapOrderStatusToPrismaEnum(status);

    const foundOrders = await prisma.order.findMany({
      where: { status: prismaEnum },
      include: { items: true },
    });

    return foundOrders.map((order) =>
      Order.reconstitute(order.id, {
        sellerId: order.sellerId,
        items: order.items.map((item) =>
          OrderItem.create(
            item.productId,
            item.quantity,
            item.priceAtPurchase.toNumber()
          )
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
        items: {
          deleteMany: {},
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: { items: true },
    });

    return Order.reconstitute(updatedOrder.id, {
      sellerId: updatedOrder.sellerId,
      items: order.items.map((item) =>
        OrderItem.create(item.productId, item.quantity, item.priceAtPurchase)
      ),
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({ where: { id: id } });
  }

  private mapOrderStatusToPrismaEnum(status: OrderStatus): $Enums.OrderStatus {
    switch (status) {
      case OrderStatus.PENDING:
        return $Enums.OrderStatus.PENDING;
      case OrderStatus.COMPLETED:
        return $Enums.OrderStatus.COMPLETED;
      case OrderStatus.CANCELLED:
        return $Enums.OrderStatus.CANCELLED;
      default:
        throw new Error("Invalid order status");
    }
  }
}
