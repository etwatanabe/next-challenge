import { OrderStatus } from "@/core/domain/enums/OrderStatus";

export type CreateOrderDTO = {
  items: {
    productId: string;
    quantity: number;
  }[];
  status?: OrderStatus;
  amount: number;
  sellerId: string;
}
  