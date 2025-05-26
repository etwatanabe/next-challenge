import { Prisma } from "@prisma/client";
import { Order } from "@/core/domain/entities/Order";
import { OrderItem } from "@/core/domain/entities/OrderItem";
import { Product } from "@/core/domain/entities/Product";
import { Seller, SellerProps } from "@/core/domain/entities/Seller";
import { ISellerRepository } from "@/core/domain/repositories/ISellerRepository";
import prisma from "@/infra/lib/prisma";

type PrismaSeller = Prisma.SellerGetPayload<{
  include: {
    products: true;
    orders: {
      include: {
        items: true;
      };
    };
  };
}>;

export class PrismaSellerRepository implements ISellerRepository {
  async create(data: SellerProps): Promise<Seller> {
    const createdSeller = await prisma.seller.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      include: {
        products: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    return this.toDomain(createdSeller, [], []);
  }

  async findById(id: Seller["id"]): Promise<Seller | null> {
    const foundSeller = await prisma.seller.findUnique({
      where: { id: id },
      include: {
        products: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!foundSeller) return null;

    const domainProducts = this.toDomainProducts(foundSeller.products);

    const domainOrders = this.toDomainOrders(foundSeller.orders);

    return this.toDomain(foundSeller, domainProducts, domainOrders);
  }

  async findByEmail(email: Seller["email"]): Promise<Seller | null> {
    const foundSeller = await prisma.seller.findUnique({
      where: { email: email },
      include: {
        products: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!foundSeller) return null;

    const domainProducts = this.toDomainProducts(foundSeller.products);

    const domainOrders = this.toDomainOrders(foundSeller.orders);

    return this.toDomain(foundSeller, domainProducts, domainOrders);
  }

  async update(id: Seller["id"], data: Partial<SellerProps>): Promise<Seller> {
    const updatedSeller = await prisma.seller.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      include: {
        products: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    const domainProducts = this.toDomainProducts(updatedSeller.products);

    const domainOrders = this.toDomainOrders(updatedSeller.orders);

    return this.toDomain(updatedSeller, domainProducts, domainOrders);
  }

  async delete(id: string): Promise<void> {
    await prisma.seller.delete({ where: { id } });
  }

  private toDomain(
    seller: PrismaSeller,
    products: Product[],
    orders: Order[]
  ): Seller {
    return Seller.reconstitute(seller.id, {
      name: seller.name,
      email: seller.email,
      password: seller.password,
      products: products,
      orders: orders,
    });
  }

  private toDomainProducts(products: PrismaSeller["products"]): Product[] {
    return products.map((product) =>
      Product.reconstitute(product.id, {
        name: product.name,
        description: product.description,
        price: product.price.toNumber(),
        imageUrl: product.imageUrl,
        sellerId: product.sellerId,
      })
    );
  }

  private toDomainOrders(orders: PrismaSeller["orders"]): Order[] {
    return orders.map((order) =>
      Order.reconstitute(order.id, {
        status: order.status,
        amount: order.amount.toNumber(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: order.items.map((item) =>
          OrderItem.reconstitute(item.orderId, item.productId, {
            quantity: item.quantity,
          })
        ),
      })
    );
  }
}
