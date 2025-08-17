import { FaStar } from "react-icons/fa";

const Star = ({ star = 0, rateCount = 0, showCount = true }: any) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          className={
            value <= star
              ? "text-yellow-500 text-sm lg:text-base"
              : "text-gray-300 text-sm lg:text-base"
          }
        />
      ))}
      {showCount && rateCount > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          ({rateCount}件の評価)
        </span>
      )}
    </div>
  );
};

export default Star;
