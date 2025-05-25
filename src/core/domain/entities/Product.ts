export type ProductProps = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerId: string;
};

export class Product {
  public readonly id: string;
  public name: string;
  public description: string;
  public price: number;
  public imageUrl: string;
  public readonly sellerId: string;

  private constructor(id: string, props: ProductProps) {
    this.id = id;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.imageUrl = props.imageUrl;
    this.sellerId = props.sellerId;
  }

  static create(props: ProductProps): Product {
    return new Product(crypto.randomUUID(), props);
  }
}
