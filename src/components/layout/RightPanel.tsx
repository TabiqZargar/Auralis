import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface RightPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children?: ReactNode;
}

export function RightPanel({ isOpen = false, onClose, title, children }: RightPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="hidden overflow-hidden border-l border-white/5 bg-surface/80 backdrop-blur-xl lg:block"
        >
          <div className="flex h-full w-[360px] flex-col">
            {title && (
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <h2 className="text-sm font-bold text-white">{title}</h2>
                {onClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close panel"
                    className="rounded p-1 text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="scrollbar-thin flex-1 overflow-y-auto p-4">{children}</div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
