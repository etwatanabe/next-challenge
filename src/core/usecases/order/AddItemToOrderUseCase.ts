import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";
import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { OrderItem } from "@/core/domain/entities/OrderItem";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class AddItemToOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(
    orderId: string,
    productId: string,
    quantity: number,
    sellerId: string
  ): Promise<OrderResponseDTO> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${sellerId} does not own this order.`);
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot add items to an order that is not pending.`);
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    const orderItem = OrderItem.create(productId, quantity, product.price);

    order.addItem(orderItem);

    const updatedOrder = await this.orderRepository.addItem(
      order.id,
      orderItem
    );

    return OrderMapper.toResponseDTO(updatedOrder);
  }
}
