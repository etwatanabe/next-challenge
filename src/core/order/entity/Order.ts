import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { Product } from "@/core/product/entity/Product";

export type OrderProps = {
  id?: string;
  sellerId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  product: Product;
};

export class Order {
  public id: string | null;
  public sellerId: string;
  public status: OrderStatus;
  public customerName: string;
  public customerEmail: string;
  public customerPhone: string;
  public customerAddress: string;
  public product: Product;

  private constructor(props: OrderProps) {
    this.id = props.id ?? null;
    this.sellerId = props.sellerId;
    this.status = props.status ?? OrderStatus.PENDING;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.customerAddress = props.customerAddress;
    this.product = props.product;
  }

  static create(props: OrderProps): Order {
    return new Order(props);
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }
}
