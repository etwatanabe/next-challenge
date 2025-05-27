import { Order } from "@/core/domain/entities/Order";
import { OrderItem } from "@/core/domain/entities/OrderItem";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  addItem(orderId: string, item: OrderItem): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAllBySellerId(sellerId: string): Promise<Order[]>;
  findAllByStatus(status: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
}
