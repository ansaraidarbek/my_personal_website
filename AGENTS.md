# Project rules — my_personal_website

These are the working rules for this codebase. They apply to every contributor,
human or AI. Read them before adding or moving files. They encode the two
conventions this project is built on: **Feature-Sliced Design (FSD)** for
structure and **shadcn/ui + Tailwind v4** for the UI layer.

> Companion docs: `ARCHITECTURE.md` (the "why" in depth) and the Cursor rules
> under `.cursor/rules/`. This file is the quick, authoritative reference.

---

## 1. Tech stack (do not swap without reason)

- **Build**: Vite + `@vitejs/plugin-react-swc`
- **UI**: React 18 + TypeScript (strict)
- **Routing**: `react-router-dom` v7 (`BrowserRouter`)
- **Styling**: Tailwind CSS v4 (CSS-first config in `src/index.css`, no `tailwind.config.js`)
- **Components**: shadcn/ui (`radix-nova` style) on top of `radix-ui`
- **Server state**: TanStack Query · **Client state**: Zustand (when needed)
- **Icons**: `lucide-react` (brand marks live in `src/shared/ui/brandIcons.tsx`)
- **Notifications**: `sonner`
- **Package manager**: **pnpm only** (see `packageManager` in `package.json`)

---

## 2. Feature-Sliced Design — the layers

Code lives in **layers**, ordered from most app-specific to most generic. The
import rule is absolute:

> **A layer may only import from layers below it. Never sideways, never up.**

```
src/
├── app/        ← composition root: providers, router, global layout
├── pages/      ← one folder per route; composes shared building blocks
├── shared/     ← reusable, feature-agnostic code (ui, config, data, hooks, types, lib)
├── components/ ← shadcn/ui primitives (generated; treated as shared/ui)
└── lib/        ← shadcn util home (`cn`); imported as `@/lib/utils`
```

Allowed dependency direction:

```
app → pages → shared → components/ui → lib
```

Concretely:

- `app/` may import from `pages`, `shared`, `components`, `lib`.
- `pages/` may import from `shared`, `components`, `lib` — **never from another page**.
- `shared/` may import from `components`, `lib` — **never from `pages` or `app`**.
- `components/ui` and `lib` are leaves — they import only each other / npm.

> This project uses the **pragmatic FSD subset**: `app` / `pages` / `shared`.
> If a feature outgrows a page, promote it into a `widgets/`, `features/`, or
> `entities/` layer (inserted between `pages` and `shared`) — do not let it leak
> across pages.

### Page slice structure

Each page is a folder named after the route, with a `PascalCase` + `Page` entry
component and optional internal segments:

```
pages/<name>/
├── <name>Page.tsx   ← the route component (exported, used by the router)
├── ui/              ← presentational pieces used only by this page
├── model/           ← types, pure logic local to the page (optional)
├── hooks/           ← hooks local to the page (optional)
├── store/           ← Zustand stores local to the page (optional)
└── utils/           ← pure helpers local to the page (optional)
```

If a `ui/`, `hook/`, or helper is used by **more than one page**, it does not
belong to a page — move it to `shared/`.

### The `shared` layer

```
shared/
├── ui/       ← reusable presentational components (Container, ProjectCard, ThemeToggle, …)
├── config/   ← static configuration (site.ts, nav.ts)
├── data/     ← content/data sources (projects.ts, posts.ts)
├── hooks/    ← reusable hooks (useTheme)
├── types/    ← shared TypeScript types
├── lib/      ← generic helpers
└── queries/  ← TanStack Query keys / query definitions (add when fetching)
```

---

## 3. shadcn/ui conventions

- Primitives live in `src/components/ui/` and are imported as `@/components/ui/*`.
- Add new primitives with the CLI, never hand-rolled ad-hoc:
  ```bash
  pnpm dlx shadcn@latest add <component>
  ```
- The registry style is **`radix-nova`**, base color **neutral**, CSS variables
  on. This is pinned in `components.json` — keep it.
- **Do not edit generated primitives to restyle the app.** Theme through the
  CSS tokens in `src/index.css` (the `:root` / `.dark` variable blocks). One
  accent hue (`--accent-hue`) drives every accent color.
- Compose primitives inside `shared/ui` or a page's `ui/` folder — that is where
  project-specific components belong, not in `components/ui`.
- Merge class names with `cn()` from `@/lib/utils`. Never concatenate manually.

### Theming & surfaces

- Colors are authored in **OKLCH**. Prefer semantic tokens (`bg-primary`,
  `text-muted-foreground`, `border-border`) over raw colors.
- Glass surfaces use the `.glass`, `.glass-strong`, `.glass-subtle` utility
  classes defined in `index.css`. **Never stack more than two glass layers.**
- Light/dark is a `.dark` class on `<html>`, driven by `@/shared/hooks/useTheme`.

---

## 4. Code style

- **Imports**: use the `@/` alias for anything under `src` (`@/shared/...`,
  `@/components/ui/...`). Relative imports are fine within the same slice.
- **File naming**: `camelCase` for files (`homePage.tsx`, `siteHeader.tsx`);
  `PascalCase` for the React components they export.
- **Components**: prefer named exports and arrow-function components.
- **Indentation**: tabs (matches the existing codebase). shadcn-generated files
  keep their original 2-space style — leave them as-is.
- **Types**: strict mode is on; no unused locals/params. Type props explicitly.
- Keep components presentational; push logic into `hooks/`, `model/`, or `utils/`.

---

## 5. Commands

```bash
pnpm install       # install dependencies
pnpm dev           # start the dev server (http://localhost:5173)
pnpm build         # type-check (tsc) + production build
pnpm preview       # preview the production build
pnpm lint          # type-check only
pnpm deploy        # build + publish dist/ to GitHub Pages
```

**Before considering any change done: `pnpm build` must pass with no errors.**

---

## 6. Adding things — quick recipes

- **A new route/page** → create `pages/<name>/<name>Page.tsx`, register it in
  `src/app/router.tsx`, add a `NavItem` in `src/shared/config/nav.ts`.
- **A reusable UI piece** → `shared/ui/<name>.tsx`.
- **A page-only UI piece** → `pages/<page>/ui/<name>.tsx`.
- **New content** (project, post) → edit `src/shared/data/*` (typed by
  `src/shared/types/content.ts`).
- **A new shadcn primitive** → `pnpm dlx shadcn@latest add <component>`.
- **Site identity** (name, role, socials) → `src/shared/config/site.ts`.
