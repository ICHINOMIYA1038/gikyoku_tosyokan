import * as React from "react";
import { Post as PostType } from "@prisma/client";
import Badge, { BadgeGreen } from "../Badge";
import { useRouter } from "next/router";
import Link from "next/link";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const CategoryList = ({ categories }: any) => {
  const router = useRouter();
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">カテゴリ一覧</h2>
        <p>カテゴリは順次追加していきますm(__)m</p>
        <div className="flex gap-2 flex-wrap">
          {categories &&
            categories.map((category: any) => (
              <Link
                className="cursor-pointer"
                href={`/categories/${category.id}`}
              >
                <Badge key={category.id} text={category.name} />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
