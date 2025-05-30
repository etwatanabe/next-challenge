export type ProductProps = {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export class Product {
  public readonly id: string;
  public readonly sellerId: string;
  public name: string;
  public description: string;
  public price: number;
  public imageUrl: string;

  private constructor(id: string, props: ProductProps) {
    this.id = id;
    this.sellerId = props.sellerId;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.imageUrl = props.imageUrl;
  }

  static create(props: ProductProps): Product {
    return new Product(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: ProductProps): Product {
    return new Product(id, props);
  }

  update(props: Partial<Omit<ProductProps, "sellerId">>): void {
    if (props.name) this.name = props.name;
    if (props.description) this.description = props.description;
    if (props.price) this.price = props.price;
    if (props.imageUrl) this.imageUrl = props.imageUrl;
  }
}
