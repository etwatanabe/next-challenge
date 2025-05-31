import { Product } from "@/core/domain/entities/Product";
import { Order } from "@/core/domain/entities/Order";

export type SellerProps = {
  name: string;
  email: string;
  password: string;
  products?: Product[];
  orders?: Order[];
  stripeAccountId?: string;
};

export class Seller {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public readonly products: Product[] = [];
  public readonly orders: Order[] = [];
  public stripeAccountId?: string;

  private constructor(id: string, props: SellerProps) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.products = props.products ?? [];
    this.orders = props.orders ?? [];
    this.stripeAccountId = props.stripeAccountId;
  }

  static create(props: SellerProps): Seller {
    return new Seller(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: SellerProps): Seller {
    return new Seller(id, props);
  }

  public addOrder(order: Order): void {
    this.orders.push(order);
  }

  public addProduct(product: Product): void {
    this.products.push(product);
  }

  public removeProduct(id: string): void {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    this.products.splice(productIndex, 1);
  }
}
