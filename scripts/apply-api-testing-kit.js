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
const specRelative = path.relative(path.dirname(resultRoot), specPath);
const body = `# ${slug} — API Testing Workspace

> Bilingual landing page (EN / VN). Tài liệu song ngữ Anh / Việt. New here? Open \`00_OVERVIEW.md\` first for a 1-page executive summary.

This folder is the generated API testing workspace for \`${slug}\`. Đây là workspace kiểm thử API được sinh tự động cho \`${slug}\`.

## Input / Đầu vào

- Spec source / Nguồn spec: \`${specRelative}\`

## TL;DR — Where to start by role / Bắt đầu từ đâu theo vai trò

| Role / Vai trò | Read first / Đọc đầu tiên |
|---|---|
| PM / BA / Stakeholder | [\`00_OVERVIEW.md\`](./00_OVERVIEW.md) — 1-page summary in plain language / tóm tắt 1 trang ngôn ngữ thường |
| QA Lead | [\`02-strategy/test-strategy.md\`](./02-strategy/) — scope, risks, priorities / phạm vi, rủi ro, ưu tiên |
| QA Engineer | [\`05-postman/\`](./05-postman/) + [\`06-env/.env.example\`](./06-env/) — runnable collections + env / collection chạy được + env |
| Performance Engineer | [\`09-performance/README.md\`](./09-performance/) — k6, Newman, JMeter starter assets |
| Security Reviewer | [\`10-reports/security-baseline/\`](./10-reports/security-baseline/) — latest ZAP baseline report |

## Folder map / Bản đồ thư mục

| # | Folder | Purpose (EN) | Mục đích (VN) | Audience |
|---|---|---|---|---|
| 01 | \`01-review/\` | OpenAPI quality, auth, pagination, patterns, snapshot | Soát chất lượng spec, auth, phân trang, mẫu test | Tech |
| 02 | \`02-strategy/\` | Test strategy, scope, risks, priorities | Chiến lược test, phạm vi, rủi ro, ưu tiên | All |
| 03 | \`03-scenarios/\` | E2E journeys, integration, regression, performance | Kịch bản end-to-end, tích hợp, regression, hiệu năng | All |
| 04 | \`04-traceability/\` | Operation ↔ status ↔ case ↔ evidence map | Bản đồ truy vết test case ↔ spec ↔ bằng chứng | Tech + Lead |
| 05 | \`05-postman/\` | Runnable Postman/Newman collections | Bộ collection chạy được bằng Postman/Newman | Tech |
| 06 | \`06-env/\` | \`.env.example\`, variable contract | Biến môi trường mẫu, hợp đồng biến | Tech |
| 07 | \`07-data/\` | Synthetic samples, generators, status cases | Dữ liệu tổng hợp, generator, sample theo status | Tech |
| 08 | \`08-helpers/\` | Runbooks, fixtures, helper notes | Runbook, fixture, ghi chú hỗ trợ | Tech |
| 09 | \`09-performance/\` | k6, Newman perf, JMeter starter assets | Asset hiệu năng cho k6, Newman, JMeter | Perf eng |
| 10 | \`10-reports/\` | Raw + curated reports (perf / security / verification / maintenance) | Báo cáo thô + biên tập (hiệu năng / bảo mật / xác minh / bảo trì) | All |

## Status / Trạng thái

Phase progress is tracked in [\`_phase-progress.md\`](./_phase-progress.md) (update at the end of each phase per orchestration prompts). Tiến trình các phase được ghi tại file đó.

## Read order / Thứ tự đọc

1. [\`00_OVERVIEW.md\`](./00_OVERVIEW.md) — 1-page executive summary / Tóm tắt 1 trang.
2. \`02-strategy/test-strategy.md\` — scope + risks / phạm vi + rủi ro.
3. \`04-traceability/status-code-coverage-matrix.md\` — coverage view / bao phủ status.
4. \`10-reports/<family>/<latest-run>/00_index.md\` — latest curated report / báo cáo mới nhất.

## Report family rules / Quy tắc thư mục báo cáo

- Raw machine outputs only in \`10-reports/raw/\`. Log thô chỉ ở \`raw/\`.
- Curated outputs only under named families: \`performance/\`, \`security-baseline/\`, \`verification/\`, \`maintenance/\`. Báo cáo biên tập chỉ ở family có tên cụ thể.
- Do not create loose run folders directly under \`10-reports/\`. Không tạo folder run rời rạc thẳng dưới \`10-reports/\`.

## Next step / Tiếp theo

Open [\`.github/prompts/00-orchestration/00-run-pipeline.prompt.md\`](../../.github/prompts/00-orchestration/00-run-pipeline.prompt.md) and run phases 1 → 4 in sequence. All outputs land in this workspace only.

Mở file pipeline ở trên và chạy lần lượt phase 1 → 4. Mọi output chỉ ghi vào workspace này.
`;
writeTextFile(path.join(resultRoot, 'README.md'), body, options);
}

function createExecutiveOverview(resultRoot, slug, specPath, options) {
const specRelative = path.relative(path.dirname(resultRoot), specPath);
const body = `# ${slug} — Executive Overview

> 1-page summary for non-technical stakeholders (PM / BA / lead). Tóm tắt 1 trang cho người không chuyên kỹ thuật.

## What this workspace gives you / Workspace này cung cấp gì

EN:
- A reviewable map of every endpoint in \`${slug}\`.
- Test cases for every documented response code (not only the happy path).
- Runnable Postman/Newman collections that engineers can execute.
- Performance and security baselines (when applicable).
- Trust-pass verification reports highlighting blockers and recommendations.

VN:
- Bản đồ rà soát mọi endpoint trong \`${slug}\`.
- Test case cho từng mã response (không chỉ happy path).
- Bộ Postman/Newman chạy được cho engineer.
- Baseline hiệu năng và bảo mật (khi áp dụng).
- Báo cáo xác minh tin cậy nêu rõ rào cản và khuyến nghị.

## Reading map for non-tech / Bản đồ đọc cho non-tech

| Question / Câu hỏi | File to open / Mở file |
|---|---|
| What does this API do? / API này làm gì? | \`01-review/oas-snapshot/oas-snapshot.md\` |
| What's our test strategy? / Chiến lược test? | \`02-strategy/test-strategy.md\` |
| Are we covering enough? / Bao phủ đã đủ chưa? | \`04-traceability/status-code-coverage-matrix.md\` |
| Latest test run results? / Kết quả run gần nhất? | \`10-reports/<family>/<latest-run>/00_index.md\` |
| Any blockers / risks? / Có rào cản / rủi ro nào? | search "Blocked" or "Open question" trong \`02-strategy/\` và \`10-reports/\` |

## Glossary / Thuật ngữ

| Term | Plain meaning (EN) | Nghĩa đơn giản (VN) |
|---|---|---|
| Spec / OpenAPI | API contract definition | Định nghĩa hợp đồng API |
| Endpoint / operation | A URL the API exposes | Một URL mà API cung cấp |
| Collection | A bundle of API calls | Bộ test case API có thể chạy |
| Status code | API response code (200, 404...) | Mã phản hồi API |
| Coverage | % of endpoints/statuses with test cases | Tỉ lệ test bao phủ |
| Traceability | Link from test case → spec → evidence | Truy vết case ↔ spec ↔ bằng chứng |
| Curated report | Human-read summary, not raw output | Báo cáo đã biên tập, không phải log thô |
| Smoke / Load / Stress | Light / sustained / peak performance test | Test nhẹ / kéo dài / cực đại |

## Spec source / Nguồn spec

- \`${specRelative}\`

## Status snapshot / Ảnh trạng thái nhanh

Phases run independently — current state lives in [\`_phase-progress.md\`](./_phase-progress.md). Các phase chạy độc lập — trạng thái hiện tại nằm tại file đó.
`;
writeTextFile(path.join(resultRoot, '00_OVERVIEW.md'), body, options);
}

function createPhaseProgress(resultRoot, slug, options) {
const body = `# Phase Progress / Tiến trình các phase — ${slug}

| Phase | Status | Last update | Output count | Notes |
|---|---|---|---|---|
| Phase 1 — Review & Strategy | ⏳ pending | — | 0 | run \`.github/prompts/00-orchestration/00-run-phase-1.prompt.md\` |
| Phase 2 — Core Pack | ⏳ pending | — | 0 | run \`.github/prompts/00-orchestration/00-run-phase-2.prompt.md\` |
| Phase 3 — Scenario Packs | ⏳ pending | — | 0 | run \`.github/prompts/00-orchestration/00-run-phase-3.prompt.md\` |
| Phase 4 — Non-functional & Reporting | ⏳ pending | — | 0 | run \`.github/prompts/00-orchestration/00-run-phase-4.prompt.md\` |

Legend: ⏳ pending • 🟡 partial • ✅ complete • ⏭️ skipped • ❌ blocked

## How to update / Cách cập nhật

At the end of each phase orchestration prompt, the agent must update the row for that phase with:
- the new status emoji
- ISO date (YYYY-MM-DD)
- count of files written in that phase
- any blocking note (e.g., \`Blocked: missing BASE_URL\`)

Cuối mỗi phase, agent điều phối phải cập nhật dòng tương ứng với: emoji trạng thái mới, ngày ISO, số file vừa ghi, và ghi chú nếu bị chặn.

## Open items / Vấn đề mở

(track skipped / blocked steps here as they accumulate)
`;
writeTextFile(path.join(resultRoot, '_phase-progress.md'), body, options);
}

function buildFolderReadme({ title, audience, questionEn, questionVn, contentsEn, contentsVn, createdByPrompt, readFirst, nextFolder }) {
return `# ${title}

**Audience**: ${audience}
**Question this folder answers / Câu hỏi folder này trả lời**:
- EN: ${questionEn}
- VN: ${questionVn}

## What goes here / Nội dung

EN:
${contentsEn.map((line) => `- ${line}`).join('\n')}

VN:
${contentsVn.map((line) => `- ${line}`).join('\n')}

## Created by prompts / Sinh từ prompt

${createdByPrompt}

## Read first / Đọc đầu tiên

\`${readFirst}\`

${nextFolder ? `## Next folder / Folder tiếp theo\n\n\`${nextFolder}\`\n` : ''}`;
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
reportsRaw: path.join(resultRoot, '10-reports', 'raw'),
reportsRawPerformance: path.join(resultRoot, '10-reports', 'raw', 'performance'),
reportsPerformance: path.join(resultRoot, '10-reports', 'performance'),
reportsSecurity: path.join(resultRoot, '10-reports', 'security-baseline'),
reportsVerification: path.join(resultRoot, '10-reports', 'verification'),
reportsMaintenance: path.join(resultRoot, '10-reports', 'maintenance'),
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
copyDirRecursive(path.join(templateRoot, 'reports', 'raw'), roots.reportsRaw, options);
copyDirRecursive(path.join(templateRoot, 'e2e-journeys'), path.join(roots.scenarios, 'e2e-journeys'), options);
copyDirRecursive(path.join(templateRoot, 'e2e-collection'), path.join(roots.helpers, 'e2e-collection'), options);

copyFileSafe(path.join(templateRoot, 'environment-variable-contract.md'), path.join(roots.env, 'environment-variable-contract.md'), options);
copyFileSafe(path.join(templateRoot, 'full-api-collection-traceability.md'), path.join(roots.traceability, 'full-api-collection-traceability.md'), options);
copyFileSafe(path.join(templateRoot, 'data-driven-samples-mapping.md'), path.join(roots.traceability, 'data-driven-samples-mapping.md'), options);
copyFileSafe(path.join(templateRoot, 'status-code-coverage-matrix.md'), path.join(roots.traceability, 'status-code-coverage-matrix.md'), options);
copyFileSafe(path.join(templateRoot, 'performance-collection-reporting.md'), path.join(roots.performance, 'performance-collection-reporting.md'), options);

writeTextFile(path.join(roots.review, 'README.md'), buildFolderReadme({
  title: '01 — Review Phase',
  audience: 'Tech (QA, dev, lead)',
  questionEn: 'Is the API spec well-formed, and what auth / pagination / test-pattern realities does it imply?',
  questionVn: 'Spec API có đúng chuẩn không, ngầm yêu cầu gì về auth / phân trang / mẫu test?',
  contentsEn: [
    '`openapi-quality/` — lint, normalization, and fix proposals',
    '`auth-and-limits/` — auth schemes, throttling, rate-limit findings',
    '`pagination-filtering/` — list / filter / sort behavior',
    '`test-patterns/` — naming, assertion, fixture conventions',
    '`oas-snapshot/` — fast-review snapshot of every operation',
  ],
  contentsVn: [
    '`openapi-quality/` — lint, chuẩn hoá, đề xuất sửa',
    '`auth-and-limits/` — scheme auth, throttling, rate-limit',
    '`pagination-filtering/` — phân trang, filter, sort',
    '`test-patterns/` — quy ước naming, assertion, fixture',
    '`oas-snapshot/` — snapshot nhanh mọi operation',
  ],
  createdByPrompt: '`.github/prompts/01-review-and-strategy/01..05-*.prompt.md`',
  readFirst: 'oas-snapshot/oas-snapshot.md',
  nextFolder: '02-strategy/',
}), options);

writeTextFile(path.join(roots.strategy, 'README.md'), buildFolderReadme({
  title: '02 — Strategy Phase',
  audience: 'All (PM, BA, lead, QA)',
  questionEn: 'What are we testing, why, in which order, and what risks are accepted?',
  questionVn: 'Test cái gì, vì sao, theo thứ tự nào, chấp nhận rủi ro gì?',
  contentsEn: [
    '`test-strategy.md` — comprehensive synthesized strategy',
    'Scope matrix, priority tiers (P1/P2/P3)',
    'Risk profile, known gaps, open questions',
    'Coverage approach per operation',
  ],
  contentsVn: [
    '`test-strategy.md` — chiến lược tổng hợp',
    'Ma trận phạm vi, ưu tiên (P1/P2/P3)',
    'Hồ sơ rủi ro, khoảng trống, câu hỏi mở',
    'Cách tiếp cận coverage cho từng operation',
  ],
  createdByPrompt: '`.github/prompts/01-review-and-strategy/06-comprehensive-test-strategy.prompt.md`',
  readFirst: 'test-strategy.md',
  nextFolder: '03-scenarios/',
}), options);

writeTextFile(path.join(roots.scenarios, 'README.md'), buildFolderReadme({
  title: '03 — Scenarios Phase',
  audience: 'All (lead, QA, PM for journeys)',
  questionEn: 'What multi-step user journeys, integrations, regression scenarios, and performance workloads are documented?',
  questionVn: 'Có những kịch bản nhiều bước, tích hợp, regression, và workload hiệu năng nào?',
  contentsEn: [
    '`e2e-journeys/` — chained user journeys',
    '`integration-flows.md` — cross-resource flows',
    '`regression-scenarios.md` + priority matrix',
    '`performance-scenarios.md` + thresholds',
  ],
  contentsVn: [
    '`e2e-journeys/` — chuỗi user journey',
    '`integration-flows.md` — flow qua nhiều tài nguyên',
    '`regression-scenarios.md` + ma trận ưu tiên',
    '`performance-scenarios.md` + ngưỡng',
  ],
  createdByPrompt: '`.github/prompts/03-scenario-packs/10..17-*.prompt.md`, `.github/prompts/04-non-functional/18-*.prompt.md`',
  readFirst: 'e2e-journeys/e2e-journeys.md',
  nextFolder: '04-traceability/',
}), options);

writeTextFile(path.join(roots.traceability, 'README.md'), buildFolderReadme({
  title: '04 — Traceability Phase',
  audience: 'Tech + Lead (audit, sign-off)',
  questionEn: 'For every operation × status code, which test request covers it and where is the evidence?',
  questionVn: 'Mỗi operation × status có request test nào bao phủ, và bằng chứng ở đâu?',
  contentsEn: [
    '`status-code-coverage-matrix.md` — operation × status grid',
    '`full-api-collection-traceability.md` — request ↔ spec ↔ status mapping',
    '`environment-variable-contract.md` — variable usage across collection',
    '`data-driven-samples-mapping.md` — sample ↔ operation ↔ status',
    '`spec-source.md` — input slug + spec path',
  ],
  contentsVn: [
    '`status-code-coverage-matrix.md` — bảng operation × status',
    '`full-api-collection-traceability.md` — map request ↔ spec ↔ status',
    '`environment-variable-contract.md` — biến dùng trong collection',
    '`data-driven-samples-mapping.md` — sample ↔ operation ↔ status',
    '`spec-source.md` — slug + đường dẫn spec',
  ],
  createdByPrompt: '`.github/prompts/02-core-pack/07,08,09-*.prompt.md`, `.github/prompts/03-scenario-packs/12,13,15,17-*.prompt.md`',
  readFirst: 'status-code-coverage-matrix.md',
  nextFolder: '05-postman/',
}), options);

writeTextFile(path.join(roots.env, 'README.md'), buildFolderReadme({
  title: '06 — Env Phase',
  audience: 'Tech (QA engineer, devops)',
  questionEn: 'What environment variables does the test pack need, and how do they map to local / staging / prod?',
  questionVn: 'Bộ test cần biến môi trường nào, map sang local / staging / prod thế nào?',
  contentsEn: [
    '`.env.example`, `.env.staging.example`, `.env.prod.example` — placeholder values only',
    '`environment-variable-contract.md` — variable purpose, set-by, used-by',
  ],
  contentsVn: [
    '`.env.example`, `.env.staging.example`, `.env.prod.example` — chỉ placeholder',
    '`environment-variable-contract.md` — mục đích biến, set-by, used-by',
  ],
  createdByPrompt: '`.github/prompts/02-core-pack/08-refresh-environment-files.prompt.md`',
  readFirst: 'environment-variable-contract.md',
  nextFolder: '07-data/',
}), options);

writeTextFile(path.join(roots.data, 'README.md'), buildFolderReadme({
  title: '07 — Data Phase',
  audience: 'Tech (QA engineer)',
  questionEn: 'What synthetic payloads cover each operation × status, and how is data generated?',
  questionVn: 'Có payload tổng hợp nào cho mỗi operation × status, sinh dữ liệu thế nào?',
  contentsEn: [
    '`samples/` — JSON samples per resource',
    '`generators/` — scripts that synthesize unique payloads per run',
    'Status-driven negative and edge cases',
  ],
  contentsVn: [
    '`samples/` — sample JSON theo resource',
    '`generators/` — script sinh dữ liệu mỗi lần chạy',
    'Case âm tính / biên theo status',
  ],
  createdByPrompt: '`.github/prompts/02-core-pack/09-data-driven-samples.prompt.md`',
  readFirst: 'samples/',
  nextFolder: '08-helpers/',
}), options);

writeTextFile(path.join(roots.helpers, 'README.md'), buildFolderReadme({
  title: '08 — Helpers Phase',
  audience: 'Tech (QA engineer, automation)',
  questionEn: 'What runbooks and fixtures support running the collections (E2E, integration, regression)?',
  questionVn: 'Có runbook / fixture nào hỗ trợ chạy collection (E2E, integration, regression)?',
  contentsEn: [
    '`e2e-runbook.md`, `integration-runbook.md`, `regression-runbook.md`',
    '`integration-fixtures.md` — preconditions and seed data notes',
    '`e2e-collection/` — helper assets for end-to-end scenarios',
  ],
  contentsVn: [
    '`e2e-runbook.md`, `integration-runbook.md`, `regression-runbook.md`',
    '`integration-fixtures.md` — điều kiện và dữ liệu seed',
    '`e2e-collection/` — asset cho kịch bản end-to-end',
  ],
  createdByPrompt: '`.github/prompts/03-scenario-packs/11,15,17-*.prompt.md`',
  readFirst: 'e2e-runbook.md',
  nextFolder: '09-performance/',
}), options);

writeTextFile(path.join(roots.traceability, 'spec-source.md'), `# Spec Source\n\n- Output slug: \`${args.slug}\`\n- Spec path: \`${path.relative(targetRoot, specPath)}\`\n- Canonical result root: \`result/${args.slug}/\`\n`, options);

writeTextFile(path.join(roots.reports, 'README.md'), `# 10 — Reports Phase

**Audience**: All (engineer for raw, lead/PM for curated)
**Question this folder answers / Câu hỏi folder này trả lời**:
- EN: What did the latest test runs show, and what should we do about it?
- VN: Các lần run gần nhất cho thấy gì, và nên làm gì tiếp?

## Layered structure / Cấu trúc 2 lớp

| Layer | Path | Audience |
|---|---|---|
| Raw machine output | \`raw/\` | engineer / debug |
| Curated performance | \`performance/<run-slug>/\` | lead / PM |
| Curated security | \`security-baseline/<run-slug>/\` | security reviewer |
| Curated verification | \`verification/<run-slug>/\` | lead / sign-off |
| Curated maintenance | \`maintenance/<run-slug>/\` | lead after spec change |

Each curated run folder must start with \`00_index.md\` and may include \`dashboard.html\`.

Do not create loose run folders directly under \`10-reports/\`. Always nest under a named family.

Không tạo folder run rời rạc thẳng dưới \`10-reports/\`. Luôn lồng dưới family có tên.
`, options);

writeTextFile(path.join(roots.reportsPerformance, 'README.md'), `# Performance Reports — curated

**Audience**: lead, perf engineer, PM
**Question / Câu hỏi**: How does the API behave under load, and what are the next perf actions?

Store curated performance handoff files under \`performance/<run-slug>/\`. Each run starts with \`00_index.md\` and should include a \`dashboard.html\` when raw evidence supports it.

Lưu file handoff đã biên tập tại \`performance/<run-slug>/\`. Mỗi run mở đầu bằng \`00_index.md\` và nên có \`dashboard.html\` khi đủ dữ liệu thô.
`, options);

writeTextFile(path.join(roots.reportsSecurity, 'README.md'), `# Security Baseline Reports — curated

**Audience**: security reviewer, lead
**Question / Câu hỏi**: What baseline security findings exist, and which are confirmed vs noise?

Store curated ZAP / security baseline handoff files under \`security-baseline/<run-slug>/\`. Each run starts with \`00_index.md\`. Distinguish confirmed findings from false positives explicitly.

Lưu file ZAP / security baseline biên tập tại \`security-baseline/<run-slug>/\`. Phân biệt rõ phát hiện thật và false positive.
`, options);

writeTextFile(path.join(roots.reportsVerification, 'README.md'), `# Verification Reports — final trust pass

**Audience**: lead, stakeholder, sign-off
**Question / Câu hỏi**: Is this deliverable trustworthy, what contradictions remain, and what do we do next?

Store trust-pass verification reports under \`verification/<run-slug>/\`. Each run includes:
- \`verification-report.md\`
- \`contradictions.md\`
- \`recommendations.md\`
- \`dashboard.html\`

Lưu báo cáo xác minh tin cậy tại \`verification/<run-slug>/\`.
`, options);

writeTextFile(path.join(roots.reportsMaintenance, 'README.md'), `# Maintenance Reports — refresh after spec change

**Audience**: QA lead, dev maintaining the pack
**Question / Câu hỏi**: What changed in the spec, what was refreshed in the pack, what's still pending?

Store maintenance refresh reports under \`maintenance/<run-slug>/\`. Each run starts with \`00_index.md\` and lists the diff scope plus which artifacts were touched.

Lưu báo cáo refresh tại \`maintenance/<run-slug>/\`. Mỗi run mở đầu bằng \`00_index.md\` và liệt kê scope diff + artifact đã chạm.
`, options);

writeTextFile(path.join(roots.reportsRawPerformance, 'README.md'), `# Raw Performance Outputs — machine logs only

**Audience**: engineer / debug only — not for stakeholder review
**Why separated / Vì sao tách**: raw logs are noisy and may include diagnostic data unsafe to share with non-tech audiences. Always read curated \`../performance/<run-slug>/\` instead.

Store machine-readable performance outputs under \`raw/performance/<run-slug>/\`. Curated summaries belong under \`../performance/<run-slug>/\`.

Lưu output thô có thể đọc bằng máy tại \`raw/performance/<run-slug>/\`. Bản biên tập nằm tại \`../performance/<run-slug>/\`.
`, options);

createWorkspaceReadme(resultRoot, args.slug, specPath, options);
createExecutiveOverview(resultRoot, args.slug, specPath, options);
createPhaseProgress(resultRoot, args.slug, options);

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
