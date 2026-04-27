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
  horizontal: { display: "block", width: "100%", height: "90px" },
  vertical: { display: "block", width: "300px", height: "600px" },
  rectangle: { display: "block", width: "100%", height: "250px" },
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
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  );
};

export default DisplayAd;
