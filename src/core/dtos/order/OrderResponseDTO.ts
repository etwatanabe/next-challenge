import { OrderStatus } from "@prisma/client";
import { ProductResponseDTO } from "../product/ProductResponseDTO";

export type OrderResponseDTO = {
  id: string;
  sellerId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  product: ProductResponseDTO;
};
