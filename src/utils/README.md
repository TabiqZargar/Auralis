# utils/

Pure utility functions with no side effects.

## Files

| File     | Functions |
|---------|----------|
| format.ts | formatDuration, formatNumber, formatDate, formatRelativeTime |
| array.ts  | shuffleArray, toggleArrayItem, chunkArray, moveItem |
| color.ts  | generateGradient, extractDominantColor, hexToRgba, isLightColor |
| string.ts | formatArtists, truncate, slugify, capitalize, pluralize |
| index.ts  | Barrel export |

## Rules

- All functions must be pure (no side effects, no external dependencies).
- Feature-specific utilities live inside the feature folder.
- No React, no hooks, no store access.
- Must be easily testable — pure input/output.
