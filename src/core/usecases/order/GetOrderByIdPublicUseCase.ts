import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class GetOrderByIdPublicUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute(id: string): Promise<OrderResponseDTO | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) return null;

    return OrderMapper.toResponseDTO(order);
  }
}
