export type ProductProps = {
  sellerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive?: boolean;
};

export class Product {
  public readonly id: string;
  public readonly sellerId: string;
  public name: string;
  public description: string;
  public price: number;
  public imageUrl: string;
  public isActive?: boolean;

  private constructor(id: string, props: ProductProps) {
    this.id = id;
    this.sellerId = props.sellerId;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.imageUrl = props.imageUrl;
    this.isActive = props.isActive ?? true;
  }

  static create(props: ProductProps): Product {
    return new Product(crypto.randomUUID(), props);
  }

  static reconstitute(id: string, props: ProductProps): Product {
    return new Product(id, props);
  }

  deactivate(): void {
    this.isActive = false;
  }

  update(props: Partial<Omit<ProductProps, "sellerId">>): void {
    if (props.name) this.name = props.name;
    if (props.description) this.description = props.description;
    if (props.price) this.price = props.price;
    if (props.imageUrl) this.imageUrl = props.imageUrl;
    if (props.isActive) this.isActive = props.isActive;
  }
}
