# app/

Application shell — wiring everything together.

## Responsibilities

- **providers/** — Composed React context providers (QueryClient, Theme, etc.)
- **router/** — Route definitions and the AppRouter component
- **layouts/** — Top-level layout components (RootLayout, AuthLayout)

## What belongs here

- The single `<App />` root component
- Provider composition
- Router creation and configuration
- Layout components that define the page chrome (sidebar, player, main area)

## What should never be placed here

- Feature-specific logic or components
- Business logic
- API calls
- State stores
