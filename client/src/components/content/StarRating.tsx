import React from "react";

interface StarRatingProps {
  value: number;                 
  onChange?: (v: number) => void;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, disabled }) => {
  const handle = (v: number) => {
    if (!disabled && onChange) onChange(v);
  };
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Ocena ${n}`}
            className={`h-3 w-3 rounded-full transition ${active ? "bg-amber-500" : "bg-gray-300"} ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-110"}`}
            onClick={() => handle(n)}
          />
        );
      })}
      <span className="ml-2 text-sm text-gray-700">{value}/10</span>
    </div>
  );
};
