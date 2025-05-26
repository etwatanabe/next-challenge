import { Order, OrderProps } from '@/core/domain/entities/Order';

export interface IOrderRepository {
  create(data: OrderProps): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  update(id:string, data: Partial<OrderProps>): Promise<Order>;
  delete(id: string): Promise<void>;
}