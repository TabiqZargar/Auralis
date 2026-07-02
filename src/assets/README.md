# assets/

Static assets bundled with the application.

## Structure

- **icons/** — SVG icon files (use Lucide React components for code icons; this is for custom SVGs)
- **images/** — Static images (logos, placeholders, backgrounds)
- **fonts/** — Self-hosted font files (if not using system fonts or CDN)
- **audio/** — Local audio samples for testing

## What belongs here

- Files that are imported directly by components (e.g., `import logo from "@/assets/images/logo.png"`)
- Static binaries that should be part of the bundle

## What should never be placed here

- Generated or downloaded content at runtime
- User-uploaded content
- Large media files that should be served from a CDN
