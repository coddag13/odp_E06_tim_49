import type React from "react";

export function RatingRow({
  current,
  onRate,
  disabled,
  className = "",
}: {
  current: number;
  onRate: (r: number, ev?: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`mt-auto pt-2 ${className}`} onClick={(e) => e.stopPropagation()}>
      <div className="text-xs text-slate-400 mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <button
              key={r}
              onClick={(ev) => onRate(r, ev)}
              disabled={!!disabled}
              className={
                "px-2 py-1 rounded-lg border text-sm transition " +
                (disabled
                  ? "opacity-60 cursor-not-allowed"
                  : active
                  ? "bg-amber-500 text-slate-900 border-amber-500"
                  : "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600")
              }
              title={`Oceni ${r}`}
              type="button"
            >
              {r}
            </button>
          );
        })}
      </div>
      {current > 0 && (
        <div className="text-xs text-slate-300 mt-1">
          Vaša ocena: <span className="font-semibold">{current}</span>
        </div>
      )}
    </div>
  );
}