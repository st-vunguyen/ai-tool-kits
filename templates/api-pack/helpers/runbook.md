# API Testing Runbook

## Local

1. Copy `.example` files to local non-committed working files if needed.
2. Fill in placeholders with safe test values.
3. Run the narrowest useful scope first via repo wrappers such as `pnpm run tool:newman -- ...` or `pnpm run tool:k6 -- ...`.
4. Capture raw outputs only when needed for triage.

## Shared automation

1. Prefer local or containerized runners owned by this tool repo and invoked through `pnpm` wrapper commands.
2. Keep secrets out of committed files and pass them only at execution time.
3. Write raw outputs into `result/<slug>/10-reports/raw/`.
4. Keep curated markdown reports separate from raw generated outputs.

## Triage Rules

- Fix collection/env/script issues before reporting system issues.
- Escalate only evidence-backed mismatches.
- Record inconclusive outcomes as blockers or evidence gaps.
