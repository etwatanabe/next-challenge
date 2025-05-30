import { Order } from "@/core/domain/entities/Order";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { IOrderInterface } from "@/core/domain/interfaces/IOrderInterface";
import { IProductInterface } from "@/core/domain/interfaces/IProductInterface";
import { ISellerInterface } from "@/core/domain/interfaces/ISellerInterface";
import { CreateOrderDTO } from "@/core/dtos/order/CreateOrderDTO";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderInterface,
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${data.sellerId} not found.`);
    }

    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error(`Product with ID ${data.productId} not found.`);
    }

    const orderProps: CreateOrderDTO = {
      sellerId: data.sellerId,
      productId: data.productId,
      status: OrderStatus.PENDING,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,  
    };

    const order = Order.create(orderProps);
    if (!order) {
      throw new Error("Failed to create order entity.");
    }
    
    const createdOrder = await this.orderRepository.create(order);
    if (!createdOrder) {
      throw new Error("Failed to create order.");
    }

    return OrderMapper.toResponseDTO(order);
  }
}
