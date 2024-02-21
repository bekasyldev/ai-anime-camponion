import { Categories } from "@/components/categories";
import { Companions } from "@/components/companion";
import { SearchInput } from "@/components/search-input";
import db from "@/lib/db";

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
      // fullText search
      // name: {
      //   search: searchParams.name,
      // },
    },
    orderBy: {
      createdAt: "desc",
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
