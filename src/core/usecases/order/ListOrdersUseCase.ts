import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class ListOrdersUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private sellerRepository: ISellerRepository
  ) {}

  async execute(sellerId: string): Promise<OrderResponseDTO[]> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(
        "Could not find seller with the given ID for listing orders."
      );
    }

    const orders = await this.orderRepository.findAllBySellerId(sellerId);

    return orders.map((order) => OrderMapper.toResponseDTO(order));
  }
}
