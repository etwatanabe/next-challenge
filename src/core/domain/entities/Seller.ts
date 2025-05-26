import { Product } from "@/core/domain/entities/Product";
import { Order } from "@/core/domain/entities/Order";

export type SellerProps = {
  name: string;
  email: string;
  password: string;
  products?: Product[];
  orders?: Order[];
};

export class Seller {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public readonly products: Product[] = [];
  public readonly orders: Order[] = [];

  private constructor(id: string, props: SellerProps) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.products = props.products ?? [];
    this.orders = props.orders ?? [];
  }

  static create(props: SellerProps): Seller {
    if (!Seller.isValidEmail(props.email)) {
      throw new Error("Invalid email format");
    }

    if (!props.name || props.name.trim().length < 2) {
      throw new Error("Name must have at least 2 characters");
    }

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

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
