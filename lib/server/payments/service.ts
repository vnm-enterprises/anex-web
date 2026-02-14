import { PaymentStatus, PaymentType } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { env } from "@/lib/server/env";
import { HttpError } from "@/lib/server/http";
import { getStripe, toLkrMinorUnits } from "@/lib/server/payments/stripe";

export async function createCheckoutSession(input: {
  userId: string;
  type: PaymentType;
  amountLkr: number;
  currency: string;
  listingId?: string;
  subscriptionId?: string;
  metadata?: Record<string, string>;
}) {
  if (!env.stripeSuccessUrl || !env.stripeCancelUrl) {
    throw new HttpError(500, "Stripe redirect URLs are not configured");
  }

  const payment = await prisma.payment.create({
    data: {
      userId: input.userId,
      type: input.type,
      status: PaymentStatus.PENDING,
      amountLkr: input.amountLkr,
      currency: input.currency,
      listingId: input.listingId,
      subscriptionId: input.subscriptionId,
      metadata: input.metadata ?? {},
    },
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.stripeSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: env.stripeCancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "lkr",
          unit_amount: toLkrMinorUnits(input.amountLkr),
          product_data: {
            name: `Annex.lk ${input.type.toLowerCase()} payment`,
          },
        },
      },
    ],
    metadata: {
      paymentId: payment.id,
      type: input.type,
      ...(input.metadata ?? {}),
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      providerSessionId: session.id,
    },
  });

  return { paymentId: payment.id, checkoutUrl: session.url, sessionId: session.id };
}

export async function processStripeWebhook(rawBody: string, signature: string) {
  if (!env.stripeWebhookSecret) {
    throw new HttpError(500, "Stripe webhook secret missing");
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);

  await prisma.paymentWebhookEvent.upsert({
    where: { eventId: event.id },
    update: { eventType: event.type, payload: event as unknown as object },
    create: {
      provider: "stripe",
      eventId: event.id,
      eventType: event.type,
      payload: event as unknown as object,
    },
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.SUCCEEDED,
          providerPaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.CANCELED },
      });
    }
  }

  return { received: true, type: event.type };
}
