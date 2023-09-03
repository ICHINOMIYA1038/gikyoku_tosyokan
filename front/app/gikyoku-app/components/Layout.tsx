import Header from "@/components/Header";
import Footer from "./Footer";

function Layout({ children }: any) {
  return (
    <div>
      <div className="sticky-header">
        <Header />
      </div>
      <div className="header-gap"></div>
      <div className="md:px-20 md:py-10">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
