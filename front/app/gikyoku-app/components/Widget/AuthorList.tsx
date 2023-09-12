import * as React from "react";
import { Post as PostType } from "@prisma/client";
import PostCardSmall from "../PostCardSmall";
import { BadgeGreen } from "../Badge";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
};

const AuthorList = ({ authors }: any) => {
  return (
    <>
      <div className="basic-card p-4 inline-block">
        <h2 className="m-4">作者一覧</h2>
        <p>個別ページは順次作成していきますm(__)m</p>
        <div className="flex gap-2 flex-wrap">
          {authors &&
            authors.map((author: any) => (
              <div>
                <BadgeGreen key={author.id} text={author.name} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AuthorList;
