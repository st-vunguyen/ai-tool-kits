#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
const args = {
dryRun: false,
force: false,
help: false,
slug: '',
spec: '',
target: '',
};

for (let index = 0; index < argv.length; index += 1) {
const token = argv[index];
if (token === '--dry-run') args.dryRun = true;
else if (token === '--force') args.force = true;
else if (token === '--help' || token === '-h') args.help = true;
else if (token === '--target') args.target = argv[index + 1] || '';
else if (token.startsWith('--target=')) args.target = token.split('=')[1] || '';
else if (token === '--slug') args.slug = argv[index + 1] || '';
else if (token.startsWith('--slug=')) args.slug = token.split('=')[1] || '';
else if (token === '--spec') args.spec = argv[index + 1] || '';
else if (token.startsWith('--spec=')) args.spec = token.split('=')[1] || '';

if (['--target', '--slug', '--spec'].includes(token)) index += 1;
}

return args;
}

function printHelp() {
console.log(`Prepare a local API Testing result workspace.

Usage:
pnpm run apply -- --slug my-api [--spec specs/my-api/openapi.yaml] [--target /abs/path] [--dry-run] [--force]

Shortcut for preview mode:
pnpm run apply:dry-run -- --slug my-api [--spec specs/my-api/openapi.yaml] [--target /abs/path] [--force]

Compatibility alias:
pnpm run apply:compat -- --slug my-api [--spec specs/my-api/openapi.yaml] [--target /abs/path] [--dry-run] [--force]

Default target: current repo root
Default output: result/<slug>/
`);
}

function ensureDir(dirPath, dryRun) {
if (dryRun) return;
fs.mkdirSync(dirPath, { recursive: true });
}

function ensureParentDir(filePath, dryRun) {
ensureDir(path.dirname(filePath), dryRun);
}

function copyFileSafe(sourcePath, targetPath, options) {
const { actions, dryRun, force, targetRoot } = options;
const exists = fs.existsSync(targetPath);
if (exists && !force) {
actions.push(`skip  ${path.relative(targetRoot, targetPath)} (exists)`);
return;
}

actions.push(`${exists ? 'write ' : 'copy  '} ${path.relative(targetRoot, targetPath)}`);
if (dryRun) return;
ensureParentDir(targetPath, dryRun);
fs.copyFileSync(sourcePath, targetPath);
}

function copyDirRecursive(sourceDir, targetDir, options) {
ensureDir(targetDir, options.dryRun);
for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
if (entry.name === '.DS_Store') continue;
const sourcePath = path.join(sourceDir, entry.name);
const targetPath = path.join(targetDir, entry.name);
if (entry.isDirectory()) copyDirRecursive(sourcePath, targetPath, options);
else copyFileSafe(sourcePath, targetPath, options);
}
}

function writeTextFile(targetPath, body, options) {
const { actions, dryRun, force, targetRoot } = options;
const exists = fs.existsSync(targetPath);
if (exists && !force) {
actions.push(`skip  ${path.relative(targetRoot, targetPath)} (exists)`);
return;
}

actions.push(`${exists ? 'write ' : 'create '} ${path.relative(targetRoot, targetPath)}`);
if (dryRun) return;
ensureParentDir(targetPath, dryRun);
fs.writeFileSync(targetPath, body, 'utf8');
}

function resolveSpecPath(targetRoot, slug, explicitSpec) {
if (explicitSpec) {
const direct = path.resolve(targetRoot, explicitSpec);
if (fs.existsSync(direct)) return direct;
throw new Error(`Spec file not found: ${direct}`);
}

const specDir = path.join(targetRoot, 'specs', slug);
const candidates = [
path.join(specDir, 'openapi.yaml'),
path.join(specDir, 'openapi.yml'),
path.join(specDir, 'openapi.json'),
path.join(specDir, 'swagger.yaml'),
path.join(specDir, 'swagger.yml'),
path.join(specDir, 'swagger.json'),
];

for (const candidate of candidates) {
if (fs.existsSync(candidate)) return candidate;
}

if (fs.existsSync(specDir)) {
const firstMatch = fs.readdirSync(specDir)
.filter((name) => /\.(ya?ml|json)$/iu.test(name))
.sort()[0];
if (firstMatch) return path.join(specDir, firstMatch);
}

throw new Error(`Could not resolve spec for slug "${slug}" under specs/${slug}/`);
}

function createWorkspaceReadme(resultRoot, slug, specPath, options) {
const body = `# ${slug}

This folder is the generated API testing workspace for \`${slug}\`.

## Input

- Spec source: \`${path.relative(path.dirname(resultRoot), specPath)}\`

## Phase layout

- \`01-review/\` — OpenAPI review, auth, pagination, patterns, snapshot
- \`02-strategy/\` — test strategy and planning outputs
- \`03-scenarios/\` — journeys, integration, regression scenarios
- \`04-traceability/\` — coverage matrix and traceability docs
- \`05-postman/\` — Postman/Newman collections and Postman env files
- \`06-env/\` — CLI env templates and variable contract
- \`07-data/\` — samples, status cases, generators
- \`08-helpers/\` — runbooks and helper notes
- \`09-performance/\` — k6 / Newman perf / JMeter starter assets
- \`10-reports/\` — raw and curated execution reports

## Next step

Open \`.github/prompts/00-orchestration/00-run-pipeline.prompt.md\` and generate artifacts into this workspace only.
`;
writeTextFile(path.join(resultRoot, 'README.md'), body, options);
}

function main() {
const args = parseArgs(process.argv.slice(2));
if (args.help || !args.slug) {
printHelp();
process.exit(args.help ? 0 : 1);
}

const repoRoot = path.resolve(__dirname, '..');
const targetRoot = args.target ? path.resolve(args.target) : repoRoot;
const specPath = resolveSpecPath(targetRoot, args.slug, args.spec);
const templateRoot = path.join(repoRoot, 'templates', 'api-pack');
const resultRoot = path.join(targetRoot, 'result', args.slug);
const actions = [];
const options = { actions, dryRun: args.dryRun, force: args.force, targetRoot };

const roots = {
review: path.join(resultRoot, '01-review'),
strategy: path.join(resultRoot, '02-strategy'),
scenarios: path.join(resultRoot, '03-scenarios'),
traceability: path.join(resultRoot, '04-traceability'),
postman: path.join(resultRoot, '05-postman'),
env: path.join(resultRoot, '06-env'),
data: path.join(resultRoot, '07-data'),
helpers: path.join(resultRoot, '08-helpers'),
performance: path.join(resultRoot, '09-performance'),
reports: path.join(resultRoot, '10-reports'),
};

for (const dirPath of Object.values(roots)) {
actions.push(`mkdir ${path.relative(targetRoot, dirPath)}`);
ensureDir(dirPath, args.dryRun);
}

copyDirRecursive(path.join(templateRoot, 'postman'), roots.postman, options);
copyDirRecursive(path.join(templateRoot, 'env'), roots.env, options);
copyDirRecursive(path.join(templateRoot, 'data'), roots.data, options);
copyDirRecursive(path.join(templateRoot, 'helpers'), roots.helpers, options);
copyDirRecursive(path.join(templateRoot, 'performance'), roots.performance, options);
copyDirRecursive(path.join(templateRoot, 'reports', 'raw'), path.join(roots.reports, 'raw'), options);
copyDirRecursive(path.join(templateRoot, 'e2e-journeys'), path.join(roots.scenarios, 'e2e-journeys'), options);
copyDirRecursive(path.join(templateRoot, 'e2e-collection'), path.join(roots.helpers, 'e2e-collection'), options);

copyFileSafe(path.join(templateRoot, 'environment-variable-contract.md'), path.join(roots.env, 'environment-variable-contract.md'), options);
copyFileSafe(path.join(templateRoot, 'full-api-collection-traceability.md'), path.join(roots.traceability, 'full-api-collection-traceability.md'), options);
copyFileSafe(path.join(templateRoot, 'data-driven-samples-mapping.md'), path.join(roots.traceability, 'data-driven-samples-mapping.md'), options);
copyFileSafe(path.join(templateRoot, 'status-code-coverage-matrix.md'), path.join(roots.traceability, 'status-code-coverage-matrix.md'), options);
copyFileSafe(path.join(templateRoot, 'performance-collection-reporting.md'), path.join(roots.performance, 'performance-collection-reporting.md'), options);

writeTextFile(path.join(roots.review, 'README.md'), `# Review Phase\n\nStore OpenAPI quality, auth, pagination, test-pattern, and OAS snapshot outputs here.\n`, options);
writeTextFile(path.join(roots.strategy, 'README.md'), `# Strategy Phase\n\nStore the comprehensive test strategy and planning outputs here.\n`, options);
writeTextFile(path.join(roots.scenarios, 'README.md'), `# Scenarios Phase\n\nStore E2E, integration, and regression scenario documents here.\n`, options);
writeTextFile(path.join(roots.traceability, 'spec-source.md'), `# Spec Source\n\n- Output slug: \`${args.slug}\`\n- Spec path: \`${path.relative(targetRoot, specPath)}\`\n- Canonical result root: \`result/${args.slug}/\`\n`, options);
writeTextFile(path.join(roots.reports, 'README.md'), `# Reports Phase\n\nUse \`raw/\` for machine-readable outputs and subfolders like \`performance/\` or run slugs for curated reports.\n`, options);
createWorkspaceReadme(resultRoot, args.slug, specPath, options);

console.log(`[apply-api-testing-kit] repo: ${targetRoot}`);
console.log(`[apply-api-testing-kit] slug: ${args.slug}`);
console.log(`[apply-api-testing-kit] spec: ${path.relative(targetRoot, specPath)}`);
console.log(`[apply-api-testing-kit] mode: ${args.dryRun ? 'dry-run' : 'apply'}${args.force ? ' (force)' : ''}`);
console.log('');
for (const action of actions) console.log(action);
console.log('');
console.log('[apply-api-testing-kit] next checklist:');
console.log(`1. Put the latest spec under \`specs/${args.slug}/\` if it is not there yet.`);
console.log(`2. Generate artifacts only under \`result/${args.slug}/\`.`);
console.log('3. Start with `.github/prompts/00-orchestration/00-run-pipeline.prompt.md`.');
console.log('4. Keep real env values and raw runtime outputs out of git.');
}

main();
