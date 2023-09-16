import React from "react";

type BadgeProps = {
  text: string;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <span className="inline-block font-semibold text-blue-600 bg-blue-100 py-1 px-2 md:py-1 md:px-3 rounded border border-blue-600 m-0 md:m-1">
      {truncateText(text, 5)}
    </span>
  );
};

export const BadgeGreen: React.FC<BadgeProps> = ({ text }) => {
  return (
    <span className="inline-block font-semibold text-green-600 bg-green-100 py-1 px-2 md:py-1 md:px-3 rounded border border-green-600 m-0 md:m-1">
      {truncateText(text, 20)}
    </span>
  );
};

export default Badge;
