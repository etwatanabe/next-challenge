import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import { Seller } from "@/core/seller/entity/Seller";
import { Product } from "@/core/product/entity/Product";
import { Order } from "@/core/order/entity/Order";
import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { Seller as PrismaSeller } from "@prisma/client";
import { Product as PrismaProduct } from "@prisma/client";
import { Order as PrismaOrder } from "@prisma/client";
import prisma from "@/infra/lib/prisma";

export class PrismaSellerRepository implements ISellerInterface {
  async create(seller: Seller): Promise<Seller> {
    const createdSeller = await prisma.seller.create({
      data: {
        name: seller.name,
        email: seller.email,
        password: seller.password,
        stripeAccountId: seller.stripeAccountId,
      },
      include: {
        products: true,
        orders: { include: { product: true } },
      },
    });

    return this.reconstituteSeller(
      createdSeller,
      createdSeller.orders,
      createdSeller.products
    );
  }

  async findById(id: string): Promise<Seller | null> {
    const foundSeller = await prisma.seller.findUnique({
      where: { id: id },
      include: {
        products: true,
        orders: { include: { product: true } },
      },
    });

    if (!foundSeller) return null;

    return this.reconstituteSeller(
      foundSeller,
      foundSeller.orders,
      foundSeller.products
    );
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const foundSeller = await prisma.seller.findUnique({
      where: { email: email },
      include: {
        products: true,
        orders: { include: { product: true } },
      },
    });

    if (!foundSeller) return null;

    return this.reconstituteSeller(
      foundSeller,
      foundSeller.orders,
      foundSeller.products
    );
  }

  async findByProductId(productId: string): Promise<Seller | null> {
    const foundProduct = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        seller: {
          include: {
            products: true,
            orders: { include: { product: true } },
          },
        },
      },
    });

    if (!foundProduct) return null;

    return this.reconstituteSeller(
      foundProduct.seller,
      foundProduct.seller.orders,
      foundProduct.seller.products
    );
  }

  async update(seller: Seller): Promise<Seller> {
    const updatedSeller = await prisma.seller.update({
      where: { id: seller.id },
      data: {
        name: seller.name,
        email: seller.email,
        password: seller.password,
        stripeAccountId: seller.stripeAccountId,
      },
      include: {
        products: true,
        orders: { include: { product: true } },
      },
    });

    return this.reconstituteSeller(
      updatedSeller,
      updatedSeller.orders,
      updatedSeller.products
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.seller.delete({ where: { id: id } });
  }

  private reconstituteProduct(product: PrismaProduct): Product {
    return Product.reconstitute(product.id, {
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
      imageUrl: product.imageUrl,
      sellerId: product.sellerId,
      isActive: product.isActive,
    });
  }

  private reconstituteOrder(
    order: PrismaOrder & { product: PrismaProduct }
  ): Order {
    return Order.reconstitute(order.id, {
      sellerId: order.sellerId,
      status: order.status as OrderStatus,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      product: this.reconstituteProduct(order.product),
    });
  }

  private reconstituteSeller(
    seller: PrismaSeller,
    orders: (PrismaOrder & { product: PrismaProduct })[],
    products: PrismaProduct[]
  ): Seller {
    const domainOrders = orders.map((order) => this.reconstituteOrder(order));
    const domainProducts = products.map((product) =>
      this.reconstituteProduct(product)
    );

    return Seller.reconstitute(seller.id, {
      name: seller.name,
      email: seller.email,
      password: seller.password,
      products: domainProducts,
      orders: domainOrders,
      stripeAccountId: seller.stripeAccountId,
    });
  }
}
