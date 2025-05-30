import { OrderStatus } from "@/core/domain/enums/OrderStatus";

export type OrderProps = {
  sellerId: string;
  productId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
};

export class Order {
  public readonly id: string;
  public readonly sellerId: string;
  public readonly productId: string;
  public status: OrderStatus;
  public customerName: string;
  public customerEmail: string;
  public customerPhone: string;
  public customerAddress: string;

  private constructor(id: string, props: OrderProps) {
    this.id = id;
    this.sellerId = props.sellerId;
    this.productId = props.productId;
    this.status = props.status ?? OrderStatus.PENDING;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.customerAddress = props.customerAddress;
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
}
