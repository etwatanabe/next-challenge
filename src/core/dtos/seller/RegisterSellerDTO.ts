import { Order } from "@/core/domain/entities/Order";
import { Product } from "@/core/domain/entities/Product";

export type RegisterSellerDTO = {
  name: string;
  email: string;
  password: string;
  products: Product[];
  orders: Order[];
  createStripeAccount?: boolean;
};
