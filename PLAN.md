# Schemify — Next.js → Static ReactJS Conversion Plan

Convert the existing Next.js app (`../schemify`) into a plain static React + TypeScript
single-page app built with **Vite**, output to a static `dist/` folder deployable to
GitHub Pages.

---

## 1. Source analysis (what we're migrating)

The Next.js app is already a **static single-page app** — this makes the conversion straightforward.

| Concern | Finding |
|---|---|
| Routes | One only: `app/page.tsx`. No routing to migrate. |
| Static export | Already `output: "export"` in `next.config.js`. |
| Next-specific APIs | **None** of `next/image`, `next/link`, `next/font`, `next/head`. |
| Only Next coupling | `Metadata` export + `<html>/<body>` shell in `app/layout.tsx`, and `"use client"` directives. |
| Core logic | `lib/analyzer.ts` + 3 interfaces — pure TS, copies as-is. |
| Real runtime deps | `react`, `react-dom`, `@monaco-editor/react`, `monaco-editor`, `react-icons`. |
| Dead deps (drop) | `tailwindcss`, `@tailwindcss/*`, `postcss`, `autoprefixer` (no config, no `@tailwind`/`@apply` anywhere), `prismjs`, `react-syntax-highlighter` (never imported). |
| Styling | Single plain-CSS file `app/globals.css` (~1,479 lines). Copies as-is. |
| Assets | `public/favicon-images/`, `public/logo.png`, `public/schemify-video.mp4`. |
| Deploy target | **base path `/`** (root domain / repo root — chosen by user). |

### Decisions confirmed with user
- **Bundler:** Vite + `react-ts` template.
- **Monaco:** bundled **offline** (no CDN) via `vite-plugin-monaco-editor` / local worker config.

---

## 2. Target structure

```
schemify-static website/
├── index.html              # replaces app/layout.tsx <head> + mount point
├── package.json            # trimmed deps + Vite scripts
├── tsconfig.json           # Vite TS config (+ path alias)
├── tsconfig.node.json
├── vite.config.ts          # base path + Monaco offline plugin
├── public/                 # copied from ../schemify/public verbatim
│   ├── favicon-images/
│   ├── logo.png
│   └── schemify-video.mp4
└── src/
    ├── main.tsx            # ReactDOM.createRoot mount (replaces layout.tsx)
    ├── App.tsx             # from app/page.tsx (Home → App, drop "use client")
    ├── index.css           # from app/globals.css (verbatim)
    ├── lib/
    │   ├── analyzer.ts
    │   └── interfaces/
    │       ├── guidelines-options.interface.ts
    │       ├── issue.interface.ts
    │       └── severity.interface.ts
    └── components/
        ├── HeaderModal.tsx
        ├── FooterModal.tsx
        ├── InputCardModal.tsx
        ├── IssuesCardModal.tsx
        ├── SecurityGuidelinesModal.tsx
        ├── AboutModal.tsx
        └── GetStartedModal.tsx
```

---

## 3. File-by-file migration

### 3.1 `lib/` → `src/lib/`
- Copy `analyzer.ts` and the 3 interfaces unchanged.
- Fix interface cross-imports: `issue.interface.ts` imports `"lib/interfaces/severity.interface"`
  (bare path from Next's `baseUrl: "."`). Convert to relative `"./severity.interface"`.

### 3.2 `app/page.tsx` → `src/App.tsx`
- Remove `"use client"`.
- Rename `Home` → `App`.
- Update imports to `./components/*` and `./lib/*`.
- Logic (state, `analyzeSchema`, refs, handlers) unchanged.

### 3.3 `app/*-modal.tsx` → `src/components/*.tsx`
- Remove `"use client"` from each.
- Fix bare `lib/...` imports → `../lib/...`.
- Asset paths (`/logo.png`, `/schemify-video.mp4`) stay root-relative — Vite `base` handles them.
- No logic changes.

### 3.4 `app/layout.tsx` → split into `index.html` + `src/main.tsx`
- **`index.html`**: translate the `Metadata` object into real `<head>` tags:
  `<title>`, `<meta name="description">`, keywords, robots, OpenGraph (`og:*`),
  Twitter, author, favicon `<link>`s. Add `<div id="root">` and
  `<script type="module" src="/src/main.tsx">`.
- **`src/main.tsx`**: standard React 18 entry —
  `createRoot(document.getElementById("root")!).render(<StrictMode><App/></StrictMode>)`,
  import `./index.css`.

### 3.5 `app/globals.css` → `src/index.css`
- Copy verbatim (strip BOM if present).

---

## 4. Configuration

### 4.1 `package.json`
```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-icons": "^5.6.0",
    "@monaco-editor/react": "^4.7.0",
    "monaco-editor": "^0.55.1"
  },
  "devDependencies": {
    "@types/react": "...", "@types/react-dom": "...",
    "@vitejs/plugin-react": "...", "typescript": "...", "vite": "...",
    "vite-plugin-monaco-editor": "...", "gh-pages": "^6.3.0"
  }
}
```

### 4.2 `vite.config.ts`
- `base: "/"` (root — chosen by user).
- `@vitejs/plugin-react`.
- Monaco **offline**: configure `vite-plugin-monaco-editor` (bundle the `json` language
  worker + editor worker locally) so the editor needs no internet.

### 4.3 `tsconfig.json`
- Vite defaults; optional `@/` path alias mirrored in `vite.config.ts`.

---

## 5. Verification checklist
- `npm install`
- `npm run dev` — confirm:
  - Monaco editor loads (offline) and is editable.
  - Paste/import schema → **Run Analysis** populates issues + severity counts.
  - Clicking an issue highlights the editor line.
  - Guidelines toggles/thresholds re-run analysis live.
  - Header/Footer/About/Get-Started modals open; logo + footer video render.
- `npm run build && npm run preview` — confirm the production build works under `/schemify/`.

---

## 6. Out of scope / notes
- No server, API routes, or SSR existed — nothing lost.
- SEO: static `<head>` tags replicate the previous `Metadata` exactly.
- Original `../schemify` is left untouched; new project is self-contained here.
