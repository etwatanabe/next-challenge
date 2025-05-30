import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class CompleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute(id: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found.`);
    }

    order.updateStatus(OrderStatus.COMPLETED);

    const updatedOrder = await this.orderRepository.update(order);

    return OrderMapper.toResponseDTO(updatedOrder);
  }
}
