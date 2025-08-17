import React, { useState, useEffect } from "react";
import SearchForm from "./SearchForm";
import MobileSearchForm from "./MobileSearchForm";

export default function ResponsiveSearchForm(props: any) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileSearchForm {...props} />
  ) : (
    <SearchForm {...props} />
  );
}