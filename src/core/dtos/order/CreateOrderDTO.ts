import { OrderStatus } from "@/core/domain/enums/OrderStatus";

export type CreateOrderDTO = {
  productId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
};
