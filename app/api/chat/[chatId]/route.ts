import  { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { ratelimit } from "@/lib/rate-limit";
import db from "@/lib/db";

export async function POST(
    req:Request,
    { params }: { params: { chatId: string }}
) {
    try {
        const { prompt } = await req.json();
        const user = await currentUser();

        if(!user || !user.id){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // if user execeeded limit block find and block that user
        const identifier = req.url + "-" + user.id;
        const { success } = await ratelimit(identifier);

        if(!success) {
            return new NextResponse("Rate limit execeeded", { status: 429 });
        }

        const companion = await db.companion.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id
                    }
                }
            }
        });
        if(!companion) {
            return new NextResponse("Companion not found", { status: 404 });
        }

        const name = companion.id;
        const companionFileName = name + ".txt";


        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "llama2-13b"
        };

        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(companionKey);

        // to create ai chat skeleton for answering qs for user
        if(records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companionFileName
        );

        let relevantHistory = "";

        // to check boolean or not !!
        if(!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n")
        };

        const { handlers } = LangChainStream();

        // Call Replicate for inference
        const model = new Replicate({
            model:
            "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
            max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // turn verbose for debugging
        model.verbose = true;

        const resp = String(
            await model
              .call(
                `
              ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 
      
              ${companion.instructions}
      
              Below are relevant details about ${companion.name}'s past and the conversation you are in.
              ${relevantHistory}
      
      
              ${recentChatHistory}\n${companion.name}:`
              )
              .catch(console.error)
          );

          const cleaned = resp.replace(",", "");
          const chunks = cleaned.split("\n");
          const response = chunks[0];

          await memoryManager.writeToHistory("" + response.trim(), companionKey);
        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null);
        if (response !== undefined && response.length > 1) {
        memoryManager.writeToHistory("" + response.trim(), companionKey);

        await db.companion.update({
            where: {
            id: params.chatId
            },
            data: {
            messages: {
                create: {
                content: response.trim(),
                role: "system",
                userId: user.id,
                },
            },
            }
        });
        }

        return new StreamingTextResponse(s);

    } catch (error) {
        console.log("[CHAT_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


