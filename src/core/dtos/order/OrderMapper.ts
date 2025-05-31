import { Order } from "@/core/domain/entities/Order";
import { OrderResponseDTO } from "./OrderResponseDTO";

export class OrderMapper {
  static toResponseDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      sellerId: order.sellerId,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      product: order.product,
    };
  }
}
