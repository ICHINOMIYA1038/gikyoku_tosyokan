import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  postId: number;
  size?: "sm" | "md";
  variant?: "default" | "floating";
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ postId, size = "md", variant = "default" }) => {
  const { isFav, toggle } = useFavorites();
  const liked = isFav(postId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(postId);
  };

  if (variant === "floating") {
    return (
      <button
        onClick={handleClick}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
          liked
            ? "bg-theater-primary-500 hover:bg-theater-primary-600 text-white"
            : "bg-white border-2 border-theater-primary-300 text-theater-primary-400 hover:bg-theater-primary-50 hover:text-theater-primary-500"
        }`}
        aria-label={liked ? "お気に入りから削除" : "お気に入りに追加"}
      >
        {liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
      </button>
    );
  }

  const iconClass = size === "sm" ? "text-base" : "text-xl";
  // モバイルでのタップしやすさのため、sm でも実質40pxを確保
  const btnClass = size === "sm" ? "w-10 h-10" : "w-11 h-11";

  return (
    <button
      onClick={handleClick}
      className={`${btnClass} rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform`}
      aria-label={liked ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {liked ? (
        <FaHeart className={`${iconClass} text-theater-primary-500`} />
      ) : (
        <FaRegHeart className={`${iconClass} text-gray-300 hover:text-theater-primary-300`} />
      )}
    </button>
  );
};

export default FavoriteButton;
