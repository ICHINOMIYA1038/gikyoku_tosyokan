import Link from "next/link";
import React from "react";

const amazonStyle = {
  width: "145px",
  height: "278px",
};

const GikyokuIntroduction = ({ post }: any) => {
  return (
    <div className="m-5 bg-pink-300 px-4 py-2 rounded-md max-w-96 basic-card inline-block">
      <div className="bg-white p-5">
        <h2>優秀新人戯曲賞</h2>
        <a
          href="https://www.amazon.com"
          className="font-bold bg-pink-300 px-4 py-2 my-2 rounded-md text-black>
        text-sm inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          アマゾンで「戯曲」を検索する
        </a>
        <div className="flex flex-wrap gap-5">
          <iframe
            sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin"
            style={amazonStyle}
            title="優秀新人戯曲賞2023"
            marginWidth={0}
            marginHeight={0}
            scrolling="no"
            frameBorder={0}
            src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=gekidankata00-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=489309713X&linkId=8bd569228e1a36a97dfbdfd16c5b1a57"
          ></iframe>
          <iframe
            sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin"
            style={amazonStyle}
            title="優秀新人戯曲賞2022"
            marginWidth={0}
            marginHeight={0}
            scrolling="no"
            frameBorder={0}
            src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=gekidankata00-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4893097024&linkId=4c9923488cd9f4e58ac3d8646f5ecbeb"
          ></iframe>
          <iframe
            sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin"
            style={amazonStyle}
            title="優秀新人戯曲賞2021"
            marginWidth={0}
            marginHeight={0}
            scrolling="no"
            frameBorder={0}
            src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=gekidankata00-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4893096818&linkId=73ecda47ec658214bae6cab6a5ebc9ef"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default GikyokuIntroduction;
