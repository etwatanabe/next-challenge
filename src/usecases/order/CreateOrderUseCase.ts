import { Order } from "@/core/order/entity/Order";
import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { IOrderInterface } from "@/core/order/interface/IOrderInterface";
import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { CreateOrderDTO } from "@/core/order/dtos/CreateOrderDTO";
import { OrderMapper } from "@/core/order/dtos/OrderMapper";
import { OrderResponseDTO } from "@/core/order/dtos/OrderResponseDTO";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderInterface,
    private readonly productRepository: IProductInterface,
    private readonly sellerRepository: ISellerInterface
  ) {}

  async execute(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    const product = await this.productRepository.findById(data.productId);
    if (!product || !product.id) {
      throw new Error(`Product with ID ${data.productId} not found.`);
    }

    const seller = await this.sellerRepository.findByProductId(product.id);
    if (!seller || !seller.id) {
      throw new Error(`Seller for product ID ${product.id} not found.`);
    }

    const orderProps = {
      sellerId: seller.id,
      status: OrderStatus.PENDING,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      product: product,
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
