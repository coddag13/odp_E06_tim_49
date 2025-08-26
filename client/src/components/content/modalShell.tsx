import type { PropsWithChildren } from "react";
import type {  Variants } from "framer-motion";
import { motion } from "framer-motion";

const backdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panel: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.16 },
  },
};

type ModalShellProps = PropsWithChildren<{
  onClose: () => void;
  className?: string;
}>;

export function ModalShell({ onClose, className, children }: ModalShellProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={
          "w-full max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-y-auto text-slate-100 border border-slate-700 " +
          (className ?? "")
        }
        variants={panel}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}