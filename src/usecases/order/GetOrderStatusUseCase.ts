import { IOrderInterface } from "@/core/order/interface/IOrderInterface";

export class GetOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute(orderId: string): Promise<string> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return order.status;
  }
}
