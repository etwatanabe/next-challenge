import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";

export class GetOrderByIdUseCase {
  constructor(
    private readonly orderRepository: IOrderInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(orderId: string, sellerId: string) {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${sellerId} not found.`);
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    if (order.sellerId !== sellerId) {
      throw new Error(
        `Order with ID ${orderId} does not belong to seller ${sellerId}.`
      );
    }

    return OrderMapper.toResponseDTO(order);
  }
}
