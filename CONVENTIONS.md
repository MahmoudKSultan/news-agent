# Project Conventions & Structure

## Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Icons:** Iconify (`@iconify/react`)
- **Server State:** TanStack React Query
- **Validation:** Zod
- **Forms:** React Hook Form + `@hookform/resolvers`
- **UI Library:** shadcn/ui (Radix UI primitives)
- **DB:** SQLite via `better-sqlite3` or `drizzle-orm`
- **LLM:** Ollama (local) / Gemini API (free tier)

---

## Project Structure

```
src/
├── app/                          # App Router — routes ONLY
│   ├── (auth)/                   # Route group: auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route group: main app
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── articles/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                      # Route Handlers (only when needed)
│   │   └── webhooks/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── loading.tsx               # Global loading
│   └── globals.css
│
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui primitives (Button, Input, etc.)
│   ├── layout/                   # Navbar, Sidebar, Footer
│   ├── forms/                    # Form components
│   └── shared/                   # Shared business components
│
├── features/                     # Feature-sliced modules
│   ├── articles/
│   │   ├── components/           # Feature-specific components
│   │   ├── hooks/                # Feature-specific hooks
│   │   ├── schemas.ts            # Zod schemas
│   │   ├── queries.ts            # React Query queries
│   │   └── actions.ts            # Server Actions
│   ├── sources/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas.ts
│   │   └── actions.ts
│   ├── analysis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── actions.ts
│   ├── learning/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── schemas.ts
│   └── notifications/
│       ├── components/
│       └── actions.ts
│
├── lib/                          # Pure utilities, no React
│   ├── db/
│   │   ├── schema.ts             # Drizzle/tables definition
│   │   ├── queries.ts            # DB query helpers
│   │   └── index.ts              # DB client singleton
│   ├── llm/
│   │   ├── client.ts             # Ollama/Gemini API wrapper
│   │   └── prompts.ts            # Prompt templates
│   ├── fetch/
│   │   ├── rss.ts                # RSS feed parser
│   │   ├── youtube.ts            # YouTube transcript fetcher
│   │   ├── scrape.ts             # Web scraper
│   │   └── search.ts             # DuckDuckGo search
│   ├── translate/
│   │   └── client.ts             # Translation client
│   ├── email/
│   │   └── send.ts               # Email sender
│   ├── utils.ts                  # Generic helpers
│   └── constants.ts              # App-wide constants
│
├── hooks/                        # Shared custom hooks
│   ├── use-debounce.ts
│   ├── use-media-query.ts
│   └── use-local-storage.ts
│
├── types/                        # Shared TypeScript types
│   ├── article.ts
│   ├── user.ts
│   ├── source.ts
│   └── common.ts
│
├── config/                       # Environment & service config
│   ├── site.ts                   # Site metadata
│   └── query-client.ts           # React Query client config
│
└── providers/                    # React context providers
    ├── query-provider.tsx
    └── theme-provider.tsx
```

---

## Conventions

### 1. `app/` is for routes only
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` only
- No business logic in page files — compose from `features/` or `components/`
- Pages should be < 150 lines. Split if larger.

### 2. Server Components by default
- **No `"use client"`** unless you need: browser APIs, event handlers, hooks, or interactivity
- Extract interactive parts as small leaf components, don't wrap entire pages

### 3. Feature-based organization
- Each domain (articles, sources, analysis, learning, notifications) is a folder under `features/`
- Feature folders contain: `components/`, `hooks/`, `schemas.ts`, `queries.ts`, `actions.ts`
- If a component is used by only one feature → colocate it there
- If shared across 2+ features → promote to `components/shared/`

### 4. Data fetching
- **Server Components:** Fetch directly (async component), no React Query
- **Client Components:** Use React Query (`useQuery`, `useMutation`)
- Mutations: Use Server Actions (`"use server"`) or React Query mutations
- React Query is only for data that needs real-time updates or cross-component cache

### 5. Forms (React Hook Form + Zod)
```typescript
// schemas.ts (colocated with feature)
import { z } from "zod"

export const articleSourceSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1).max(100),
  type: z.enum(["rss", "youtube", "web"]),
})

export type ArticleSourceInput = z.infer<typeof articleSourceSchema>
```

```typescript
// component.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { articleSourceSchema, type ArticleSourceInput } from "./schemas"

export function SourceForm() {
  const form = useForm<ArticleSourceInput>({
    resolver: zodResolver(articleSourceSchema),
  })
  // ...
}
```

### 6. React Query patterns
```typescript
// queries.ts (colocated with feature)
import { useQuery } from "@tanstack/react-query"

export function useArticles(sessionId: string) {
  return useQuery({
    queryKey: ["articles", sessionId],
    queryFn: () => fetch(`/api/articles?sessionId=${sessionId}`).then(r => r.json()),
  })
}
```

### 7. Server Actions
```typescript
// actions.ts (colocated with feature)
"use server"

import { z } from "zod"
import { db } from "@/lib/db"

export async function addSource(formData: FormData) {
  // validate, mutate, revalidate
}
```

### 8. Naming conventions
| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `article-list.tsx` |
| Components | PascalCase | `ArticleList` |
| Functions | camelCase | `fetchArticles()` |
| Types/Interfaces | PascalCase | `Article`, `SourceConfig` |
| Zod schemas | camelCase | `articleSchema` |
| Hooks | `use` prefix | `useArticles()` |
| Queries | `use` prefix | `useArticles()` |
| Server Actions | descriptive verb | `addSource`, `deleteArticle` |
| CSS classes | Tailwind utility classes | no custom CSS unless necessary |
| Folders (features) | kebab-case | `article-list/`, `source-form/` |

### 9. Icons
Use Iconify. Import from `@iconify/react`:
```typescript
import { Icon } from "@iconify/react"

// usage
<Icon icon="mdi:rss" className="size-5" />
<Icon icon="mdi:youtube" className="size-5" />
<Icon icon="mdi:translate" className="size-5" />
```

### 10. TypeScript
- Strict mode enabled
- Prefer `type` over `interface` for consistency
- No `any` — use `unknown` and narrow
- Export types from feature `schemas.ts` using `z.infer`
- Shared types go in `types/`

### 11. UI (shadcn/ui)
- Components in `components/ui/` are generated by shadcn CLI — do not edit manually
- Customize theme in `globals.css` CSS variables
- Use `cn()` utility for conditional class merging

### 12. Imports order
1. React/Next.js
2. Third-party libraries
3. `@/components/`
4. `@/features/`
5. `@/lib/`
6. `@/hooks/`
7. `@/types/`
8. Relative imports (last resort)

### 13. File output structure
Each agent run generates:
```
output/
└── 2026-06-15_run-abc123/
    ├── index.html              # Dashboard for this run
    ├── summary.json            # Machine-readable summary
    ├── articles/
    │   ├── 001-bbc-headline.md
    │   ├── 002-techcrunch-story.md
    │   └── ...
    └── assets/
        └── ...
```

### 14. Git
- No `node_modules/`, `.next/`, `output/`, `.env` in repo
- Commit messages: concise, imperative mood

---

## Agent Architecture

```
Schedule trigger
      ↓
Agent.run(session_id, user_profile)
      ↓
  ├── 1. Fetch sources (RSS → parse → dedupe)
  ├── 2. Fetch YouTube transcripts
  ├── 3. Scrape web (if enabled)
  ├── 4. For each article:
  │   ├── a. Summarize (short + detailed)
  │   ├── b. Analyze (sentiment, entities, category)
  │   ├── c. Translate (if user lang ≠ source lang)
  │   └── d. Store in DB
  ├── 5. Generate output (HTML + file tree)
  ├── 6. Send notification (email)
  └── 7. Wait for user ratings → update profile
```

On low rating:
```
if rating < 3:
    adjust_params = agent.choose_alternative(source, style, angle)
    retry article with adjust_params
    re-present for rating
```

---

## Design System

### Color Palette
| Token | Usage | Light | Dark |
|---|---|---|---|
| `brand` | Primary actions, links, active states | Deep blue (#500) | Lighter blue (#400) |
| `sentiment-positive` | Positive analysis badges | Green | Green |
| `sentiment-negative` | Negative analysis badges | Red | Red |
| `sentiment-neutral` | Neutral analysis badges | Gray | Gray |
| `rating-star` | Star rating filled | Gold/amber | Gold/amber |

### Typography
```typescript
// Use design tokens from @/config/design
h1: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
h2: "text-xl sm:text-2xl font-semibold tracking-tight"
h3: "text-lg sm:text-xl font-semibold"
body: "text-sm sm:text-base leading-relaxed"
small: "text-xs sm:text-sm text-muted-foreground"
```

### Article Card Pattern
```tsx
// Standard article card — use this everywhere articles appear
<article className="rounded-xl border bg-card p-4 sm:p-5 hover:shadow-md transition-shadow">
  <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2">
    {title}
  </h3>
  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
    {summary}
  </p>
  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
    <Badge variant="outline">{source}</Badge>
    <span>·</span>
    <span>{date}</span>
  </div>
</article>
```

### Sentiment Badge
```tsx
// Use badge variants for sentiment
<Badge className="bg-sentiment-positive-bg text-sentiment-positive">Positive</Badge>
<Badge className="bg-sentiment-negative-bg text-sentiment-negative">Negative</Badge>
<Badge className="bg-sentiment-neutral-bg text-sentiment-neutral">Neutral</Badge>
```

### Rating Stars
```tsx
// Use Iconify star icons
import { Icon } from "@iconify/react"

// Filled
<Icon icon="mdi:star" className="text-rating-star size-4" />
// Empty
<Icon icon="mdi:star-outline" className="text-rating-star-empty size-4" />
// Half
<Icon icon="mdi:star-half-full" className="text-rating-star size-4" />
```

### Spacing Guide
- **Page padding:** `px-4 sm:px-6 lg:px-8`
- **Section gap:** `py-6 sm:py-8 lg:py-10`
- **Card padding:** `p-4 sm:p-6`
- **Component gap:** `gap-2 sm:gap-3 lg:gap-4`
- **List gap:** `space-y-3 sm:space-y-4`

### Component Usage Rules
| Component | When to use |
|---|---|
| `Button` | Actions, submissions |
| `Card` | Article previews, dashboard widgets |
| `Badge` | Source labels, categories, sentiment tags |
| `Input` / `Textarea` | Forms, settings |
| `Select` | Dropdown choices (schedule, language) |
| `Dialog` | Confirmations, detail views |
| `Sheet` | Side panels, settings drawer |
| `Separator` | Divider between sections |
| `DropdownMenu` | Overflow actions, user menu |

---

## Key Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-15 | Feature-based folders over flat structure | Scales better, easy to delete features |
| 2026-06-15 | Server Components by default | Better perf, smaller JS bundles |
| 2026-06-15 | shadcn/ui for UI library | Composable, accessible, Tailwind-native |
| 2026-06-15 | React Query only for client-side data | Server Components handle initial fetch |
| 2026-06-15 | SQLite over Postgres for MVP | Zero setup, single file, portable |
