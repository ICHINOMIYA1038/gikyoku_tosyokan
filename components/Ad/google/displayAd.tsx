import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-8691137965825158";

type AdFormat = "horizontal" | "vertical" | "rectangle" | "auto";

type DisplayAdProps = {
  slot: string;
  format?: AdFormat;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

const formatStyles: Record<AdFormat, React.CSSProperties> = {
  horizontal: { display: "block" },
  vertical: { display: "block" },
  rectangle: { display: "block" },
  auto: { display: "block" },
};

const DisplayAd = ({ slot, format = "auto", className }: DisplayAdProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded yet — silent fail
    }
  }, []);

  return (
    <div className={`ad-container text-center ${className || ""}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={formatStyles[format]}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default DisplayAd;
