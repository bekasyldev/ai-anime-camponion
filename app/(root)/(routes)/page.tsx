import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import db from "@/lib/db";

const Page = async () => {
  const categories = await db.category.findMany();
  return (
    <div className="w-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <div>Root Page</div>
    </div>
  );
};

export default Page;
