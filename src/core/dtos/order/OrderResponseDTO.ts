import { OrderStatus } from "@prisma/client";

export type OrderResponseDTO = {
  id: string;
  sellerId: string;
  productId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
};
