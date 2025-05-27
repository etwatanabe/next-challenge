import { OrderItem } from "@/core/domain/entities/OrderItem";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";

export type OrderProps = {
  items: OrderItem[];
  sellerId: string;
};

export class Order {
  public readonly id: string;
  public status: OrderStatus;
  public amount: number;
  public items: OrderItem[];
  public readonly sellerId: string;

  private constructor(id: string, props: OrderProps) {
    this.id = id;
    this.status = OrderStatus.PENDING;
    this.items = props.items;
    this.sellerId = props.sellerId;
    this.amount = this.totalPrice();
  }

  static create(props: OrderProps): Order {
    return new Order(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: OrderProps): Order {
    return new Order(id, props);
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  addItem(item: OrderItem): void {
    const exists = this.items.find((i) => i.productId === item.productId);
    if (exists) {
      exists.addQuantity(item.quantity);
    } else {
      this.items.push(
        OrderItem.create(item.productId, item.quantity, item.priceAtPurchase)
      );
    }

    this.amount = this.totalPrice();
  }

  private totalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + item.totalPrice();
    }, 0);
  }
}
