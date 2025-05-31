import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";
import { ProductResponseDTO } from "@/core/dtos/product/ProductResponseDTO";

export type SellerResponseDTO = {
  id: string;
  name: string;
  email: string;
  products: ProductResponseDTO[];
  orders: Omit<OrderResponseDTO, "sellerId">[];
  stripeAccountId?: string;
}