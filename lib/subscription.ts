import { auth } from "@clerk/nextjs";

import db from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { userId } = auth();

    if(!userId) {
        return false;
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId
        },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripePriceId: true
        }
    });

    if(!purchase) {
        return false
    };

    const isValid = 
        purchase.stripePriceId && 
        purchase.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()
    
    return !!isValid;
}