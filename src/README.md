## Architecture & Extensibility

### Patterns Used

- Adapter pattern: Raw API data is converted into domain-specific types before reaching the UI. This keeps forms, edges, and global data consistent regardless of backend changes.

- Custom hook as data boundaries
`useGraphData` encapsulates fetching, error/loading handling, and mapping. Components never call APIs directly.

- Presentational components
`FormsPage` holds the logic; components like `FormList` and `ConfigureFieldDialog` are purely UI-driven.

- Pure utility functions
Parent traversal, field extraction, formatting, and mapping live in `src/utils` and are unit tested.

### Extending With New Data Sources

The project uses a clear separation between API shapes and UI/domain shapes.

To add a new data source:

1. Define its raw API type in `src/types/api.ts`.
2. Add a mapping utility that transforms API shape -> domain shape.
3. Expose it through `useGraphData`, which normalizes all backend data into a single hook output.
4. Consume it in the UI by adding it to the source list in `FormsPage` or `ConfigureFieldDialog`.

This keeps the UI independent from backend details and makes new data sources plug in cleanly.

### Adding New Features

The codebase is structured so new features can be added with minimal impact:

- Adding a new prefill source type -> update domain.ts, extend mapping, and register it in the dialog.
- Adding new form metadata -> extend Field or Form once and all UI automatically benefits.
- Adding another graph-based feature -> reuse `useGraphData` and existing traversal utilities.
- Testing new logic -> follow existing pure-function test patterns.

Because data fetching, mapping, and UI responsibilities are isolated, most new features involve adding small, focused files rather than modifying existing ones.