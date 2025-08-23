import * as React from "react";
import Layout from "@/components/Layout";

type PostDetailLayoutProps = {
  children: React.ReactNode;
};

const PostDetailLayout: React.FC<PostDetailLayoutProps> = ({ children }) => {
  return (
    <Layout noPadding={true}>
      {children}
    </Layout>
  );
};

export default PostDetailLayout;