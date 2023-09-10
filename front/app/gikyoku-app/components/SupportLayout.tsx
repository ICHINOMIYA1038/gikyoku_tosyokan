import Header from "@/components/Header";
import SupportSidebar from "./Support/SupportSidebar";
import Layout from "./Layout";

function SupportLayout({ children, now }: any) {
  return (
    <Layout>
      <div className="sticky-header">
        <Header />
      </div>
      <div className="header-gap"></div>
      <div className="md:flex max-w-7xl mx-auto">
        <div className="md:w-1/4">
          <div className="mt-10 md:ml-20">
            <SupportSidebar now={now} />
          </div>
        </div>
        <div className="md:w-3/4 mx-2">
          <div className="mt-10 ">{children}</div>
        </div>
      </div>
    </Layout>
  );
}

export default SupportLayout;
