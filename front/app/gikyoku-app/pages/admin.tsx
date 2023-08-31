import AuthorForm from "@/components/Form/AuthorForm";
import PostForm from "@/components/Form/PostForm";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex">
        <AuthorForm />
        <PostForm />
      </div>
    </Layout>
  );
}
