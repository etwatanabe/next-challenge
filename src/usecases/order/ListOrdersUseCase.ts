import { IOrderInterface } from "@/core/order/interface/IOrderInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { OrderMapper } from "@/core/order/dtos/OrderMapper";
import { OrderResponseDTO } from "@/core/order/dtos/OrderResponseDTO";

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
