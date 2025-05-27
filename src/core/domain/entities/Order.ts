import { OrderItem } from "@/core/domain/entities/OrderItem";
import { OrderStatus } from "@/core/domain/enums/OrderStatus";

export type OrderProps = {
  status: OrderStatus;
  amount: number;
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
    this.status = props.status ?? OrderStatus.PENDING;
    this.amount = props.amount;
    this.items = props.items ?? [];
    this.sellerId = props.sellerId;
  }

  static create(props: OrderProps): Order {
    return new Order(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: OrderProps): Order {
    return new Order(id, props);
  }

  update(props: Partial<Omit<OrderProps, "sellerId">>): void {
    if (props.status) this.status = props.status;
    if (props.amount) this.amount = props.amount;
  }

  addItem(orderItem: OrderItem): void {
    const exists = this.items.find((item) => item.productId === item.productId);
    if (exists) {
      exists.quantity += orderItem.quantity;
    } else {
      this.items.push(orderItem);
    }
  }
}
