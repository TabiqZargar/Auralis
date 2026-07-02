export const ANIMATION = {
  DURATIONS: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    page: 0.35,
    sidebar: 0.3,
    player: 0.4,
    modal: 0.25,
    tooltip: 0.1,
    contextMenu: 0.15,
  },
  EASINGS: {
    default: [0.4, 0, 0.2, 1] as [number, number, number, number],
    entrance: [0, 0, 0.2, 1] as [number, number, number, number],
    exit: [0.4, 0, 1, 1] as [number, number, number, number],
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
    bounce: { type: "spring" as const, stiffness: 400, damping: 20 },
  },
  VARIANTS: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
} as const;
