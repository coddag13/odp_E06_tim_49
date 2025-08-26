import type React from "react";
import { motion } from "framer-motion";
import type { ContentItem } from "../../types/content/Content";
import { RatingRow } from "../katalogComponents/ratingRowForm";
import type { Variants } from "framer-motion";

type Props = {
  item: ContentItem;
  isAuthenticated: boolean;
  currentRating?: number;
  disabledRating?: boolean;
  onRate?: (rating: number, ev?: React.MouseEvent) => void;
  onOpenDetails?: () => void;
};

const cardVariants:Variants = {
  initial: { opacity: 0, y: -24, rotate: -2 },
  animate: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit:    { opacity: 0, y: 24, rotate: 2,  transition: { duration: 0.15 } },
};

export function ContentCard({
  item,
  isAuthenticated,
  currentRating = 0,
  disabledRating,
  onRate,
  onOpenDetails,
}: Props) {
  return (
    <motion.li
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      onClick={onOpenDetails}
      className="group rounded-2xl bg-slate-800/80 backdrop-blur p-3 border border-slate-700
                 text-slate-100 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-slate-900/40"
    >
      <div className="relative mb-3 overflow-hidden rounded-xl border border-slate-700 bg-white/10">
        {item.poster_url ? (
          <img
            src={item.poster_url}
            alt={item.title}
            className="w-full h-44 object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-44 rounded-xl border border-slate-700 bg-slate-700 grid place-items-center text-xs text-slate-300">
            bez slike
          </div>
        )}
      </div>

      <div>
        <div className="font-semibold line-clamp-2">{item.title}</div>
        <div className="text-xs text-slate-400 mb-2">{item.type === "movie" ? "Film" : "Serija"}</div>

        <div className="text-sm text-slate-200 mb-2">
          Prosečna ocena:{" "}
          <span className="font-bold">
            {Number.isFinite(item.average_rating as any) ? Number(item.average_rating).toFixed(2) : "N/A"}
          </span>
          {Number.isFinite(item.rating_count as any) && (
            <span className="text-slate-400"> ({item.rating_count})</span>
          )}
        </div>

        {isAuthenticated && onRate && (
          <RatingRow current={currentRating} onRate={onRate} disabled={disabledRating} />
        )}
      </div>
    </motion.li>
  );
}