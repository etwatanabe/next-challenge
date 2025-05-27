import { OrderStatus } from "@prisma/client";

export type OrderResponseDTO = {
  id: string;
  status: OrderStatus;
  amount: number;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
};
