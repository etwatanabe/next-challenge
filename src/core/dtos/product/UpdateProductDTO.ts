export type UpdateProductDTO = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  sellerId: string;
}