import { Seller } from "@/core/domain/entities/Seller";
import { SellerResponseDTO } from "./SellerResponseDTO";
import { ProductMapper } from "../product/ProductMapper";
import { OrderMapper } from "../order/OrderMapper";

export class SellerMapper {
  static toResponseDTO(seller: Seller): SellerResponseDTO {
    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      products: seller.products.map((product) => ProductMapper.toResponseDTO(product)),
      orders: seller.orders.map((order) => OrderMapper.toResponseDTO(order)),
    };
  }
}
