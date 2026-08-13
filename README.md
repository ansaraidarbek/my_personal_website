<div align="center">

# my_personal_website

**A fast, elegant personal website — multi-page portfolio, blog, and contact.**

Built with Vite + React + TypeScript, styled with shadcn/ui and Tailwind v4,
and organised with Feature-Sliced Design.

<br/>

![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-radix--nova-000000)
![pnpm](https://img.shields.io/badge/pnpm-managed-F69220?logo=pnpm&logoColor=white)
![Architecture](https://img.shields.io/badge/architecture-FSD-8B5E3C)

</div>

---

## ✦ Overview

A personal site with a shared design language across every page:

- **Home** — hero, highlights, featured projects, and a call to action.
- **About** — bio, a token-driven skills grid, and an experience timeline.
- **Projects** — filterable portfolio grid backed by typed data.
- **Blog** — lazy-loaded post list and individual post pages.
- **Contact** — a working (backend-free) contact form and social links.

The look is a warm, glassmorphic system: OKLCH color driven by a single accent
hue, translucent glass surfaces, and full light/dark theming.

## ✦ Tech stack

| Area            | Choice                                                         |
| --------------- | ------------------------------------------------------------- |
| Build           | [Vite](https://vitejs.dev) + `@vitejs/plugin-react-swc`       |
| UI              | [React 18](https://react.dev) + TypeScript (strict)           |
| Routing         | [react-router-dom](https://reactrouter.com) v7                |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config)  |
| Components      | [shadcn/ui](https://ui.shadcn.com) (`radix-nova`) on Radix UI |
| Server state    | [TanStack Query](https://tanstack.com/query)                  |
| Client state    | [Zustand](https://zustand-demo.pmnd.rs) (when needed)         |
| Icons           | [lucide-react](https://lucide.dev) (+ inline brand marks)     |
| Toasts          | [sonner](https://sonner.emilkowal.ski)                        |
| Package manager | [pnpm](https://pnpm.io)                                        |

## ✦ Getting started

> Requires [Node.js](https://nodejs.org) 20.11+ and [pnpm](https://pnpm.io/installation).

```bash
# install dependencies
pnpm install

# start the dev server → http://localhost:5173
pnpm dev
```

### Scripts

| Command        | What it does                                        |
| -------------- | --------------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server with HMR.                 |
| `pnpm build`   | Type-check (`tsc`) then build for production.       |
| `pnpm preview` | Serve the production build locally.                 |
| `pnpm lint`    | Type-check only (no emit).                          |
| `pnpm deploy`  | Build and publish `dist/` to GitHub Pages.          |

## ✦ Project structure

Organised with **Feature-Sliced Design** — code is grouped by its role in the
product, with dependencies pointing in one direction only.

```
src/
├── app/                    # composition root
│   ├── providers.tsx       #   Query + Tooltip + Toaster providers
│   ├── router.tsx          #   route table (react-router v7)
│   └── layout/             #   RootLayout, SiteHeader, SiteFooter, backdrop
├── pages/                  # one slice per route
│   ├── home/               #   homePage.tsx + ui/ (hero, highlights, …)
│   ├── about/              #   aboutPage.tsx + ui/ (skills, timeline)
│   ├── projects/           #   projectsPage.tsx + ui/ (projectFilter)
│   ├── blog/               #   blogPage.tsx, blogPostPage.tsx
│   ├── contact/            #   contactPage.tsx + ui/ (contactForm, socialLinks)
│   └── notFound/           #   404
├── shared/                 # reusable, feature-agnostic code
│   ├── ui/                 #   Container, ProjectCard, PostCard, ThemeToggle, …
│   ├── config/             #   site.ts (identity), nav.ts (navigation)
│   ├── data/               #   projects.ts, posts.ts (typed content)
│   ├── hooks/              #   useTheme
│   └── types/              #   content.ts (Project, Post)
├── components/ui/          # shadcn/ui primitives (generated)
├── lib/utils.ts            # the `cn` class-merge helper
└── index.css               # Tailwind v4 theme + tokens + glass utilities
```

The import rule is one-directional:

```
app → pages → shared → components/ui → lib
```

A page never imports from another page; `shared` never imports from a page. See
[`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full rationale and
[`AGENTS.md`](./AGENTS.md) for the working rules.

## ✦ Making it yours

Most personalization happens in a few typed files — no component edits required:

- **Identity** (name, role, tagline, email, socials, location) →
  `src/shared/config/site.ts`
- **Navigation** → `src/shared/config/nav.ts`
- **Projects** → `src/shared/data/projects.ts`
- **Blog posts** → `src/shared/data/posts.ts`
- **Theme** — change `--accent-hue` and `--neutral-hue` in `src/index.css` to
  re-skin the entire site.

### Adding a shadcn component

```bash
pnpm dlx shadcn@latest add <component>
```

Components land in `src/components/ui` in the pinned `radix-nova` style.

## ✦ Deployment

The project builds to a static `dist/` folder and can be hosted anywhere
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, …).

For **GitHub project pages**, set `base: '/<repo-name>/'` in
[`vite.config.ts`](./vite.config.ts), then:

```bash
pnpm deploy
```

For a custom domain or user root site, leave `base: '/'`.

---

<div align="center">
<sub>Structured with Feature-Sliced Design · styled with shadcn/ui</sub>
</div>
