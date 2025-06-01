import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { Product } from "../../product/entity/Product";

export type OrderProps = {
  sellerId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  product: Product;
};

export class Order {
  public readonly id: string;
  public readonly sellerId: string;
  public status: OrderStatus;
  public customerName: string;
  public customerEmail: string;
  public customerPhone: string;
  public customerAddress: string;
  public product: Product;

  private constructor(id: string, props: OrderProps) {
    this.id = id;
    this.sellerId = props.sellerId;
    this.status = props.status ?? OrderStatus.PENDING;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.customerAddress = props.customerAddress;
    this.product = props.product;
  }

  static create(props: OrderProps): Order {
    return new Order("", props);
  }

  static reconstitute(id: string, props: OrderProps): Order {
    return new Order(id, props);
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }
}
