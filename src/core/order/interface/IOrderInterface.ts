import { Order } from "@/core/order/entity/Order";

export interface IOrderInterface {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAllBySellerId(sellerId: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
}
