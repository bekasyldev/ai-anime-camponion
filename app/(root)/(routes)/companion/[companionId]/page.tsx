import db from "@/lib/db";
import { CompanionForm } from "./_components/campanion-form";
import { redirect } from "next/navigation";

const CompanionIdPage = async ({
  params,
}: {
  params: { companionId: string };
}) => {
  // TO:DO Check subsciption

  const companion = await db.companion.findUnique({
    where: {
      id: params.companionId,
    },
  });

  const categories = await db.category.findMany();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
