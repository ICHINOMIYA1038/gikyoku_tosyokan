import React from "react";

type BadgeProps = {
  text: string;
};

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <span className="inline-block text-xs md:text-base font-semibold text-blue-600 bg-blue-100 py-1 px-2 md:py-1 md:px-3 rounded border border-blue-600 m-0 md:m-1">
      {text}
    </span>
  );
};

export default Badge;
