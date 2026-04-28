import { FaRobot, FaInfoCircle } from "react-icons/fa";

type AiDescriptionProps = {
  description: string;
};

const AiDescription = ({ description }: AiDescriptionProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <FaRobot className="text-purple-500 text-sm" />
        AIによる作品概要
      </h2>
      <p className="text-gray-700 leading-[1.9] text-sm whitespace-pre-wrap">
        {description}
      </p>
      <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
        <FaInfoCircle className="text-[10px]" />
        公開情報をもとにAIが作成。実際の内容と異なる場合があります。
      </p>
    </div>
  );
};

export default AiDescription;
