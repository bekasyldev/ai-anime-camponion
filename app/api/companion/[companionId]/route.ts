import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: {companionId: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!params.companionId) {
            return new NextResponse("Companion ID required", { status: 400 });
          }
          
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check subscription 

        const campanion = await db.companion.update({
            where: {
                id: params.companionId,
                userId,
            },
            data: {
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