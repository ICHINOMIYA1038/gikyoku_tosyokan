import React, { useState, useRef } from 'react';
import { FaCamera, FaTimes, FaSpinner } from 'react-icons/fa';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  label = '画像を追加',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(`画像は${maxImages}枚までです`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    setUploading(true);
    setError('');

    const newUrls: string[] = [];
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setError('画像は1枚5MB以内にしてください');
        continue;
      }

      try {
        const presignRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: file.type, folder: 'uploads' }),
        });
        if (!presignRes.ok) continue;

        const { uploadUrl, imageUrl: avatarUrl } = await presignRes.json();
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (uploadRes.ok) {
          newUrls.push(avatarUrl);
        }
      } catch {
        setError('アップロードに失敗しました');
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/70"
            >
              <FaTimes />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-theater-primary-400 flex flex-col items-center justify-center text-gray-400 hover:text-theater-primary-500 transition-colors"
          >
            {uploading ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : (
              <>
                <FaCamera className="text-lg mb-1" />
                <span className="text-[10px]">{label}</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">
        JPEG/PNG/WebP、1枚5MB以内、最大{maxImages}枚
      </p>
    </div>
  );
};

export default ImageUploader;
