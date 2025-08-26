import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import type { ContentItem } from "../../types/content/Content";
import { RatingRow } from "./ratingRowForm";

type ContentCardProps = {
  item: ContentItem;
  isAuthenticated: boolean;
  currentRating: number;
  disabled?: boolean;
  onRate: (rating: number, ev?: React.MouseEvent) => void;
  onOpen: (id: number) => void;
};

export const ContentCard = forwardRef<HTMLLIElement, ContentCardProps>(
  ({ item, isAuthenticated, currentRating, disabled, onRate, onOpen }, ref) => {
    return (
      <li
        ref={ref}
        onClick={() => onOpen(item.content_id)}
        className="rounded-2xl bg-slate-800/80 backdrop-blur p-3 border border-slate-700 text-slate-100 flex flex-col cursor-pointer hover:shadow-lg hover:-translate-y-[2px] transition"
      >
        {item.poster_url ? (
          <img
            src={item.poster_url}
            alt={item.title}
            className="w-full h-44 object-contain rounded-xl border mb-3 bg-white/10 border-slate-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-44 rounded-xl border border-slate-700 bg-slate-700 grid place-items-center text-xs text-slate-300 mb-3">
            bez slike
          </div>
        )}

        <div className="font-semibold line-clamp-2">{item.title}</div>
        <div className="text-xs text-slate-400 mb-2">
          {item.type === "movie" ? "Film" : "Serija"}
        </div>

        <div className="text-sm text-slate-200 mb-2">
          Prosečna ocena:{" "}
          <span className="font-bold">
            {Number.isFinite(item.average_rating as any)
              ? Number(item.average_rating).toFixed(2)
              : "N/A"}
          </span>
          {Number.isFinite(item.rating_count as any) && (
            <span className="text-slate-400"> ({item.rating_count})</span>
          )}
        </div>

        {isAuthenticated && (
          <RatingRow
            current={currentRating}
            onRate={onRate}
            disabled={disabled}
          />
        )}
      </li>
    );
  }
);


export const MotionContentCard = motion(ContentCard);