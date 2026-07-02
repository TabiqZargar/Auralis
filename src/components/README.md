# components/

Shared, reusable components used across multiple features.

## Structure

- **ui/** — Primitive, generic UI components (Button, Input, Slider, Modal, Tooltip, etc.)
  - Must be completely domain-agnostic
  - No knowledge of music, playlists, or any feature
- **shared/** — Domain-aware reusable components (AlbumCard, TrackRow, PlayerControls, etc.)
  - Use types from `@/types`
  - May use hooks from `@/hooks`
  - Must NOT import from any feature module
- **layout/** — Structural layout components (Sidebar, Navbar, PlayerLayout, RightPanel, MobileNav)
  - Define the page shell
  - May use `@/store` for state like sidebar collapse

## Rules

- Components in `ui/` must have no feature-specific logic.
- Components in `shared/` may use feature types but not feature internals.
- Components in `layout/` compose shared/ui components.
- No component should import from `features/`.
