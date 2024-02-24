import { Categories } from "@/components/categories";
import { Companions } from "@/components/companion";
import { SearchInput } from "@/components/search-input";
import db from "@/lib/db";
import { Companion, Message } from "@prisma/client";

// server component
interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await db.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: searchParams.name,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await db.category.findMany();
  return (
    <div className="w-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
