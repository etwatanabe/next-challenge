import { Order } from '@/core/domain/entities/Order';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAllBySellerId(sellerId: string): Promise<Order[]>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
}