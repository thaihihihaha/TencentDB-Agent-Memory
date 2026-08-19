# Motrix-only MemoryPanel UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin `MemoryPanel/web` to match Motrix while preserving every existing route, API, state, permission, handler, accessibility hook, and component contract.

**Architecture:** Keep React 18, Tea Component, Tailwind 3, Zustand, Sigma, and the existing component tree. Add a three-layer token stylesheet plus one last-loaded skin stylesheet. Add presentation class hooks only where inline styles or hardcoded utilities block a safe override. Verify with a zero-dependency Node contract and browser screenshots.

**Tech Stack:** React 18, TypeScript 5, Vite 6, Tailwind CSS 3, Tea Component 2.8, CSS custom properties, Node.js built-ins, ephemeral Playwright Docker.

**Spec:** `docs/superpowers/specs/2026-08-19-motrix-only-memory-panel-design.md`

## Global Constraints

- Install zero packages and do not change dependency blocks or `MemoryPanel/web/package-lock.json`.
- Do not change router paths, API calls, Zustand state, ACL checks, handlers, refs, conditions, i18n keys, storage keys, or semantic HTML.
- Preserve every `data-guide` hook, onboarding selector/body class, Tea portal behavior, split-resizer behavior, hash migration, open-tab behavior, and the single-scroller height chain.
- Do not copy Motrix Iconly/UI8 PNGs, Motrix branding, Apple SFNS fonts, Electron chrome, or native Liquid Glass code.
- Keep light mode active; do not add theme state or persistence.
- Never stage these user-owned pre-existing changes: `MemoryCore/src/core/prompts/l1-dedup.ts`, `l1-extraction.ts`, `persona-generation.ts`, `scene-extraction.ts`, `MemoryPanel/web/src/i18n/en-US.ts`, `MemoryPanel/web/src/i18n/index.ts`, `MemoryPanel/web/src/i18n/vi-VN.ts`, and `MemoryPanel/web/src/layouts/GlobalHeader/LanguageSwitcher.tsx`.
- Stage exact paths only; never use `git add .` or `git add -A`.
- Baseline: frontend TypeScript passes; ESLint exits 0 with 99 existing warnings; build passes with existing dynamic-import/chunk-size warnings; whole-repo `format:check` is not a gate because 90 existing files fail it.

## File Map

- Create `MemoryPanel/web/src/styles/motrix-tokens.css`: primitive → semantic → component tokens plus Tea/Tailwind aliases.
- Create `MemoryPanel/web/src/styles/motrix-skin.css`: shell, Tea primitives, pages, states, motion, responsive overrides.
- Create `MemoryPanel/web/scripts/check-motrix-skin.mjs`: dependency/import/token/selector contract.
- Create `THIRD_PARTY_NOTICES.md`: Motrix MIT attribution and excluded proprietary assets.
- Modify `MemoryPanel/web/src/main.tsx`: last-load the token and skin styles.
- Modify `MemoryPanel/web/src/components/LoginGate.tsx`: presentation class hooks only.
- Modify `MemoryPanel/web/src/components/SettingsDialog.tsx`: replace presentation-only inline styles with class hooks.
- Do not modify `ConsoleLayout.tsx`, routes, stores, services, API wrappers, or page TSX files.

---

### Task 1: Add the Contract Check and Token Layer

**Files:**
- Create: `MemoryPanel/web/scripts/check-motrix-skin.mjs`
- Create: `MemoryPanel/web/src/styles/motrix-tokens.css`
- Create: `MemoryPanel/web/src/styles/motrix-skin.css`
- Modify: `MemoryPanel/web/src/main.tsx:9-11`

**Interfaces:**
- Consumes: exact tokens in spec §6.
- Produces: `--mx-*` variables and `node scripts/check-motrix-skin.mjs <suite>`.

- [ ] **Step 1: Write the failing Node contract**

Create a built-in-only script with suites `tokens`, `shell`, `primitives`, `workbench`, `resources`, `team`, and `responsive`. Each suite reads one CSS file and asserts required strings. The complete required contract is:

```js
const required = {
  tokens: ['/* Layer 1: primitives */', '/* Layer 2: semantics */', '/* Layer 3: components */', '--mx-neutral-000:', '--mx-shell-gradient:', '--mx-sidebar-width: 200px;', '--mx-sidebar-width-collapsed: 48px;', '--mx-tile-radius:', '--mx-dialog-radius:', '--background: var(--mx-surface-card);', '--tea-color-bg-brand-default: var(--mx-action-primary);'],
  shell: ['._memory-app-shell', '._memory-global-header', '.tea-menu-is-collapsed.tea-menu--light', '.tea-layout__content', '._memory-tabbar-item--active'],
  primitives: ['.tea-btn', '.tea-input', '.tea-table', '.tea-dialog', '.tea-drawer', '.tea-segment', '.tea-tabs'],
  workbench: ['._memory-workbench-task-card', '._memory-workbench-task-grid', '._memory-workbench-skeleton-card', '._memory-workbench-empty-card'],
  resources: ['._asset-page-header', '._asset-split', '._alp-item', '._asset-wiki-card', '._codelist-card', '._memory-skills-split', '._memory-detail-panel'],
  team: ['._memory-panel-card', '._memory-agent-card', '._memory-member-card', '._memory-apikey-body', '._memory-settings-module'],
  responsive: ['@media (max-width: 960px)', '@media (max-width: 767px)', '@media (max-width: 720px)', '@media (prefers-reduced-motion: reduce)'],
};
```

The script must also assert this import order:

```ts
import './tea-override.css';
import './styles/motrix-tokens.css';
import './styles/motrix-skin.css';
```

It must parse `package.json` and fail if any of these appear in dependencies or devDependencies: `@base-ui/react`, `@fontsource-variable/inter`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `cmdk`, `next-themes`, `recharts`, `shadcn`, `tailwind-merge`, `tw-animate-css`, `vaul`.

- [ ] **Step 2: Run `node scripts/check-motrix-skin.mjs tokens` and confirm failure because the files/imports do not exist.**

- [ ] **Step 3: Create `motrix-tokens.css` from the literal primitive, semantic, and component blocks in spec §6.1–6.3.**

Map the existing aliases exactly:

```css
:root {
  --background: var(--mx-surface-card);
  --background-deep: var(--mx-surface-app);
  --foreground: var(--mx-text-primary);
  --card: var(--mx-surface-card);
  --card-foreground: var(--mx-text-primary);
  --popover: var(--mx-surface-card);
  --popover-foreground: var(--mx-text-primary);
  --primary: var(--mx-action-primary);
  --primary-foreground: var(--mx-text-on-primary);
  --secondary: var(--mx-surface-subtle);
  --secondary-foreground: var(--mx-text-primary);
  --muted: var(--mx-surface-subtle);
  --muted-foreground: var(--mx-text-secondary);
  --accent: var(--mx-surface-selected);
  --accent-hover: var(--mx-surface-selected);
  --accent-foreground: var(--mx-text-primary);
  --destructive: var(--mx-destructive);
  --border: var(--mx-border-default);
  --input: var(--mx-border-default);
  --input-background: var(--mx-surface-card);
  --ring: var(--mx-action-focus);
  --tea-color-bg-page-default: var(--mx-surface-app);
  --tea-color-bg-primary-default: var(--mx-surface-card);
  --tea-color-bg-secondary-default: var(--mx-surface-subtle);
  --tea-color-bg-secondary-hover: var(--mx-surface-selected);
  --tea-color-bg-brand-default: var(--mx-action-primary);
  --tea-color-text-primary: var(--mx-text-primary);
  --tea-color-text-secondary: var(--mx-text-secondary);
  --tea-color-border-primary-default: var(--mx-border-default);
  --tea-color-border-secondary-default: var(--mx-border-subtle);
  --tea-color-border-brand-default: var(--mx-action-focus);
}
```

- [ ] **Step 4: Create `motrix-skin.css` with the real header comment `/* Motrix visual skin for the existing Tea/React behavior layer. */` and add both final imports to `main.tsx`.**

- [ ] **Step 5: Run the token suite, TypeScript, and build.**

```bash
cd MemoryPanel/web
node scripts/check-motrix-skin.mjs tokens
npm exec tsc -- --noEmit --pretty false
npm run build
```

- [ ] **Step 6: Commit exact Task 1 files.**

```bash
git add MemoryPanel/web/scripts/check-motrix-skin.mjs MemoryPanel/web/src/styles/motrix-tokens.css MemoryPanel/web/src/styles/motrix-skin.css MemoryPanel/web/src/main.tsx
git diff --cached --check
git commit -m "style(panel): add Motrix design tokens"
```

---

### Task 2: Skin Shell, Header, Sidebar, and Tabs

**Files:**
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: continuous CSS glass canvas, 200/48px sidebar, 8px inset surface, neutral navigation, segmented tabs.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs shell` and confirm the first missing selector.**

- [ ] **Step 2: Add the exact shell geometry.**

```css
html, body, #root, ._memory-app-shell { background: var(--mx-shell-gradient); }
body { font-family: var(--mx-font-family); color: var(--mx-text-primary); }
._memory-app-shell, ._memory-app-shell > .tea-layout, ._memory-app-shell .tea-layout__body { background: transparent; }
._memory-app-shell .tea-layout__content {
  min-width: 0;
  margin: var(--mx-content-inset) var(--mx-content-inset) var(--mx-content-inset) 0;
  overflow: hidden;
  border: 1px solid var(--mx-border-subtle);
  border-radius: var(--mx-content-radius);
  background: var(--mx-surface-content);
  box-shadow: var(--mx-shadow-sm);
  backdrop-filter: blur(24px) saturate(1.05);
}
._memory-content-body { padding: var(--mx-space-4); background: transparent; }
```

- [ ] **Step 3: Skin `._memory-global-header*` without changing DOM: 48px transparent chrome, no bottom border, 8px ghost-control radius, 16px icons, neutral 6% hover. Preserve `._memory-global-header-brand`.**

- [ ] **Step 4: Override Tea menu width/state while retaining Tea collapse behavior.**

```css
._memory-app-shell .tea-menu--light.tea-menu,
._memory-app-shell .tea-menu--light .tea-menu__body { width: var(--mx-sidebar-width); border-right: 0; background: transparent; }
._memory-app-shell .tea-menu-is-collapsed.tea-menu--light,
._memory-app-shell .tea-menu-is-collapsed.tea-menu--light .tea-menu__body { width: var(--mx-sidebar-width-collapsed); }
._memory-app-shell .tea-menu--light .tea-menu__list > li:not(.tea-menu__label) { margin: 2px var(--mx-space-2); }
._memory-app-shell .tea-menu--light .tea-menu__list > li:not(.tea-menu__label) > .tea-menu__item {
  height: var(--mx-sidebar-row-height);
  gap: var(--mx-space-2);
  padding: 0 var(--mx-space-2-5);
  border-radius: var(--mx-sidebar-row-radius);
}
._memory-app-shell .tea-menu--light .tea-menu__list > li:not(.tea-menu__label).is-selected > .tea-menu__item,
._memory-app-shell .tea-menu--light .tea-menu__list > li:not(.tea-menu__label) > .tea-menu__item:hover {
  background: var(--mx-surface-selected) !important;
  color: var(--mx-text-primary);
}
```

Resize `.tea-menu__footer`, `.tea-menu__fold`, and `.tea-menu__fold-icon` to 48px/32px without altering click or rotation semantics.

- [ ] **Step 5: Convert `._memory-tabbar*` to a 36px segmented track with 3px padding, 10px track radius, 8px triggers, white active surface, `--mx-shadow-xs`, and the existing close/focus behavior.**

- [ ] **Step 6: Run shell contract, TypeScript, build, then commit `motrix-skin.css` as `style(panel): match Motrix application shell`.**

---

### Task 3: Skin Login and Tea Primitives

**Files:**
- Modify: `MemoryPanel/web/src/components/LoginGate.tsx:280-331`
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`

**Interfaces:**
- Consumes: Task 1 component tokens.
- Produces: consistent login and Tea button/input/select/table/dialog/drawer/tag/alert/segment/tab/dropdown/switch states.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs primitives` and confirm failure.**

- [ ] **Step 2: Add only these presentation hooks to existing LoginGate wrappers: `_memory-login-root`, `_memory-login-visual`, `_memory-login-form-shell`, `_memory-login-content`. Do not remove existing classes or edit SVG paths, state, effects, submit logic, or fields.**

- [ ] **Step 3: Style the login hooks with the shell gradient, a 14px white/88% form surface, Motrix system font, 24px/600 title, 14px body, and 36px controls.**

- [ ] **Step 4: Apply exact Tea primitive metrics and states.**

```css
.tea-btn {
  min-height: var(--mx-button-height);
  padding: 0 var(--mx-space-4);
  border-radius: var(--mx-button-radius);
  font-size: var(--mx-font-body);
  font-weight: 500;
  transition: color var(--mx-duration-fast) var(--mx-ease-standard), background-color var(--mx-duration-fast) var(--mx-ease-standard), border-color var(--mx-duration-fast) var(--mx-ease-standard), box-shadow var(--mx-duration-normal) ease-out;
}
.tea-btn--primary { border-color: var(--mx-action-primary); background: var(--mx-action-primary); color: var(--mx-text-on-primary); }
.tea-input, .tea-search, .tea-select__input, .tea-dropdown__header {
  min-height: var(--mx-input-height);
  border-color: var(--mx-border-default);
  border-radius: var(--mx-input-radius);
  background: var(--mx-surface-card);
}
.tea-input:focus, .tea-input:focus-visible, .tea-search:focus-within, .tea-select.is-focused .tea-select__input {
  border-color: var(--mx-action-focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--mx-action-focus) 50%, transparent);
}
button:not(:disabled):active, [role='button']:not(:disabled):active { transform: none; }
```

Add token-driven rules for `.tea-table`, `.tea-dialog`, `.tea-drawer`, `.tea-tag`, `.tea-alert`, `.tea-segment`, `.tea-tabs`, `.tea-dropdown-box`, `.tea-list--option`, `.tea-form`, and `.tea-switch` using spec §7.4–7.7. Preserve Tea state classes and portal semantics.

- [ ] **Step 5: Run primitive contract, TypeScript, lint, build; commit exact LoginGate and skin files as `style(panel): refine Motrix controls and login`.**

---

### Task 4: Apply Motrix Dashboard Treatment to Workbench

**Files:**
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`

**Interfaces:**
- Consumes: unchanged Workbench DOM and Task 1 tokens.
- Produces: 18px task tiles, 16px rhythm, Motrix title/metadata/status/empty/loading treatment.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs workbench` and confirm failure.**

- [ ] **Step 2: Apply the tile surface.**

```css
._memory-workbench-task-grid { gap: var(--mx-space-4); }
._memory-workbench-task-card, ._memory-workbench-skeleton-card, ._memory-workbench-empty-card {
  border: 1px solid var(--mx-border-subtle);
  border-radius: var(--mx-tile-radius);
  background: linear-gradient(180deg, oklch(1 0 0 / 0.98), oklch(1 0 0 / 0.93)), var(--mx-surface-card);
  box-shadow: none;
}
._memory-workbench-task-card { padding: var(--mx-tile-padding); }
._memory-workbench-task-card:hover {
  border-color: color-mix(in srgb, var(--mx-text-primary) 14%, transparent);
  box-shadow: var(--mx-shadow-xs);
  transform: none;
}
```

- [ ] **Step 3: Set titles to 14px/600, description/meta to 12px, labels to 10px uppercase with `.04em` tracking, pills to full radius, and time/ID to tabular numerals. Keep existing text/icons and status semantics.**

- [ ] **Step 4: Check empty, skeleton, pagination, Drawer, edit, destructive, disabled, and permission states; confirm no Workbench TSX/hook diff.**

- [ ] **Step 5: Run Workbench contract and build; commit `motrix-skin.css` as `style(panel): match Motrix dashboard tiles`.**

---

### Task 5: Skin Wiki, Code, Skills, Memory, and Graph Surfaces

**Files:**
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`

**Interfaces:**
- Consumes: unchanged `AssetPageHeader`, `AssetListPanel`, `AssetSplitLayout`, Wiki/Code/Skill/Memory DOM.
- Produces: Motrix Downloads/Plugins language without changing polling, pagination, split widths, selection, editing, or graph behavior.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs resources` and confirm failure.**

- [ ] **Step 2: Apply a 32/24/16px page header, 24px/600 title, 14px split surface, and tokenized resizer focus. Keep inline grid columns and 220–480px constraints untouched.**

```css
._asset-page-header { padding: var(--mx-space-8) var(--mx-space-6) var(--mx-space-4); }
._asset-page-header-title { color: var(--mx-text-primary); font-size: var(--mx-font-title); font-weight: 600; letter-spacing: -0.025em; }
._asset-split { gap: 0; overflow: hidden; border: 1px solid var(--mx-border-subtle); border-radius: var(--mx-card-radius); background: var(--mx-surface-card); }
._asset-split-resizer:focus-visible ._asset-split-resizer-bar,
._asset-split--dragging ._asset-split-resizer-bar { background: var(--mx-action-focus); }
```

- [ ] **Step 3: Normalize `._alp-item`, `._asset-wiki-card`, `._codelist-card`, `._memory-skill-item`, `._memory-personal-asset`, and `._memory-card` to 48px row rhythm, 14px radius, neutral hover/selected, 14px names, 12px metadata.**

- [ ] **Step 4: Skin Wiki/Code/Skill/Memory detail cards and the Sigma canvas wrapper/toolbar/search/legend/control surface. Do not touch `KnowledgeGraph.tsx`, Sigma settings, node data, or events.**

- [ ] **Step 5: Inspect loading, empty, error, upload, search, edit, delete, pagination, layer tabs, chat bubbles, and resizer focus. Confirm no resource TSX/hook file appears in `git diff --name-only`.**

- [ ] **Step 6: Run resource contract, TypeScript, build; commit `motrix-skin.css` as `style(panel): unify Motrix resource surfaces`.**

---

### Task 6: Skin Team, API Keys, Profile, and Settings

**Files:**
- Modify: `MemoryPanel/web/src/components/SettingsDialog.tsx:127-193`
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`

**Interfaces:**
- Consumes: unchanged Team/Agent/Member/API key/settings behavior.
- Produces: Motrix Plugins/Settings card treatment and class-based Settings rows.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs team` and confirm failure.**

- [ ] **Step 2: Replace only SettingsDialog inline presentation with these hooks: `_memory-settings-body`, `_memory-settings-title`, `_memory-settings-description`, `_memory-settings-modules`, `_memory-settings-module`, `_memory-settings-module--enabled`, `_memory-settings-module-main`, `_memory-settings-module-icon`, `_memory-settings-module-copy`, `_memory-settings-module-heading`, `_memory-settings-module-name`, `_memory-settings-module-description`. Keep loading, optimistic update, rollback, tags, Switch, conditions, and `handleToggle` unchanged.**

- [ ] **Step 3: Apply card surfaces and non-shifting hover.**

```css
._memory-panel-card, ._memory-agent-card, ._memory-agents-card, ._memory-member-card, ._memory-apikey-body {
  border: 1px solid var(--mx-border-subtle);
  border-radius: var(--mx-card-radius);
  background: var(--mx-surface-card);
  box-shadow: none;
}
._memory-agent-card--clickable:hover, ._memory-agents-card--editable:hover, ._memory-member-card--clickable:hover {
  border-color: color-mix(in srgb, var(--mx-text-primary) 14%, transparent);
  background: color-mix(in srgb, var(--mx-surface-card) 96%, var(--mx-surface-selected));
  box-shadow: var(--mx-shadow-xs);
  transform: none;
}
```

- [ ] **Step 4: Set Team title 24px; names 14px/600; metadata 12px; avatar/icon 40px where current bounds permit; table rows 48px; API keys tabular mono. Style Settings rows with 12px gap, 12px/16px padding, 14px radius, neutral enabled fill, 14px/600 title, 12px description.**

- [ ] **Step 5: Run team contract, TypeScript, lint, build; commit exact SettingsDialog and skin files as `style(panel): refine Motrix team and settings UI`.**

---

### Task 7: Add Responsive, Accessibility, Motion, and Attribution Gates

**Files:**
- Modify: `MemoryPanel/web/src/styles/motrix-skin.css`
- Create: `THIRD_PARTY_NOTICES.md`

**Interfaces:**
- Consumes: Tasks 1–6.
- Produces: 960/767/720 behavior, visible focus, reduced motion, Motrix attribution.

- [ ] **Step 1: Run `node scripts/check-motrix-skin.mjs responsive` and confirm failure.**

- [ ] **Step 2: Add exact media policies.**

```css
@media (max-width: 960px) {
  ._asset-split, ._memory-skills-split { border-radius: var(--mx-card-radius); }
}
@media (max-width: 767px) {
  .tea-btn, .tea-input, .tea-search, .tea-select__input, ._memory-global-header-icon-btn { min-height: 44px; }
  .tea-input, input, select, textarea { font-size: 16px; }
}
@media (max-width: 720px) {
  ._asset-page-header, ._memory-global-header, ._memory-workbench-task-card-head { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  ._memory-app-shell *, ._memory-app-shell *::before, ._memory-app-shell *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Do not replace the existing ≤960px stack mechanism or add mobile sidebar state.

- [ ] **Step 3: Audit 4.5:1 text, 3:1 UI/focus, 2–3px focus indicators, semantic disabled/loading/error, keyboard route, tab close, resizer keys, modal escape, and reduced motion.**

- [ ] **Step 4: Create `THIRD_PARTY_NOTICES.md` with Motrix copyright 2018-present Dr_rOot, the full MIT permission/warranty from Motrix `LICENSE`, and an explicit statement that Iconly/UI8 PNGs, Motrix brand assets, and Apple SFNS fonts are not included.**

- [ ] **Step 5: Run responsive contract, TypeScript, build; commit exact skin/notice files as `style(panel): harden responsive Motrix skin`.**

---

### Task 8: Browser Smoke Test and Visual Calibration

**Files:**
- Modify only if calibration requires it: `MemoryPanel/web/src/styles/motrix-tokens.css`
- Modify only if calibration requires it: `MemoryPanel/web/src/styles/motrix-skin.css`
- Runtime only: `/tmp/tencentdb-visual/**`; never commit screenshots or auth state.

**Interfaces:**
- Consumes: live backend `https://tencentdb.b.matbao.ai`, Motrix screenshots, completed CSS.
- Produces: reviewed screenshots at reference and responsive viewports.

- [ ] **Step 1: Start Vite against the live backend.**

```bash
cd MemoryPanel/web
VITE_TMC_BACKEND_URL=https://tencentdb.b.matbao.ai VITE_SKILL_GATEWAY_URL=https://tencentdb.b.matbao.ai npm run dev -- --host 0.0.0.0 --port 5173
```

- [ ] **Step 2: Use ephemeral `mcr.microsoft.com/playwright:v1.62.1-noble`. Pass `TDAI_SERVICE_ID` and `TDAI_USER_KEY` as environment variables, verify via `/api/v1/meta/auth/verify`, and write `tdai-panel.session` only inside the browser context. Never print or persist the key outside `/tmp` mode 600.**

- [ ] **Step 3: Capture all eight hash routes at 1828×1344 raster plus shell views at 1440×900, 1280×800, and 375×812.**

- [ ] **Step 4: Smoke sidebar collapse, TeamSwitcher, tab open/close, profile/settings, a right Drawer, split mouse/keyboard resize, a non-destructive create/edit dialog, hover/focus/disabled, console errors, and reduced motion.**

- [ ] **Step 5: Compare `/` to `motrix-dashboard.webp`; resource routes to `motrix-downloads.webp`; team routes/dialogs to `motrix-settings.webp`. Use side-by-side and 50% overlay for corresponding shell/components, not a full-page pixel score across different content.**

- [ ] **Step 6: Calibrate primitive/semantic tokens before selector exceptions. Re-capture until common shell, 200px sidebar, 8px inset, 14/18px radii, title geometry, row/control metrics, and dialogs align.**

- [ ] **Step 7: If CSS changed, run contract/build and commit exact token/skin files as `style(panel): calibrate Motrix visual fidelity`.**

---

### Task 9: Final Review, Verification, and Push

**Files:**
- Review: every file changed since commit `9dead14`.

**Interfaces:**
- Consumes: completed implementation and screenshots.
- Produces: verified `origin/feat/server_team`.

- [ ] **Step 1: Run complete gates.**

```bash
cd MemoryPanel/web
node scripts/check-motrix-skin.mjs
npm exec tsc -- --noEmit --pretty false
npm run lint:check
npm run build
npx prettier --check src/main.tsx src/components/LoginGate.tsx src/components/SettingsDialog.tsx src/styles/motrix-tokens.css src/styles/motrix-skin.css scripts/check-motrix-skin.mjs
```

- [ ] **Step 2: Audit scope and TSX logic drift.**

```bash
cd ../../
git diff 9dead14 --stat
git diff 9dead14 -- MemoryPanel/web/src/components/LoginGate.tsx
git diff 9dead14 -- MemoryPanel/web/src/components/SettingsDialog.tsx
git status --short
```

TSX diffs must contain only class/style migration. User-owned pre-existing paths must remain unstaged.

- [ ] **Step 3: Run independent review against the spec. Fix every P0/P1 cascade, portal, scrolling, responsive, accessibility, licensing, or logic-drift finding and rerun affected gates.**

- [ ] **Step 4: Create a final exact-path fix commit only when review changes exist, using `fix(panel): address Motrix skin review`.**

- [ ] **Step 5: Push with `git push origin feat/server_team`.**

- [ ] **Step 6: Report dependency decision, changed files, commit hashes, static gate results, route/viewport coverage, visual-fidelity limitations, preserved user changes, and pushed remote/branch.**
