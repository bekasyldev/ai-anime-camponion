import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import db from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req:Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // first time
    if(event.type === "checkout.session.completed") {
        const purchase = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if(!session.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await db.purchase.create({
            data: {
                userId: session.metadata?.userId,
                stripeSubscriptionId: purchase.id,
                stripeCustomerId: purchase.customer as string,
                stripePriceId: purchase.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    purchase.current_period_end * 1000
                ),
            },
        });
    }

    if(event.type === "invoice.payment_succeeded") {
        const purchase = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await db.purchase.update({
            where: {
                stripeSubscriptionId: purchase.id
            },
            data: {
                stripePriceId: purchase.items.data[0].id,
                stripeCurrentPeriodEnd: new Date(
                    purchase.current_period_end * 1000
                )
            }
        })
    }
    return new NextResponse(null, { status: 200})
}