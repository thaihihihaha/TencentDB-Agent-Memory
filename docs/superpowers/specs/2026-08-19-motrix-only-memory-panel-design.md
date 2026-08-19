# Motrix-only MemoryPanel UI Design

**Ngày:** 2026-08-19

**Trạng thái:** Đã được người dùng duyệt ở mức định hướng

**Phạm vi:** `MemoryPanel/web`

**Visual source of truth:** `/home/coder/workspace/projects/Motrix`

## 1. Mục tiêu

Re-skin toàn bộ MemoryPanel theo visual language của Motrix với độ tương đồng cao nhất có thể, đồng thời giữ nguyên information architecture và toàn bộ behavior hiện có của TencentDB Agent Memory.

Nguyên tắc ngắn gọn:

> 100% visual Motrix, 0% logic Motrix.

"100%" trong tài liệu này nghĩa là đồng nhất token, typography, spacing, radius, surface, hierarchy, state và motion với Motrix. Nó không có nghĩa sao chép nguyên pixel geometry của ảnh Motrix, vì MemoryPanel bắt buộc giữ GlobalHeader, TeamSwitcher, closable tabs, ACL menu, split resizer, right Drawer và tám route hiện có.

## 2. Nguồn nghiên cứu

### Motrix

- `src/renderer/styles/globals.css`
- `src/renderer/layouts/app-layout.tsx`
- `src/renderer/components/ui/sidebar.tsx`
- `src/renderer/components/desktop-kit/sidebar/app-sidebar.tsx`
- `src/renderer/components/desktop-kit/panel/panel-shell.tsx`
- `src/renderer/routes/dashboard/**`
- `src/renderer/routes/downloads/**`
- `src/renderer/routes/settings/**`
- `src/renderer/components/ui/{button,card,dialog,input,tabs}.tsx`
- `screenshots/motrix-{dashboard,downloads,settings}{-dark}.webp`

Ảnh tham chiếu Motrix có kích thước 1828×1344 ở DPR 2, tương ứng viewport CSS 914×672.

### MemoryPanel

- `MemoryPanel/web/src/layouts/ConsoleLayout.tsx`
- `MemoryPanel/web/src/layouts/GlobalHeader/**`
- `MemoryPanel/web/src/layouts/TabBar/**`
- `MemoryPanel/web/src/index.css`
- `MemoryPanel/web/src/tea-override.css`
- Toàn bộ CSS của Workbench, Resource, Wiki, Code, Skills, Memory, Team và API Keys.

### Research helpers

- `ui-ux-pro-max`: dùng để kiểm tra accessibility, responsive, focus, motion, data-density và anti-pattern.
- `design-system`: dùng kiến trúc token ba lớp primitive → semantic → component.
- Claude đã đọc trực tiếp các file Motrix cốt lõi ở chế độ read-only để trích xuất token và geometry.

Kết quả generic của `ui-ux-pro-max` về màu xanh/Fira không được dùng, vì Motrix là rendered source of truth. Chỉ các nguyên tắc chất lượng như contrast, keyboard focus, reduced motion và responsive được giữ lại.

## 3. Ràng buộc bất biến

Không được thay đổi:

1. React Router hash routing và tám route `/`, `/wiki`, `/code`, `/skills`, `/memory`, `/team/members`, `/team/agents`, `/team/api-keys`.
2. Auth tri-state, session/localStorage, API headers và 401 handling.
3. Zustand stores, cache, polling, pagination, race guards và API wrapper.
4. ACL/role filtering, owner-only actions và mọi điều kiện permission.
5. `openPages`, đóng tab, keyboard handling và legacy hash migration.
6. TeamSwitcher, language, profile, settings, logout và onboarding replay.
7. Tất cả `data-guide`, onboarding selectors, mask, z-index và body state classes.
8. `AssetSplitLayout`: inline `gridTemplateColumns`, giới hạn 220–480px, drag/keyboard resizer và persistence.
9. Tea Modal/Drawer/Select/Table behavior, focus management, portals và confirmation flows.
10. Sigma/Graphology knowledge graph và mọi graph interaction.
11. Viewport height chain và `.tea-layout__content-body` là page scroller duy nhất.
12. Tất cả i18n keys và các file thay đổi sẵn của người dùng.

Production TSX chỉ được sửa khi cần thêm một class hook thuần trình bày. Không đổi props, handlers, refs, conditionals, ARIA hoặc component contracts.

## 4. Quyết định dependency

### Kết luận

Không cài thêm runtime hay dev dependency cho redesign này.

### Không mang từ Motrix sang

| Package | Quyết định | Lý do |
|---|---|---|
| `@base-ui/react`, `shadcn` | Không cài | Tea tiếp tục là behavior layer. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Không cài | CSS scoped selectors không cần class composer. |
| Tailwind 4, `@tailwindcss/vite` | Không nâng cấp | Target đang dùng Tailwind 3; cú pháp `@theme`/`@custom-variant` không tương thích. |
| `tw-animate-css` | Không cài | Motion cần thiết viết bằng CSS thuần. |
| `next-themes` | Không cài | Sẽ thêm state/persistence mới ngoài phạm vi. |
| `recharts`, `@xyflow/react`, `@tanstack/react-virtual` | Không cài | Không bổ sung chart/graph/list behavior Motrix. |
| `cmdk`, `vaul` | Không cài | Sẽ thay behavior dialog/drawer hiện tại. |
| `lucide-react` mới | Không nâng | Target đã có Lucide; giữ version React 18 hiện tại. |
| `@fontsource-variable/inter` | Không cài | Motrix `body` thực tế dùng system stack; font package làm tăng build không cần thiết. |
| `electron-liquid-glass` | Không cài | Native Electron/macOS only, không chạy trên web. |

Frontend tiếp tục dùng npm và lockfile `MemoryPanel/web/package-lock.json`. Không tạo hoặc commit `MemoryPanel/web/pnpm-lock.yaml`.

## 5. Kiến trúc triển khai

Thêm hai stylesheet, import sau `tea-override.css`:

```text
MemoryPanel/web/src/
├── styles/
│   ├── motrix-tokens.css   # primitive → semantic → component
│   └── motrix-skin.css     # shell, Tea primitives, pages, responsive
└── main.tsx                # import hai stylesheet cuối cùng
```

`motrix-tokens.css` là nguồn duy nhất cho màu, spacing, radius, typography, shadow, motion và component metrics. `motrix-skin.css` không được chứa raw color/geometry tùy ý nếu đã có token phù hợp.

CSS được áp lên DOM Tea hiện có. Không sao chép component tree, router hoặc state từ Motrix.

## 6. Token system ba lớp

### 6.1 Primitive tokens

```css
:root {
  /* Neutral palette extracted from Motrix */
  --mx-neutral-000: oklch(1 0 0);
  --mx-neutral-015: oklch(0.985 0 0);
  --mx-neutral-030: oklch(0.97 0 0);
  --mx-neutral-050: oklch(0.95 0 0);
  --mx-neutral-078: oklch(0.922 0 0);
  --mx-neutral-292: oklch(0.708 0 0);
  --mx-neutral-444: oklch(0.556 0 0);
  --mx-neutral-731: oklch(0.269 0 0);
  --mx-neutral-795: oklch(0.205 0 0);
  --mx-neutral-855: oklch(0.145 0 0);

  --mx-alpha-black-04: oklch(0 0 0 / 0.04);
  --mx-alpha-black-06: oklch(0 0 0 / 0.06);
  --mx-alpha-black-07: oklch(0 0 0 / 0.07);
  --mx-alpha-black-10: oklch(0 0 0 / 0.1);
  --mx-alpha-black-20: oklch(0 0 0 / 0.2);
  --mx-alpha-white-55: oklch(1 0 0 / 0.55);
  --mx-alpha-white-88: oklch(1 0 0 / 0.88);

  --mx-data-cyan: hsl(193 83% 50%);
  --mx-data-cyan-fill: #e6f8fc;
  --mx-data-violet: hsl(243 96% 66%);
  --mx-data-violet-fill: #f1f0ff;
  --mx-destructive: oklch(0.577 0.245 27.325);

  /* CSS replacement for native macOS Liquid Glass seen in Motrix shots */
  --mx-glass-blue-1: #e8f8ff;
  --mx-glass-blue-2: #d8f2ff;
  --mx-glass-blue-3: #d8ecfe;
  --mx-glass-violet: #ece9ff;

  --mx-space-0-5: 2px;
  --mx-space-1: 4px;
  --mx-space-2: 8px;
  --mx-space-2-5: 10px;
  --mx-space-3: 12px;
  --mx-space-4: 16px;
  --mx-space-6: 24px;
  --mx-space-8: 32px;
  --mx-space-10: 40px;

  --mx-radius-sm: 6px;
  --mx-radius-md: 8px;
  --mx-radius-lg: 10px;
  --mx-radius-xl: 14px;
  --mx-radius-tile: 18px;
  --mx-radius-full: 9999px;

  --mx-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    sans-serif;
  --mx-font-label: 10px;
  --mx-font-meta: 12px;
  --mx-font-body: 14px;
  --mx-font-title: 24px;
  --mx-font-kpi: 32px;

  --mx-shadow-xs: 0 1px 2px oklch(0 0 0 / 0.05);
  --mx-shadow-sm: 0 1px 2px oklch(0 0 0 / 0.07),
    0 8px 24px oklch(0 0 0 / 0.035);
  --mx-shadow-dialog: 0 24px 64px oklch(0 0 0 / 0.18);

  --mx-duration-fast: 150ms;
  --mx-duration-normal: 200ms;
  --mx-duration-drawer: 300ms;
  --mx-ease-standard: ease-in-out;
  --mx-ease-out: cubic-bezier(0.32, 0.72, 0, 1);
}
```

Raw hex chỉ được dùng ở primitive layer, chủ yếu cho gradient thay Liquid Glass và chart fill lấy trực tiếp từ Motrix.

### 6.2 Semantic tokens

```css
:root {
  --mx-surface-app: var(--mx-neutral-015);
  --mx-surface-content: var(--mx-alpha-white-88);
  --mx-surface-card: var(--mx-neutral-000);
  --mx-surface-subtle: var(--mx-neutral-030);
  --mx-surface-selected: var(--mx-alpha-black-06);

  --mx-text-primary: var(--mx-neutral-855);
  --mx-text-secondary: var(--mx-neutral-444);
  --mx-text-on-primary: var(--mx-neutral-015);

  --mx-action-primary: var(--mx-neutral-795);
  --mx-action-primary-hover: var(--mx-neutral-731);
  --mx-action-primary-active: var(--mx-neutral-855);
  --mx-action-focus: var(--mx-neutral-292);

  --mx-border-default: var(--mx-neutral-078);
  --mx-border-subtle: var(--mx-alpha-black-07);
  --mx-overlay: var(--mx-alpha-black-20);

  --mx-shell-gradient:
    radial-gradient(circle at 84% 0%, var(--mx-glass-violet) 0, transparent 38%),
    linear-gradient(
      135deg,
      var(--mx-glass-blue-1) 0%,
      var(--mx-glass-blue-2) 48%,
      var(--mx-glass-blue-3) 100%
    );
}
```

### 6.3 Component tokens

```css
:root {
  --mx-sidebar-width: 200px;
  --mx-sidebar-width-collapsed: 48px;
  --mx-sidebar-row-height: 38px;
  --mx-sidebar-row-radius: var(--mx-radius-md);

  --mx-header-height: 48px;
  --mx-tabbar-height: 36px;
  --mx-content-inset: var(--mx-space-2);
  --mx-content-radius: var(--mx-radius-xl);

  --mx-button-height: 36px;
  --mx-button-height-sm: 32px;
  --mx-button-radius: var(--mx-radius-md);
  --mx-input-height: 36px;
  --mx-input-radius: var(--mx-radius-md);

  --mx-card-radius: var(--mx-radius-xl);
  --mx-card-padding: var(--mx-space-6);
  --mx-tile-radius: var(--mx-radius-tile);
  --mx-tile-padding: var(--mx-space-4);

  --mx-table-header-height: 40px;
  --mx-table-row-height: 48px;
  --mx-table-cell-padding: var(--mx-space-2);

  --mx-dialog-radius: var(--mx-radius-xl);
  --mx-dialog-padding: var(--mx-space-6);
  --mx-dialog-max-width: 448px;
}
```

Các alias hiện hữu `--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--ring` và các Tea neutral/brand tokens được map về semantic layer ở `:root` để portal của Tea cũng nhận đúng theme.

## 7. Component specification

### 7.1 App shell

- GlobalHeader giữ chiều cao 48px nhưng nền trong suốt/kính trên `--mx-shell-gradient`.
- Layout body dùng cùng gradient với header để tạo một canvas liên tục.
- Sidebar expanded 200px, collapsed 48px.
- Content surface inset 8px, radius 14px, white 88%, shadow nhỏ.
- `.tea-layout__content-body` vẫn là scroller duy nhất.
- Không port traffic lights, drag region, safe-area Electron hoặc native vibrancy.

### 7.2 Sidebar

- Row 38px, padding ngang 10px, gap 8px, radius 8px.
- Icon 16px, label 14px.
- Hover/selected: nền black 6%, không dùng blue solid.
- Selected text semibold; icon/text giữ foreground tối.
- Group label 10px uppercase, muted, tracking rộng nhẹ.
- Transition 150ms cho màu, 200ms cho collapse geometry hiện có.
- Giữ menu groups, role filtering, collapse state và Tea tooltip behavior.

### 7.3 Header và tab strip

- Header controls là ghost controls, radius 8px, hover black 6%.
- Brand logo TencentDB giữ nguyên; không dùng logo Motrix.
- TeamSwitcher, language và profile giữ nguyên behavior.
- Tab list cao 36px, padding 3px, radius 10px.
- Active tab là white/subtle surface với shadow-xs, không dùng underline xanh.
- Close button giữ keyboard/click propagation hiện có.

### 7.4 Buttons, inputs và selects

- Primary button: black neutral, white text, cao 36px, radius 8px.
- Secondary/outline: white hoặc transparent, border neutral.
- Small controls 32px; icon-only vẫn giữ hit area hiện tại trên desktop.
- Input/select/search cao 36px, padding ngang 12px, radius 8px.
- Focus-visible: border focus + ring ngoài 3px ở 50% opacity.
- Disabled opacity 0.5, không đổi semantic `disabled`/`aria-disabled`.
- Bỏ global `active: scale(.97)`; Motrix không dùng global press scaling.

### 7.5 Cards và dashboard treatment

- Standard card radius 14px; dashboard/task tile radius 18px.
- Tile padding/gap 16px.
- Tile background:

```css
linear-gradient(
  180deg,
  oklch(1 0 0 / 0.98),
  oklch(1 0 0 / 0.93)
)
```

- Border black 7%, shadow tối thiểu.
- Không dùng translateY hover cho card; chỉ đổi border/surface/shadow nhẹ.
- Workbench giữ layout/task state hiện có, không port dashboard drag/resize/preset.

### 7.6 Tables và lists

- Header cao 36–40px, label 10–11px, semibold/uppercase khi phù hợp.
- Row cao 48px, cell padding 8px.
- Hover dùng neutral surface nhẹ.
- Selected dùng accent surface nhưng luôn có icon/text/selection semantics, không chỉ dựa vào màu.
- ID, timestamp và data columns dùng tabular numerals/mono token hiện có.
- Không thay pagination, selection hoặc sorting behavior.

### 7.7 Dialogs và drawers

- Overlay black 20%.
- Dialog radius 14px, padding/gap 24px, shadow-dialog.
- Standard dialog max-width 448px; giữ width override riêng của các form lớn.
- Dialog open/close fade + scale từ 0.95 trong khoảng 100–150ms.
- Drawer slide 300ms với `cubic-bezier(.32,.72,0,1)`.
- Giữ Tea portal, Escape, focus trap, return-focus và confirmation flows.

### 7.8 Knowledge graph

- Giữ Sigma/Graphology.
- Canvas radius 8–14px, border nhẹ, toolbar theo Motrix list header.
- Node/legend/control chỉ thay surface, border, typography và focus treatment.
- Không port React Flow hoặc graph logic Motrix.

## 8. Page mapping

| MemoryPanel | Motrix reference | Treatment |
|---|---|---|
| Workbench | Dashboard | 18px tiles, 16px gap/padding, large page title, flat-gradient depth. |
| Wiki, Code | Downloads + graph tooling | Inset list/detail surface, 48px rows, sticky toolbar, neutral selected state. |
| Skills, Memory | Downloads/Plugins | Dense list/detail, clear metadata hierarchy, same controls. |
| Agents | Plugins cards | 14px cards, avatar/icon alignment, 14px titles, 12px metadata. |
| Members, API Keys | Downloads/Tracker tables | 40px header, 48px rows, tabular data. |
| Settings/Profile | Motrix dialogs/settings rows | Same modal surface and row rhythm; no new route/grid. |

## 9. Responsive behavior

Giữ breakpoint behavior hiện có; chỉ thay visual:

- `≤960px`: split layout stack như hiện tại.
- `≤767px`: desktop density được nới; interactive controls tối thiểu 44px và font input 16px để tránh mobile zoom.
- `≤720px`: page header/filter/actions wrap, không horizontal page overflow.
- `≥1280px`: team grids giữ số cột hiện có.
- Dashboard-like card grids có thể chuyển một cột dưới 560px bằng CSS, nhưng không thêm Motrix configure behavior.
- Không port Motrix mobile Sheet/sidebar state vì sẽ đổi component structure.

Các viewport bắt buộc kiểm tra: 1828×1344 reference raster, 1440×900, 1280×800 và 375×812.

## 10. Accessibility và motion

- Text thường đạt contrast tối thiểu 4.5:1; UI boundary/focus đạt 3:1.
- Không xóa focus ring nếu không thay bằng focus-visible rõ ràng.
- Không làm mất keyboard path hiện tại.
- Icon-only controls giữ accessible name hiện có.
- Loading, error, disabled và destructive states giữ semantic + text/icon hiện có.
- Color/background/shadow transition 150–200ms.
- Drawer tối đa 300ms.
- Chỉ animate opacity/transform khi có thể; không thêm animation trang trí liên tục.
- Giữ `prefers-reduced-motion` global escape hatch.
- On mobile, touch target tối thiểu 44px dù Motrix desktop dùng 32–38px.

## 11. License và asset policy

- Motrix source là MIT, copyright 2018-present Dr_rOot.
- Nếu port substantial CSS, thêm notice tương ứng vào fork.
- Không copy `src/renderer/routes/settings/icons/*.png`: đây là Iconly Pro/UI8 proprietary, không thuộc MIT.
- Không copy logo/app icon Motrix hoặc font SFNS của Apple.
- Dùng logo TencentDB hiện tại, Tea icons hiện tại và Lucide đã có trong target.
- Gradient Liquid Glass được tái tạo bằng CSS primitive của fork, không copy native Electron module.

## 12. Verification strategy

### Static gates

```bash
cd MemoryPanel/web
npm exec tsc -- --noEmit --pretty false
npm run lint:check
npm run build
```

Baseline trước redesign:

- TypeScript: pass.
- ESLint: pass với 99 warnings có sẵn, 0 errors.
- Build: pass; có warnings chunk size/dynamic import có sẵn.
- `format:check` toàn repo fail trên 90 file có sẵn nên chỉ format/check file do redesign chạm tới.

### Browser gates

Không thêm Playwright vào repo. Dùng ephemeral Playwright Docker `v1.62.1-noble` và lưu auth/storage/screenshot ở `/tmp` với quyền hạn chế.

Route mapping để so sánh:

- `/` ↔ `motrix-dashboard.webp`
- Wiki/Code/Skills/Memory ↔ `motrix-downloads.webp`
- Members/Agents/API Keys/forms ↔ `motrix-settings.webp`

So sánh side-by-side và overlay 50% cho các vùng tương ứng: shell gradient, sidebar, content inset, header, cards, rows, form controls và dialog. Không dùng full-page pixel score vì dữ liệu và information architecture khác nhau.

Smoke test đủ tám route, sidebar collapse, TeamSwitcher, tab open/close, modal/drawer, split resizer, onboarding anchors, hover/focus/disabled, console errors và reduced-motion.

`npm run mock` không phải verification path vì `VITE_ENTRY=mock` hiện không được Vite đọc.

## 13. Acceptance criteria

1. Không có dependency mới trong `package.json`/`package-lock.json`.
2. App shell, sidebar, content surface, page hierarchy, controls, tables, cards và dialogs nhìn cùng một hệ Motrix.
3. Token CSS tuân thủ ba lớp; page/component CSS không rải raw color khi đã có token.
4. Không thay đổi route, API, state, ACL, handler, i18n contract hoặc storage key.
5. Tất cả `data-guide` và split-resizer behavior còn nguyên.
6. TypeScript, ESLint và production build pass với không có lỗi mới.
7. Tám route và interaction chính smoke-pass trong browser.
8. Screenshots ở 1828×1344, 1440×900, 1280×800 và 375×812 được review; các vùng có counterpart trực tiếp bám Motrix.
9. Reduced-motion và keyboard focus hoạt động.
10. Không copy asset proprietary của Motrix.

## 14. Ngoài phạm vi

- Dark-mode toggle/state mới.
- Motrix dashboard configure, drag, resize hoặc preset.
- Motrix Electron chrome, native vibrancy, traffic lights và IPC.
- Motrix React Router/state/services.
- Thay Tea bằng shadcn/Base UI.
- Thay Sigma bằng React Flow.
- Sửa warning/performance/backend test có sẵn không liên quan redesign.
