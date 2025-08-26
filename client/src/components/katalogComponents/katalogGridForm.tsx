import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ContentItem } from "../../types/content/Content";
import { ContentCard } from "./contentCardForm";

const listVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06, // postepeno “iz špila”
    },
  },
};

export function KatalogGrid({
  items,
  isAuthenticated,
  postingId,
  currentRatings,
  onRate,
  onOpenDetails,
}: {
  items: ContentItem[];
  isAuthenticated: boolean;
  postingId: number | null;
  currentRatings: Record<number, number>;
  onRate: (contentId: number, rating: number, ev?: React.MouseEvent) => void;
  onOpenDetails: (id: number) => void;
}) {
  return (
    <motion.ul
      variants={listVariants}
      initial={false}
      animate="animate"
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((it) => (
          <ContentCard
            key={it.content_id}
            item={it}
            isAuthenticated={isAuthenticated}
            currentRating={currentRatings[it.content_id] ?? 0}
            disabledRating={postingId === it.content_id}
            onRate={(r, ev) => onRate(it.content_id, r, ev)}
            onOpenDetails={() => onOpenDetails(it.content_id)}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}