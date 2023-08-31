import { Post as PostType } from "@prisma/client";
import { Author as AuthorType } from "@prisma/client";

export type PostData = {
  post: PostType & { author: { id: number; name: string } };
};

export type PostsPageProps = {
  posts: PostData[];
};

export type AuthorData = {
  author: AuthorType & { posts: Array<{ id: number; title: string }> };
};

export type AuthorPageProps = {
  authors: AuthorData[];
};
