import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { ProductResponseDTO } from "../product/ProductResponseDTO";

export type CreateOrderDTO = {
  sellerId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  product: ProductResponseDTO;
};
