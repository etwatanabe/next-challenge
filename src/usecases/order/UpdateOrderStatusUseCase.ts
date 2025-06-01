import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { IOrderInterface } from "@/core/order/interface/IOrderInterface";
import { OrderMapper } from "@/core/order/dtos/OrderMapper";
import { OrderResponseDTO } from "@/core/order/dtos/OrderResponseDTO";

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute(id: string, status: OrderStatus): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found.`);
    }

    order.updateStatus(status);

    const updatedOrder = await this.orderRepository.update(order);

    return OrderMapper.toResponseDTO(updatedOrder);
  }
}
