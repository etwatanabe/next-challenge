import { Product, ProductProps } from "@/core/domain/entities/Product";

export interface IProductRepository {
  create(data: ProductProps): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: string, data: ProductProps): Promise<Product>;
  delete(id: string): Promise<void>;
}