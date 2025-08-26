import { motion } from "framer-motion";

export function RatingBar({
  current,
  onRate,
  disabled,
  scaleOnHover = true,
}: {
  current: number;
  onRate: (r: number) => void;
  disabled?: boolean;
  scaleOnHover?: boolean;
}) {
  return (
    <div>
      <div className="text-sm mb-1">Daj ocenu (1–10):</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((r) => {
          const active = r <= current;
          return (
            <motion.button
              key={r}
              whileHover={scaleOnHover ? { scale: 1.06 } : undefined}
              whileTap={{ scale: 0.96 }}
              onClick={() => onRate(r)}
              disabled={!!disabled}
              className={
                "px-2 py-1 rounded-md border text-sm transition " +
                (disabled
                  ? "opacity-60 cursor-not-allowed bg-slate-800 border-slate-700"
                  : active
                  ? "bg-amber-500 text-slate-900 border-amber-500"
                  : "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700")
              }
              title={`Oceni ${r}`}
              type="button"
            >
              {r}
            </motion.button>
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