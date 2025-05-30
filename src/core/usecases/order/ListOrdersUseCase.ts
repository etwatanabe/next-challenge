import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class ListOrdersUseCase {
  constructor(
    private readonly orderRepository: IOrderInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(sellerId: string): Promise<OrderResponseDTO[]> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${sellerId} not found.`);
    }

    const orders = await this.orderRepository.findAllBySellerId(sellerId);

    return orders.map((order) => OrderMapper.toResponseDTO(order));
  }
}
