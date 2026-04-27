import { FaRobot, FaSearch } from "react-icons/fa";

type AiDescriptionProps = {
  description: string;
};

const AiDescription = ({ description }: AiDescriptionProps) => {
  return (
    <div className="mt-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-blue-100 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-full">
          <FaRobot className="text-blue-500 text-xs" />
          <span className="text-xs font-bold text-blue-700">AI概要</span>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
        {description}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
        <FaSearch className="text-[10px]" />
        <span>
          この概要はAIがWeb上の公開情報をもとに作成したものです。内容の正確性は保証されません。
        </span>
      </div>
    </div>
  );
};

export default AiDescription;
