import React, { useState } from "react";

interface TagSelectorProps {
  category_ids: Tag[];
  selectedTags: number[];
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
}

interface Tag {
  id: number;
  name: string;
}

function TagSelector({
  category_ids,
  selectedTags,
  setSelectedTags,
}: TagSelectorProps) {
  const handleTagClick = (tagId: number) => {
    // タグの選択状態を切り替える
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id: number) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="m-2">
      <div className="flex flex-wrap gap-2 select-none">
        {/* タグ一覧を表示 */}
        {category_ids.map((tag: Tag) => (
          <div
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`p-1 rounded-lg cursor-pointer ${selectedTags.includes(tag.id)
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagSelector;
