import { Order } from "@/core/order/entity/Order";
import { Product } from "@/core/product/entity/Product";

export type RegisterSellerDTO = {
  name: string;
  email: string;
  password: string;
  products: Product[];
  orders: Order[];
  createStripeAccount?: boolean;
};
