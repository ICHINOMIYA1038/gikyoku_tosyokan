import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface VenueSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const VenueSelector: React.FC<VenueSelectorProps> = ({
  value,
  onChange,
  placeholder = '会場名を入力（例: 下北沢ザ・スズナリ）',
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.length < 1) {
      setSuggestions([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/venues/suggest?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {}
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 focus:border-theater-primary-400"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-theater-primary-50 transition-colors flex items-center gap-2"
                onClick={() => {
                  onChange(s);
                  setShowSuggestions(false);
                }}
              >
                <FaMapMarkerAlt className="text-gray-400 text-xs" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VenueSelector;
