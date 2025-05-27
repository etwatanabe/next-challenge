export class OrderItem {
  public readonly productId: string;
  public quantity: number;
  public priceAtPurchase: number;

  private constructor(
    productId: string,
    quantity: number,
    priceAtPurchase: number
  ) {
    this.productId = productId;
    this.quantity = quantity;
    this.priceAtPurchase = priceAtPurchase;
  }

  static create(
    productId: string,
    quantity: number,
    priceAtPurchase: number
  ): OrderItem {
    return new OrderItem(productId, quantity, priceAtPurchase);
  }

  addQuantity(quantity: number = 1): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }
    this.quantity += quantity;
  }

  setQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative.");
    }
    this.quantity = quantity;
  }

  update(props: Partial<Omit<OrderItem, "sellerId">>): void {
    if (props.quantity) this.quantity = props.quantity;
  }

  totalPrice(): number {
    return this.quantity * this.priceAtPurchase;
  }
}
