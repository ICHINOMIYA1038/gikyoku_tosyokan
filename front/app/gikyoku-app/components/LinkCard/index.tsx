import { useEffect, useState } from "react";
import LinkCardCompleted from "./LinkCardCompleted";

export type OgData = {
  url: string;
  siteName?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: string;
};

type OgState = {
  ogData?: OgData;
  isCompleted: boolean;
};

const LinkCard = ({ href }: any) => {
  const [state, setState] = useState<OgState>({
    ogData: undefined,
    isCompleted: false,
  });

  useEffect(() => {
    fetch(`/api/ogp?url=${encodeURIComponent(href)}`)
      .then((payload) => payload.json())
      .then((data) => {
        setState({
          ogData: data,
          isCompleted: true,
        });
      });
  }, [href]);

  return !state.isCompleted ? (
    <>
      <div className="border border-solid border-gray-300 rounded-lg overflow-hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex-1 flex flex-col p-4">
            <p className="text-xs font-bold break-all truncate-2-lines">
              外部サイトを開く
            </p>
          </div>
        </a>
      </div>
      ;
    </>
  ) : (
    <LinkCardCompleted ogData={state.ogData as OgData} />
  );
};

export default LinkCard;
