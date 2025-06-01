import { Order } from "@/core/order/entity/Order";
import { OrderStatus } from "@/core/order/enums/OrderStatus";
import { IOrderInterface } from "@/core/order/interface/IOrderInterface";
import { IProductInterface } from "@/core/product/interfacess/IProductInterface";
import { ISellerInterface } from "@/core/seller/interfaces/ISellerInterface";
import stripe from "@/utils/stripe";

export class CheckoutUseCase {
  constructor(
    private readonly ProductRepository: IProductInterface,
    private readonly OrderRepository: IOrderInterface,
    private readonly SellerRepository: ISellerInterface
  ) {}
  async execute(
    data: {
      productId: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      customerAddress: string;
    },
    origin: string
  ): Promise<string> {
    const {
      productId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
    } = data;
    if (
      !productId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress
    ) {
      throw new Error("All fields are required");
    }

    const product = await this.ProductRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const seller = await this.SellerRepository.findByProductId(product.id!);
    if (!seller || !seller.id) {
      throw new Error(`Seller for product ${product.id} not found`);
    }

    if (!seller.stripeAccountId) {
      throw new Error("Seller does not have a configured Stripe account");
    }

    const order = Order.create({
      product,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      sellerId: seller.id,
      status: OrderStatus.PENDING,
    });

    const createdOrder = await this.OrderRepository.create(order);
    if (!createdOrder) {
      throw new Error("Failed to create order");
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/confirmation/${createdOrder.id}?success=true`,
      cancel_url: `${origin}/buy/${productId}?cancelled=true`,
      metadata: { orderId: createdOrder.id, sellerId: seller.id },
      payment_intent_data: {
        application_fee_amount: Math.round(product.price * 10), // 10%
        transfer_data: {
          destination: seller.stripeAccountId,
        },
      },
    });

    return session.id;
  }
}
