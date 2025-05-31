import { OrderStatus } from "@/core/domain/enums/OrderStatus";
import { CreateOrderDTO } from "@/core/dtos/order/CreateOrderDTO";
import { createOrderUseCase } from "@/factories/orderUseCaseFactory";
import { getProductByIdUseCase } from "@/factories/productUseCaseFactory";
import { getSellerByProductIdUseCase } from "@/factories/sellerUseCaseFactory";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new order with a product ID
export async function POST(request: NextRequest) {
  try {
    const { id, customerName, customerEmail, customerPhone, customerAddress } =
      await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const seller = await getSellerByProductIdUseCase.execute(id);
    if (!seller) {
      return NextResponse.json(
        { error: `Seller for product ID ${id} not found` },
        { status: 404 }
      );
    }

    const product = await getProductByIdUseCase.execute(id, seller.id);
    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${id} not found` },
        { status: 404 }
      );
    }

    const data: CreateOrderDTO = {
      productId: product.id,
      sellerId: seller.id,
      status: OrderStatus.PENDING,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
    }

    const order = await createOrderUseCase.execute(data);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
