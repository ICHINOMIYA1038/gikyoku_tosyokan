import * as React from "react";
import Layout from "./Layout";
//固定ページのためのレイアウト

const NewsLayout = ({ children }: any) => {
  return (
    <Layout>
      <div className="bg-white max-w-3xl mx-auto p-20">
        <div>{children}</div>
      </div>
    </Layout>
  );
};

export default NewsLayout;
