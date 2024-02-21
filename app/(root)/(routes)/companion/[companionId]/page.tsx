import db from "@/lib/db";
import { CompanionForm } from "./_components/campanion-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

const CompanionIdPage = async ({
  params,
}: {
  params: { companionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  // TO:DO Check subsciption

  const companion = await db.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  const categories = await db.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
