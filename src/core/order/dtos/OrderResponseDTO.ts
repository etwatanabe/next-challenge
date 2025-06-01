import { OrderStatus } from "@prisma/client";
import { Product } from "@/core/product/entity/Product";

export type OrderResponseDTO = {
  id: string;
  sellerId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  product: Product;
};
