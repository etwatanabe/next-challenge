export type SellerProps = {
  name: string;
  email: string;
  password: string;
};

export class Seller {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;

  private constructor(id: string, props: SellerProps) {
    this.id = id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  static async create(props: SellerProps): Promise<Seller> {
    return new Seller(crypto.randomUUID(), props);
  }
}
