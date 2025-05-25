import { Seller, SellerProps } from "../entities/Seller";

export interface ISellerRepository {
  create(data: SellerProps): Promise<Seller>;
  findById(id: string): Promise<Seller | null>;
  findAll(): Promise<Seller[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: SellerProps): Promise<Seller>;
}