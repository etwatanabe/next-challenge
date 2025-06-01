import { Seller } from "@/core/seller/entity/Seller";
import { SellerResponseDTO } from "./SellerResponseDTO";
import { ProductMapper } from "@/core/product/dtos/ProductMapper";
import { OrderMapper } from "@/core/order/dtos/OrderMapper";

export class SellerMapper {
  static toResponseDTO(seller: Seller): SellerResponseDTO {
    return {
      id: seller.id as string,
      name: seller.name,
      email: seller.email,
      products: seller.products.map((product) =>
        ProductMapper.toResponseDTO(product)
      ),
      orders: seller.orders.map((order) => OrderMapper.toResponseDTO(order)),
      stripeAccountId: seller.stripeAccountId,
    };
  }
}
