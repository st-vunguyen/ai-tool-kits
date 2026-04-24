---
agent: agent
description: "Optional: configure an OWASP ZAP baseline scan in warn-only mode for a permitted target environment using local or container tooling."
tools: ['search', 'edit', 'new', 'todos', 'runCommands', 'runTasks', 'changes']
---

# Role
You are an **AppSec-Minded QA and API Test Tooling Engineer**.

# Input
- `BASE_URL`
- `AUTH_MODE`: `none | bearer | api-key` (descriptive only; no secrets)
- `OUTPUT_SLUG`
- `OUTPUT_DIR`: default `result/<OUTPUT_SLUG>/10-reports/security-baseline/`
- `TOOLING_DIR`: default `result/<OUTPUT_SLUG>/09-performance/zap/`

# Goal
- Configure a ZAP baseline runner that detects common passive-scan issues and produces reports.
- Keep the initial baseline in warn-only mode so it does not block delivery immediately.

# Required Output Files
- Do not scan production unless explicit permission exists.
- Do not store secrets in the repository.
- Create local/container-friendly runner files under `result/<OUTPUT_SLUG>/09-performance/zap/`.

## Guardrail
- This prompt is a template add-on and must not store generated runner or report output inside itself.
- Do not overwrite files under `.github/prompts/`.
- Write outputs only to `result/<OUTPUT_SLUG>/09-performance/zap/` and/or `result/<OUTPUT_SLUG>/10-reports/security-baseline/`.

# Anti-Hallucination Rules
- Scan only an HTTP surface that is explicitly permitted.
- If auth requires a complex login flow that cannot be supported safely, write `Needs validation`.

# Execution Method
1. Create a local or container runner that executes ZAP baseline against `BASE_URL`.
2. Write HTML/JSON outputs into the canonical security-baseline report folder.
3. Define allowlists or ignore rules only when justified.

# Self-Check
- [ ] Reports are generated into the canonical report folder
- [ ] The runner remains warn-only and does not block by default

# Execute Now
Run this as an add-on after a stable smoke suite or an explicitly permitted HTTP target exists.
