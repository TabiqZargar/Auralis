# constants/

Application-wide constant values.

## Files

| File         | Contents |
|-------------|---------|
| routes.ts   | Route path strings and route builder functions |
| player.ts   | Volume limits, seek steps, audio quality presets |
| theme.ts    | Breakpoints, sidebar/player dimensions, accent colors |
| animation.ts | Framer Motion durations, easings, and predefined variants |
| keyboard.ts | Keyboard shortcut key mappings |
| index.ts    | Barrel export |

## Rules

- Constants are `as const` for type safety.
- Feature-specific constants live inside the feature folder.
- No business logic or functions with side effects.
