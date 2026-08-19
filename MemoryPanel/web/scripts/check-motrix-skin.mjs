import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const required = {
  tokens: [
    '/* Layer 1: primitives */',
    '/* Layer 2: semantics */',
    '/* Layer 3: components */',
    '--mx-neutral-000:',
    '--mx-shell-gradient:',
    '--mx-sidebar-width: 200px;',
    '--mx-sidebar-width-collapsed: 48px;',
    '--mx-tile-radius:',
    '--mx-dialog-radius:',
    '--background: var(--mx-surface-card);',
    '--tea-color-bg-brand-default: var(--mx-action-primary);',
  ],
  shell: [
    '._memory-app-shell',
    '._memory-global-header',
    '.tea-menu-is-collapsed.tea-menu--light',
    '.tea-layout__content',
    '._memory-tabbar-item--active',
  ],
  primitives: [
    '.tea-btn',
    '.tea-input',
    '.tea-table',
    '.tea-dialog',
    '.tea-drawer',
    '.tea-segment',
    '.tea-tabs',
  ],
  workbench: [
    '._memory-workbench-task-card',
    '._memory-workbench-task-grid',
    '._memory-workbench-skeleton-card',
    '._memory-workbench-empty-card',
  ],
  resources: [
    '._asset-page-header',
    '._asset-split',
    '._alp-item',
    '._asset-wiki-card',
    '._codelist-card',
    '._memory-skills-split',
    '._memory-detail-panel',
  ],
  team: [
    '._memory-panel-card',
    '._memory-agent-card',
    '._memory-member-card',
    '._memory-apikey-body',
    '._memory-settings-module',
  ],
  responsive: [
    '@media (max-width: 960px)',
    '@media (max-width: 767px)',
    '@media (max-width: 720px)',
    '@media (prefers-reduced-motion: reduce)',
  ],
};

const disallowedDependencies = [
  '@base-ui/react',
  '@fontsource-variable/inter',
  '@tailwindcss/vite',
  'class-variance-authority',
  'clsx',
  'cmdk',
  'next-themes',
  'recharts',
  'shadcn',
  'tailwind-merge',
  'tw-animate-css',
  'vaul',
];

const suite = process.argv[2];
if (!Object.hasOwn(required, suite)) {
  throw new Error(`Usage: node scripts/check-motrix-skin.mjs <${Object.keys(required).join('|')}>`);
}

const webRoot = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => readFileSync(new URL(relativePath, `file://${webRoot}`), 'utf8');
const main = read('src/main.tsx');
const imports = [
  "import './tea-override.css';",
  "import './styles/motrix-tokens.css';",
  "import './styles/motrix-skin.css';",
];

let previousIndex = -1;
for (const statement of imports) {
  const index = main.indexOf(statement);
  if (index === -1) {
    throw new Error(`Missing required main.tsx import: ${statement}`);
  }
  if (index <= previousIndex) {
    throw new Error(`Motrix stylesheet imports are out of order at: ${statement}`);
  }
  previousIndex = index;
}

const packageJson = JSON.parse(read('package.json'));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
for (const dependency of disallowedDependencies) {
  if (Object.hasOwn(dependencies, dependency)) {
    throw new Error(`Disallowed Motrix skin dependency found: ${dependency}`);
  }
}

const cssPath = suite === 'tokens' ? 'src/styles/motrix-tokens.css' : 'src/styles/motrix-skin.css';
const css = read(cssPath);
for (const selector of required[suite]) {
  if (!css.includes(selector)) {
    throw new Error(`Missing ${suite} contract string in ${cssPath}: ${selector}`);
  }
}

console.log(`Motrix skin ${suite} contract passed.`);
