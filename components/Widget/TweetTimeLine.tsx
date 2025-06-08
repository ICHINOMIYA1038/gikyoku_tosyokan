import React, { useEffect } from "react";

export const TweetTimeLine = ({ id }: any) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      className="twitter-timeline max-w-xl max-h-92"
      href="https://twitter.com/gekidankatakago?ref_src=twsrc%5Etfw"
      target="_blank"
      rel="noopener noreferrer"
    >
      Tweets by
    </a>
  );
};
