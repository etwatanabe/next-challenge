export type OrderItemProps = {
  quantity: number;
};

export class OrderItem {
  public readonly orderId: string;
  public readonly productId: string;
  public quantity: number;

  private constructor(orderId: string, productId: string, props: OrderItemProps) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = props.quantity;
  }

  static create(orderId: string, productId: string, props: OrderItemProps): OrderItem {
    return new OrderItem(orderId, productId, props);
  }

  static reconstitute(orderId: string, productId: string, props: OrderItemProps): OrderItem {
    return new OrderItem(orderId, productId, props);
  }
}
