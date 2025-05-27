import { Order } from "@/core/domain/entities/Order";
import { OrderItem } from "@/core/domain/entities/OrderItem";
import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { IProductRepository } from "@/core/domain/repositories/IProductRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import { CreateOrderDTO } from "@/core/dtos/order/CreateOrderDTO";
import { OrderMapper } from "@/core/dtos/order/OrderMapper";
import { OrderResponseDTO } from "@/core/dtos/order/OrderResponseDTO";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly sellerRepository: ISellerRepository
  ) {}

  async execute(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    const seller = await this.sellerRepository.findById(data.sellerId);
    if (!seller) {
      throw new Error(`Seller with ID ${data.sellerId} not found.`);
    }

    if (data.items.length === 0) {
      throw new Error("Order must have at least one item.");
    }

    const items = await Promise.all(
      data.items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        return OrderItem.create(product.id, item.quantity, product.price);
      })
    );

    if (!items) {
      throw new Error("Failed to create order items.");
    }

    const orderProps: CreateOrderDTO = {
      sellerId: seller.id,
      items: items,
    };

    const order = Order.create(orderProps);

    const createdOrder = await this.orderRepository.create(order);
    if (!createdOrder) {
      throw new Error("Failed to create order.");
    }

    return OrderMapper.toResponseDTO(order);
  }
}
