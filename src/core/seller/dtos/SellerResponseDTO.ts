import { OrderResponseDTO } from "@/core/order/dtos/OrderResponseDTO";
import { ProductResponseDTO } from "@/core/product/dtos/ProductResponseDTO";

export type SellerResponseDTO = {
  id: string;
  name: string;
  email: string;
  products: ProductResponseDTO[];
  orders: Omit<OrderResponseDTO, "sellerId">[];
  stripeAccountId?: string;
};
