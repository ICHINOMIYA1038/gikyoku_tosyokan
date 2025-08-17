import MobileHeader from "@/components/MobileHeader";
import Footer from "./Footer";
import ImportantMessage from "./importantMessage";

function Layout({ children, ishead }: any) {
  return (
    <div>
      <div className="sticky top-0 z-40">
        <MobileHeader />
      </div>
      <div className="header-gap"></div>
      {/*<ImportantMessage />*/}
      <div className="md:px-20 md:py-10">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
