import { Product } from "@/core/product/entity/Product";
import { Order } from "@/core/order/entity/Order";

export type SellerProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  products?: Product[];
  orders?: Order[];
  stripeAccountId?: string | null;
};

export class Seller {
  public id: string | null;
  public name: string;
  public email: string;
  public password: string;
  public readonly products: Product[] = [];
  public readonly orders: Order[] = [];
  public stripeAccountId?: string;

  private constructor(props: SellerProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.products = props.products ?? [];
    this.orders = props.orders ?? [];
    this.stripeAccountId = props.stripeAccountId ?? "";
  }

  static create(props: SellerProps): Seller {
    return new Seller(props);
  }

  static reconstitute(props: SellerProps): Seller {
    return new Seller(props);
  }

  public update(
    props: Partial<Omit<SellerProps, "products" | "orders">>
  ): void {
    this.name = props.name ?? this.name;
    this.email = props.email ?? this.email;
    this.password = props.password ?? this.password;
    this.stripeAccountId = props.stripeAccountId ?? this.stripeAccountId;
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
