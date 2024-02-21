"use client";

import { Companion, Message } from "@prisma/client";

interface ChatMessagesProps {
  companion: Companion;
  isLoading: boolean;
  messages: Message[];
}

export const ChatMessages = ({
  companion,
  isLoading,
  messages,
}: ChatMessagesProps) => {
  return <div>Messages</div>;
};
