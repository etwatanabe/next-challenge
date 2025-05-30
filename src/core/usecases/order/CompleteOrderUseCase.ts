import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

type PaymentInfo = {
  paymentId: string;
  paymentMethod: string;
  amount: number;
  status: string;
};

type CompleteOrderInput = {
  orderId: string;
  paymentInfo: PaymentInfo;
};

export class CompleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderInterface) {}

  async execute({ orderId }: CompleteOrderInput): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Pedido com ID ${orderId} não encontrado`);
    }

    order.updateStatus(OrderStatus.COMPLETED);

    // Adicionar informações de pagamento ao pedido
    // order.addPaymentInfo({
    //   paymentId: paymentInfo.paymentId,
    //   method: paymentInfo.paymentMethod,
    //   amount: paymentInfo.amount,
    //   status: paymentInfo.status,
    // });

    const updatedOrder = await this.orderRepository.update(order);

    return OrderMapper.toResponseDTO(updatedOrder);
  }
}
