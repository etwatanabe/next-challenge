import { OrderItem } from "@/core/domain/entities/OrderItem";

export type OrderProps = {
  status: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
};

export class Order {
  public readonly id: string;
  public status: string;
  public amount: number;
  public customerName: string;
  public customerEmail: string;
  public customerPhone: string;
  public items: OrderItem[] = [];

  private constructor(id: string, props: OrderProps) {
    this.id = id;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.status = props.status;
    this.amount = props.amount;
    this.items = props.items || [];
  }

  static create(props: OrderProps): Order {
    return new Order(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: OrderProps): Order {
    return new Order(id, props);
  }

  addOrderItem(orderItem: OrderItem): void {
    const exists = this.items.find(
      (op) => op.productId === orderItem.productId
    );

    if (exists) {
      exists.quantity += orderItem.quantity;
    } else {
      this.items.push(orderItem);
    }
  }
}
