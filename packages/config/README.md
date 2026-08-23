# packages/config/

Shared configuration and constants used across AIRA's apps and modules.

## What goes here

- Shared constants (API ports, default settings, risk level definitions).
- Configuration schemas.
- Environment variable definitions and defaults.

## What will go here later

- Default AIRA settings and their schemas.
- Action risk level definitions (A0, A1, A2, A3).
- Model configuration defaults.
- Permission group definitions.

## What does NOT go here

- Runtime configuration files (those are generated at install time).
- Secrets or API keys (never committed to version control).
- App-specific configs (those go in each app's own config).

## Current status

Structure only.
