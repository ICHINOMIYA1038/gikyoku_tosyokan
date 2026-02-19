import MobileHeader from "@/components/MobileHeader";
import Footer from "./Footer";
import ImportantMessage from "./importantMessage";
import CompareBar from "@/components/CompareBar";

function Layout({ children, ishead, noPadding }: any) {
  return (
    <div>
      <div className="sticky top-0 z-40">
        <MobileHeader />
      </div>
      <div className="header-gap"></div>
      {/*<ImportantMessage />*/}
      <div className={noPadding ? "" : "md:px-20 md:py-10"}>{children}</div>
      <CompareBar />
      <Footer />
    </div>
  );
}

export default Layout;
