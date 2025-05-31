import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class GetOrderByIdUseCase {
  constructor(
    private readonly orderRepository: IOrderInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(orderId: string, sellerId: string): Promise<OrderResponseDTO | null> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${sellerId} not found.`);
    }

    const order = await this.orderRepository.findById(orderId);
    
    if (!order) return null;

    if (order.sellerId !== sellerId) return null;

    return OrderMapper.toResponseDTO(order);
  }
}
