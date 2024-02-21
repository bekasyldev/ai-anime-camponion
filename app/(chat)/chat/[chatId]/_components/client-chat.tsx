"use client";

import { useCompletion } from "ai/react";
import { Companion, Message } from "@prisma/client";
import { ChatHeader } from "./chat-header";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chate-messages";

interface ClientChatProps {
  companion: Companion & {
    messages: Message[];
  };
}

export const ClientChat = ({ companion }: ClientChatProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>(companion.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      // wait until bot generate answer
      api: `/api/chat/${companion.id}`,
      onFinish(prompt, completion) {
        // store it in array exicting messages
        const systemMessage = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
