# data/

Local data storage for AIRA.

## Structure

```
data/
├── database/         ← SQLite schema and migrations
├── vector-store/     ← Vector embeddings for semantic search
└── exports/          ← User data exports
```

## What goes here

- The authoritative local system of record.
- Migrations, schema definitions, and raw data files.

## Important Note

Actual user data files (`aira.sqlite`, `.bin` files) should be stored in the OS-specific app data directory (e.g. `%LOCALAPPDATA%/AIRA/` on Windows) in production, but during development, they may be placed here. **Never commit actual database files to version control.**
