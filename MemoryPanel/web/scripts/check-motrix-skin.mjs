import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const skinPath = 'src/styles/motrix-skin.css';
const tokensPath = 'src/styles/motrix-tokens.css';

const contracts = {
  tokens: {
    cssPath: tokensPath,
    comments: ['Layer 1: primitives', 'Layer 2: semantics', 'Layer 3: components'],
    declarations: [
      { selector: ':root', property: '--mx-neutral-000' },
      { selector: ':root', property: '--mx-shell-gradient' },
      { selector: ':root', property: '--mx-sidebar-width', value: '200px' },
      { selector: ':root', property: '--mx-sidebar-width-collapsed', value: '48px' },
      { selector: ':root', property: '--mx-tile-radius' },
      { selector: ':root', property: '--mx-dialog-radius' },
      { selector: ':root', property: '--background', value: 'var(--mx-surface-card)' },
      {
        selector: ':root',
        property: '--tea-color-bg-brand-default',
        value: 'var(--mx-action-primary)',
      },
      { selector: ':root', property: '--mx-text-secondary', value: 'var(--mx-neutral-731)' },
      { selector: ':root', property: '--mx-font-label', value: '10px' },
    ],
    crossFileForbiddenProperties: [{ cssPath: skinPath, property: '--mx-text-secondary' }],
  },
  shell: {
    cssPath: skinPath,
    selectors: [
      '._memory-app-shell',
      '._memory-global-header',
      '._memory-app-shell .tea-menu-is-collapsed.tea-menu--light',
      '._memory-app-shell .tea-layout__content',
      '._memory-tabbar-item--active',
    ],
    declarations: [
      {
        selector:
          '._memory-app-shell .tea-menu--light .tea-menu__list > li:not(.tea-menu__label).is-selected > .tea-menu__item .tea-menu__text',
        property: 'font-weight',
        value: '600',
        important: false,
      },
      ...['font-size', 'font-weight', 'letter-spacing', 'text-transform'].map((property) => ({
        selector:
          '._memory-app-shell .tea-menu--light .tea-menu__list > li.tea-menu__label .tea-menu__text',
        property,
        value: {
          'font-size': 'var(--mx-font-label)',
          'font-weight': '600',
          'letter-spacing': '0.04em',
          'text-transform': 'uppercase',
        }[property],
        important: false,
      })),
    ],
  },
  primitives: {
    cssPath: skinPath,
    selectors: [
      '.tea-btn',
      '.tea-input',
      '.tea-table',
      '.tea-dialog',
      '.tea-drawer',
      '.tea-segment',
      '.tea-tabs__tab',
    ],
    declarations: [
      {
        selector: '.tea-dialog__inner',
        property: 'min-width',
        value: '0',
        important: false,
      },
      {
        selector: '.tea-dialog__inner',
        property: 'max-width',
        value: 'calc(100vw - var(--mx-space-8))',
        important: false,
      },
      {
        selector: '.tea-dialog__inner:not(.size-s):not(.size-l):not(.size-xl):not(.size-auto)',
        property: 'width',
        value: 'min(var(--mx-dialog-max-width), calc(100vw - var(--mx-space-8)))',
        important: false,
      },
      {
        selector: '.tea-dialog__inner:not(.size-s):not(.size-l):not(.size-xl):not(.size-auto)',
        property: 'max-width',
        value: 'var(--mx-dialog-max-width)',
        important: false,
      },
      {
        selector: '.tea-drawer',
        property: 'max-width',
        value: '100vw',
        important: false,
      },
    ],
  },
  workbench: {
    cssPath: skinPath,
    selectors: [
      '._memory-workbench-task-card',
      '._memory-workbench-task-grid',
      '._memory-workbench-skeleton-card',
      '._memory-workbench-empty-card',
    ],
    declarations: [
      ...[
        '._memory-workbench-people-label.tea-text-weak',
        '._memory-workbench-people-row > .tea-text-weak',
        '._memory-workbench-block-label.tea-text-label',
        '._memory-workbench-footer.tea-text-weak',
        '._memory-workbench-empty-desc.tea-text-weak',
        '._memory-workbench-list-empty .tea-text-weak',
      ].map((selector) => ({
        selector,
        property: 'color',
        value: 'var(--mx-text-secondary)',
        important: true,
      })),
    ],
  },
  resources: {
    cssPath: skinPath,
    selectors: [
      '._asset-page-header',
      '._asset-split',
      '._alp-item',
      '._asset-wiki-card',
      '._codelist-card',
      '._memory-skills-split',
      '._memory-detail-panel',
    ],
    declarations: [
      ...[
        '._asset-wiki-content-card',
        '._asset-code-content-card',
        '._wiki-detail-root > .tea-card',
        '._wiki-detail-ingest-card',
        '._wiki-detail-content-card',
        '._codedetail-root > .tea-card',
        '._memory-admin-lock-card',
      ].map((selector) => ({
        selector,
        property: 'border-radius',
        value: 'var(--mx-card-radius)',
        important: true,
      })),
      {
        selector: '._memory-skill-detail-card',
        property: 'border-radius',
        value: '0',
        important: false,
      },
      {
        selector: '._memory-detail-panel',
        property: 'border-radius',
        value: '0',
        important: false,
      },
    ],
    forbiddenDeclarations: [
      { selector: '._memory-skill-detail-card', property: 'border-radius', important: true },
      { selector: '._memory-detail-panel', property: 'border-radius', important: true },
    ],
  },
  team: {
    cssPath: skinPath,
    selectors: [
      '._memory-panel-card',
      '._memory-agent-card',
      '._memory-member-card',
      '._memory-apikey-body',
      '._memory-settings-module',
    ],
    declarations: [
      ...['._memory-profile-section .tea-card', '._memory-apikey-body > .tea-card'].map(
        (selector) => ({
          selector,
          property: 'border-radius',
          value: 'var(--mx-card-radius)',
          important: true,
        }),
      ),
    ],
  },
  responsive: {
    cssPath: skinPath,
    atRules: [
      { name: 'media', params: '(max-width: 960px)' },
      { name: 'media', params: '(max-width: 767px)' },
      { name: 'media', params: '(max-width: 720px)' },
      { name: 'media', params: '(prefers-reduced-motion: reduce)' },
    ],
  },
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

const webRoot = new URL('../', import.meta.url);
const read = (relativePath) => readFileSync(new URL(relativePath, webRoot), 'utf8');
const roots = new Map();
const parse = (relativePath) => {
  if (!roots.has(relativePath)) {
    roots.set(relativePath, postcss.parse(read(relativePath), { from: relativePath }));
  }
  return roots.get(relativePath);
};
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const ruleSelectors = (rule) => postcss.list.comma(rule.selector).map(normalize);
const matchingRules = (root, selector) => {
  const normalizedSelector = normalize(selector);
  const matches = [];
  root.walkRules((rule) => {
    if (ruleSelectors(rule).includes(normalizedSelector)) matches.push(rule);
  });
  return matches;
};

const formatDeclaration = ({ selector, property, value, important }) => {
  const valuePart = value === undefined ? '' : `: ${value}`;
  const importantPart =
    important === undefined ? '' : important ? ' !important' : ' (not important)';
  return `${selector} { ${property}${valuePart}${importantPart} }`;
};

const declarationMatches = (root, contract) =>
  matchingRules(root, contract.selector).some((rule) =>
    rule.nodes?.some(
      (node) =>
        node.type === 'decl' &&
        node.prop === contract.property &&
        (contract.value === undefined || normalize(node.value) === normalize(contract.value)) &&
        (contract.important === undefined || Boolean(node.important) === contract.important),
    ),
  );

const validateGlobalContracts = () => {
  const main = read('src/main.tsx');
  const imports = [
    "import './tea-override.css';",
    "import './styles/motrix-tokens.css';",
    "import './styles/motrix-skin.css';",
  ];

  let previousIndex = -1;
  for (const statement of imports) {
    const index = main.indexOf(statement);
    if (index === -1) throw new Error(`Missing required main.tsx import: ${statement}`);
    if (index <= previousIndex) {
      throw new Error(`Motrix stylesheet imports are out of order at: ${statement}`);
    }
    previousIndex = index;
  }

  const packageJson = JSON.parse(read('package.json'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  for (const dependency of disallowedDependencies) {
    if (Object.hasOwn(dependencies, dependency)) {
      throw new Error(`Disallowed Motrix skin dependency found: ${dependency}`);
    }
  }
  if (packageJson.devDependencies?.postcss === undefined) {
    throw new Error('Missing direct dev dependency required by Motrix checker: postcss');
  }
};

const validateSuite = (suiteName) => {
  const contract = contracts[suiteName];
  const root = parse(contract.cssPath);
  const failures = [];

  const comments = [];
  root.walkComments((comment) => comments.push(normalize(comment.text)));
  for (const expected of contract.comments ?? []) {
    if (!comments.includes(expected)) failures.push(`missing parsed comment: ${expected}`);
  }

  for (const selector of contract.selectors ?? []) {
    if (matchingRules(root, selector).length === 0) {
      failures.push(`missing CSS rule selector: ${selector}`);
    }
  }

  for (const expected of contract.atRules ?? []) {
    let found = false;
    root.walkAtRules(expected.name, (atRule) => {
      if (normalize(atRule.params) === normalize(expected.params)) found = true;
    });
    if (!found) failures.push(`missing @${expected.name} ${expected.params}`);
  }

  for (const declaration of contract.declarations ?? []) {
    if (!declarationMatches(root, declaration)) {
      failures.push(`missing declaration: ${formatDeclaration(declaration)}`);
    }
  }

  for (const declaration of contract.forbiddenDeclarations ?? []) {
    if (declarationMatches(root, declaration)) {
      failures.push(`forbidden declaration: ${formatDeclaration(declaration)}`);
    }
  }

  for (const forbidden of contract.crossFileForbiddenProperties ?? []) {
    let found = false;
    parse(forbidden.cssPath).walkDecls(forbidden.property, () => {
      found = true;
    });
    if (found) {
      failures.push(`forbidden property in ${forbidden.cssPath}: ${forbidden.property}`);
    }
  }

  return failures;
};

const requestedSuite = process.argv[2];
if (requestedSuite !== undefined && !Object.hasOwn(contracts, requestedSuite)) {
  throw new Error(
    `Usage: node scripts/check-motrix-skin.mjs [${Object.keys(contracts).join('|')}]`,
  );
}

validateGlobalContracts();
const suitesToRun = requestedSuite ? [requestedSuite] : Object.keys(contracts);
const failures = [];
for (const suiteName of suitesToRun) {
  const suiteFailures = validateSuite(suiteName);
  if (suiteFailures.length === 0) {
    console.log(`Motrix skin ${suiteName} contract passed.`);
  } else {
    failures.push(...suiteFailures.map((failure) => `[${suiteName}] ${failure}`));
  }
}

if (failures.length > 0) {
  console.error(`Motrix skin contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else if (!requestedSuite) {
  console.log(`Motrix skin all-suite contract passed (${suitesToRun.length} suites).`);
}
