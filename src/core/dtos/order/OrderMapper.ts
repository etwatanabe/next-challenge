import { Order } from "@/core/domain/entities/Order";
import { OrderResponseDTO } from "./OrderResponseDTO";

export class OrderMapper {
  static toResponseDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      status: order.status,
      amount: order.amount,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
    };
  }
}
