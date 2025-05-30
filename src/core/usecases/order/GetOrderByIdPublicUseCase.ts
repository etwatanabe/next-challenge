import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";

export class GetOrderByIdPublicUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found.`);
    }

    return OrderMapper.toResponseDTO(order);
  }
}
