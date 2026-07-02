import { ANIMATION } from "@/constants";

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: {
    duration: ANIMATION.DURATIONS.page,
    ease: ANIMATION.EASINGS.default,
  },
};

export const cardHover = {
  whileHover: { y: -4, scale: 1.02 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const cardTap = {
  whileTap: { scale: 0.98 },
};

export const shimmerVariants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};
