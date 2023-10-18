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
      <div className="flex justify-center items-center" aria-label="読み込み中">
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
        <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
      </div>
      ;
    </>
  ) : (
    <LinkCardCompleted ogData={state.ogData as OgData} />
  );
};

export default LinkCard;
