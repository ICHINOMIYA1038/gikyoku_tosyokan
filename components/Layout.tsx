import MobileHeader from "@/components/MobileHeader";
import Footer from "./Footer";
import ImportantMessage from "./importantMessage";

function Layout({ children, ishead, noPadding, noFooter }: any) {
  return (
    <div>
      <div className="sticky top-0 z-40">
        <MobileHeader />
      </div>
      <div className="header-gap"></div>
      {/*<ImportantMessage />*/}
      <div className={noPadding ? "" : "px-3 py-3 md:px-12 md:py-6"}>{children}</div>
      {!noFooter && <Footer />}
    </div>
  );
}

export default Layout;
