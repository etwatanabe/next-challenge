import { NextRequest, NextResponse } from "next/server";
import stripe from "@/utils/stripe";
import { completeOrderUseCase } from "@/factories/orderUseCaseFactory";
import Stripe from "stripe";

// Desabilitar o bodyParser para receber o corpo bruto da requisição
// necessário para verificação da assinatura do webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Converte o ReadableStream em um Buffer para processamento
 */
async function buffer(
  readable: ReadableStream<Uint8Array> | null
): Promise<Buffer> {
  if (!readable) return Buffer.alloc(0);
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

/**
 * Processa eventos de pagamento do Stripe via webhook
 */
export async function POST(request: NextRequest) {
  // Verificar se temos o secret do webhook configurado
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook Secret não configurado no ambiente");
    return NextResponse.json(
      { error: "Configuração de webhook incompleta" },
      { status: 500 }
    );
  }

  try {
    // Extrair o corpo da requisição como buffer
    const payload = await buffer(request.body!);

    // Obter a assinatura do cabeçalho
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Assinatura do webhook ausente" },
        { status: 400 }
      );
    }

    // Verificar e construir o evento
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro na verificação da assinatura";
      console.error(`Erro na validação do webhook: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook inválido: ${errorMessage}` },
        { status: 400 }
      );
    }

    // Processar eventos específicos
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Validar que temos metadados e ID do pedido
        if (!session.metadata?.orderId) {
          console.warn(
            "Sessão do Stripe sem ID do pedido nos metadados",
            session.id
          );
          return NextResponse.json(
            { warning: "Metadados incompletos na sessão" },
            { status: 200 }
          );
        }

        const orderId = session.metadata.orderId;

        // Validar que temos um ID de pagamento
        if (!session.payment_intent) {
          console.warn(`Sessão ${session.id} sem payment_intent`);
          return NextResponse.json(
            { warning: "Sessão sem payment_intent" },
            { status: 200 }
          );
        }

        // Atualizar o pedido no sistema
        await completeOrderUseCase.execute({
          orderId,
          paymentInfo: {
            paymentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent.id,
            paymentMethod: "stripe",
            amount: (session.amount_total || 0) / 100, // Converter de centavos para reais
            status: "succeeded",
          },
        });

        console.log(`Pedido ${orderId} atualizado com sucesso após pagamento`);
        break;
      }

      // Possibilidade de processar outros tipos de eventos
      case "checkout.session.expired":
        // Lógica para sessões expiradas, se necessário
        console.log("Sessão de checkout expirada:", event.data.object.id);
        break;

      default:
        // Evento não processado explicitamente, mas não é um erro
        console.log(`Evento não processado: ${event.type}`);
    }

    // Resposta de sucesso para o Stripe
    return NextResponse.json(
      { received: true, status: "success" },
      { status: 200 }
    );
  } catch (error) {
    // Capturar qualquer erro não tratado
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar webhook" },
      { status: 500 }
    );
  }
}
