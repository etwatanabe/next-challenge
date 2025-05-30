import { Seller } from "@/core/domain/entities/Seller";
import { SellerResponseDTO } from "./SellerResponseDTO";

export class OrderMapper {
  static toResponseDTO(seller: Seller): SellerResponseDTO {
    return {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      products: seller.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
      })),
      orders: seller.orders.map(order => ({
        id: order.id,
        status: order.status,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        productId: order.productId,
      })),
    };
  }
}
