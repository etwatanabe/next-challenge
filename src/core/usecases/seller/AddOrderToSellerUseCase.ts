import { Seller } from "@/core/domain/entities/Seller";
import { IOrderRepository } from "@/core/domain/repositories/IOrderRepository";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";

export class AddOrderToSellerUseCase {
  constructor(
    private readonly sellerRepository: ISellerRepository,
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute(sellerId: string, orderId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    seller.addOrder(order);

    const updatedSeller = await this.sellerRepository.update(sellerId, seller);
    if (!updatedSeller) {
      throw new Error("Failed to update seller with new order");
    }

    return updatedSeller;
  }
}
