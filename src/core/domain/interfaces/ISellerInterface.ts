import { Seller } from "@/core/domain/entities/Seller";

export interface ISellerInterface {
  create(seller: Seller): Promise<Seller>;
  findById(id: string): Promise<Seller | null>;
  findByEmail(email: string): Promise<Seller | null>;
  findByProductId(productId: string): Promise<Seller | null>;
  update(seller: Seller): Promise<Seller>;
  delete(id: string): Promise<void>;
}
