import { Product } from "@/core/domain/entities/Product";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string, sellerId: string): Promise<Product | null>;
  findAllBySellerId(sellerId: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
  update(product: Product): Promise<Product>;
}
