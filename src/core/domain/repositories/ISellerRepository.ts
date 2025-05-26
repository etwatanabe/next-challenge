import { Seller, SellerProps } from "@/core/domain/entities/Seller";

export interface ISellerRepository {
  create(data: SellerProps): Promise<Seller>;
  findById(id: string): Promise<Seller | null>;
  findByEmail(email: string): Promise<Seller | null>;
  update(id: string, data: Partial<SellerProps>): Promise<Seller>;
  delete(id: string): Promise<void>;
}
