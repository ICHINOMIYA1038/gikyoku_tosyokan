import Header from "@/components/Header";
import Footer from "./Footer";
import ImportantMessage from "./importantMessage";

function Layout({ children, ishead }: any) {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <div className="header-gap"></div>
      <ImportantMessage />
      <div className="md:px-20 md:py-10">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
