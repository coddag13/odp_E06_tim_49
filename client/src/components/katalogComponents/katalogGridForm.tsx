import { AnimatePresence, LayoutGroup } from "framer-motion";
import type { ContentItem } from "../../types/content/Content";
import { MotionContentCard } from "./contentCardForm";

type KatalogGridProps = {
  items: ContentItem[];
  isAuthenticated: boolean;
  postingId: number | null;
  currentRatings: Record<number, number>;
  onRate: (contentId: number, rating: number, ev?: React.MouseEvent) => void;
  onOpenDetails: (id: number) => void;
};

export function KatalogGrid({
  items,
  isAuthenticated,
  postingId,
  currentRatings,
  onRate,
  onOpenDetails,
}: KatalogGridProps) {
  return (
    <LayoutGroup>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((it, i) => (
            <MotionContentCard
              key={it.content_id}
              layout
              initial={{ opacity: 0, y: 12, rotate: (i % 2 ? 1 : -1) * 0.8 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 12, rotate: (i % 2 ? -1 : 1) * 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              item={it}
              isAuthenticated={isAuthenticated}
              currentRating={currentRatings[it.content_id] ?? 0}
              disabled={postingId === it.content_id}
              onRate={(r, ev) => onRate(it.content_id, r, ev)}
              onOpen={onOpenDetails}
            />
          ))}
        </AnimatePresence>
      </ul>
    </LayoutGroup>
  );
}