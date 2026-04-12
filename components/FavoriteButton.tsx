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
            ? "bg-pink-500 hover:bg-pink-600 text-white"
            : "bg-white border-2 border-pink-300 text-pink-400 hover:bg-pink-50 hover:text-pink-500"
        }`}
        aria-label={liked ? "お気に入りから削除" : "お気に入りに追加"}
      >
        {liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
      </button>
    );
  }

  const iconClass = size === "sm" ? "text-base" : "text-xl";
  const btnClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <button
      onClick={handleClick}
      className={`${btnClass} rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 transition-transform`}
      aria-label={liked ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {liked ? (
        <FaHeart className={`${iconClass} text-pink-500`} />
      ) : (
        <FaRegHeart className={`${iconClass} text-gray-300 hover:text-pink-300`} />
      )}
    </button>
  );
};

export default FavoriteButton;
