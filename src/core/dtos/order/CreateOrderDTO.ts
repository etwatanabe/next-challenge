import { OrderItem } from "@/core/domain/entities/OrderItem";

export type CreateOrderDTO = {
  sellerId: string;
  items: OrderItem[];
};
