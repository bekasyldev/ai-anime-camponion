import db from "@/lib/db";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ClientChat } from "./_components/client-chat";

const ChatIdPage = async ({ params }: { params: { chatId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const character = await db.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
    },
  });

  if (!character) {
    redirect("/");
  }

  return <ClientChat data={character} />;
};

export default ChatIdPage;
