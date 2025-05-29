import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
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
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute({ orderId }: CompleteOrderInput): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Pedido com ID ${orderId} não encontrado`);
    }

    // Atualizar o status do pedido para "concluído"
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
