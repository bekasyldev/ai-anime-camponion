import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { checkSubscription } from "@/lib/subscription";

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { src, name, description, instructions, seed, categoryId } = body;
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const isPro = await checkSubscription();
        
        if(!isPro) {
            return new NextResponse("Pro subscription required", { status: 403 })
        }

        const campanion = await db.companion.create({
            data: {
                userId,
                src,
                name,
                description, 
                instructions,
                seed,
                categoryId,
            }
    })
    return NextResponse.json(campanion);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500})
    }
}