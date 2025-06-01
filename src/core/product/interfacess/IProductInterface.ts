import { Product } from "@/core/product/entity/Product";

export interface IProductInterface {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAllBySellerId(sellerId: string): Promise<Product[]>;
  findAllActive(): Promise<Product[]>;
  hasOrders(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  update(product: Product): Promise<Product>;
}
