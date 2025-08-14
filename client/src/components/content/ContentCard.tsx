import React from "react";
import type { ContentItem } from "../../types/content/Content";

interface Props {
  item: ContentItem;
  onOpen: (id: number) => void;
}

export const ContentCard: React.FC<Props> = ({ item, onOpen }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white/60 border border-amber-200 backdrop-blur"
    >
      <div className="aspect-[2/3] bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center">
        {item.cover_image ? (
          <img src={item.cover_image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-gray-600 px-2 text-center">{item.title}</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {item.type}
          </span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{item.genre ?? "—"}</span>
          <span className="font-semibold text-amber-700">{item.average_rating.toFixed(1)} ★</span>
        </div>
        <button
          className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 rounded-xl transition"
          onClick={() => onOpen(item.content_id)}
        >
          Detalji
        </button>
      </div>
    </div>
  );
};
