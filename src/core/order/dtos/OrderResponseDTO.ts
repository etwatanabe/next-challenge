import { Product } from "@/core/product/entity/Product";
import { OrderStatus } from "../enums/OrderStatus";

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
