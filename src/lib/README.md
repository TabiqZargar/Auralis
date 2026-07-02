# lib/

Third-party library wrappers and initializations.

## Contents

- `axios.ts` — Configured Axios instance with auth interceptors
- `audio.ts` — Web Audio API engine (AudioContext, AnalyserNode, GainNode)
- `index.ts` — Barrel exports

## What belongs here

- Singleton instances of external libraries
- Configuration and initialization of third-party tools
- Thin wrappers that make libraries easier to use consistently

## What should never be placed here

- Business logic
- React components or hooks
- Feature-specific code
