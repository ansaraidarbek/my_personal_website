# Architecture

This document explains *why* the project is laid out the way it is. For the
quick rules, see [`AGENTS.md`](./AGENTS.md).

## Feature-Sliced Design (FSD)

The codebase follows [Feature-Sliced Design](https://feature-sliced.design/) — a
methodology that organises a front-end by **layer** and **slice** rather than by
technical type. Instead of "all components here, all hooks there," code is
grouped by the role it plays in the product, with a strict, one-directional
dependency rule.

### Layers used here

This project deliberately uses the **pragmatic subset** of FSD — the three
layers that carry their weight in a site of this size:

| Layer         | Responsibility                                                        | May import from            |
| ------------- | --------------------------------------------------------------------- | -------------------------- |
| `app`         | Composition root — providers, router, global layout, entry point.     | pages, shared, components   |
| `pages`       | One slice per route. Composes shared pieces into a screen.            | shared, components          |
| `shared`      | Reusable, feature-agnostic building blocks (ui, config, data, hooks). | components, lib             |
| `components/ui` | shadcn/ui primitives (generated). Treated as part of `shared`.      | lib                        |
| `lib`         | The shadcn `cn` helper home.                                          | — (leaf)                   |

The golden rule: **dependencies point downward only.**

```
app  →  pages  →  shared  →  components/ui  →  lib
```

A page never imports from another page. `shared` never imports from a page. When
those constraints are honoured, three good properties fall out for free:

1. **Predictable location.** Anything used by one screen lives in that page's
   folder; anything used by two or more lives in `shared`. There is never a
   question of where a file should go.
2. **Safe deletion.** Removing a page is a local operation — nothing else
   depends on its internals.
3. **No dependency cycles.** The one-way rule makes circular imports structurally
   impossible.

### Growing beyond three layers

If a feature becomes substantial and is shared across pages — say an auth flow or
a rich editor — introduce the standard FSD layers between `pages` and `shared`:

```
app → pages → widgets → features → entities → shared
```

Add them only when a real need appears. Premature layering is its own kind of
mess.

### Slice anatomy

A page slice keeps everything it owns close by:

```
pages/projects/
├── projectsPage.tsx     # route component (the slice's public entry)
├── ui/                  # presentational pieces for this page only
│   └── projectFilter.tsx
├── model/               # local types & pure logic        (optional)
├── hooks/               # local hooks                      (optional)
├── store/               # local Zustand stores             (optional)
└── utils/               # local pure helpers               (optional)
```

The `*Page.tsx` file is the slice's public surface — it is what the router
imports. Everything else in the folder is an implementation detail.

## The UI layer: shadcn/ui + Tailwind v4

Components are built on [shadcn/ui](https://ui.shadcn.com) — you own the source
of every primitive under `src/components/ui`. Styling is **token-first**:

- **CSS-first Tailwind v4.** There is no `tailwind.config.js`. The theme,
  tokens, and custom utilities are declared directly in `src/index.css` via
  `@theme` and `@layer`.
- **OKLCH color, two knobs.** Every accent derives from `--accent-hue`; every
  paper surface and ink tone from `--neutral-hue`. Re-theming the whole site is
  a two-number change.
- **Semantic tokens.** Components use `bg-primary`, `text-muted-foreground`,
  `border-border`, etc. — never raw hex. Light/dark is a `.dark` class on the
  root element, so a token automatically resolves to the right value.
- **Glass surfaces.** Three utilities — `.glass-subtle`, `.glass`,
  `.glass-strong` — provide a consistent translucent-panel language. The inset
  top hairline is what makes a panel read as a physical sheet. Never stack more
  than two.

### Where components live

- `components/ui/*` — generated shadcn primitives. Regenerate/extend with the
  CLI; do not restyle the app by editing them.
- `shared/ui/*` — project-wide compositions of those primitives (e.g.
  `ProjectCard`, `Container`, `ThemeToggle`).
- `pages/*/ui/*` — compositions used by a single page.

This keeps the primitive layer stable and generic while all product-specific
styling accretes in `shared/ui` and page slices.

## Data flow

Content (projects, posts) lives in `src/shared/data` as typed arrays, described
by `src/shared/types/content.ts`. Pages read from these directly today. Because
the pages depend only on the *types*, the data source can later be swapped for
MDX, a CMS, or a fetch through TanStack Query without touching the UI.
