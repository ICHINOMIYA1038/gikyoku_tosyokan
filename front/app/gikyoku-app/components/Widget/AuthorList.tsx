import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCardSmall from "../PostCardSmall";
import { BadgeGreen } from "../Badge";
import { useRouter } from "next/router";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const AuthorList = ({ authors }: any) => {
  const router = useRouter();
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">作者一覧</h2>
        <p>個別ページは順次作成していきますm(__)m</p>
        <div className="flex gap-2 flex-wrap">
          {authors &&
            authors.map((author: any) => (
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/authors/${author.id}`);
                }}
              >
                <BadgeGreen key={author.id} text={author.name} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AuthorList;
