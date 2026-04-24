---
applyTo: "**/result/**"
description: "Mandatory rules for API testing artifacts generated inside result/."
---

# API Testing — Mandatory Rules

## 1) Source of truth

All outputs must be anchored to:

1. OpenAPI / Swagger content in `specs/`
2. Explicitly identified supporting documentation
3. Existing committed API testing artifacts
4. Runtime evidence when execution has actually happened

If evidence is incomplete:

- record `Unknown / needs confirmation`
- capture the gap in blockers or open questions
- never invent request, response, auth, or status behavior

## 2) Output scope

### Allowed roots

| Path | Content |
|---|---|
| `result/<slug>/01-review/**` | spec review outputs |
| `result/<slug>/02-strategy/**` | strategy outputs |
| `result/<slug>/03-scenarios/**` | journeys / scenarios |
| `result/<slug>/04-traceability/**` | traceability and matrices |
| `result/<slug>/05-postman/**` | Postman/Newman assets |
| `result/<slug>/06-env/**` | env templates and variable contract |
| `result/<slug>/07-data/**` | sample data and status cases |
| `result/<slug>/08-helpers/**` | runbooks and helper notes |
| `result/<slug>/09-performance/**` | k6 / Newman perf / ZAP / JMeter starter |
| `result/<slug>/10-reports/**` | raw and curated reports |

### Forbidden by default

| Path | Reason |
|---|---|
| `src/**`, `app/**` | product code is out of scope |
| `.env`, `.env.*` | real runtime env files must not be overwritten |
| product dependency manifests | edit only when the user explicitly asks for it |
| `.github/workflows/**` | this repo does not generate CI workflows by default |

## 3) Canonical output model

```text
result/<slug>/
├── 01-review/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
```

Do not spread outputs into any root outside `result/<slug>/`.

## 4) Full-status rule

- Do not stop at the happy path
- Every in-scope operation must have status-code-based coverage tracking
- Every status must map to a case ID, sample or precondition, assertion focus, and evidence source
- Never claim full coverage when only `200` or other success-only paths exist

## 5) Secrets and environment

- Commit only `.example` files
- Never commit real tokens, secrets, or exported current-value environments
- Separate manual variables, captured variables, and derived variables clearly

## 6) Data and cleanup

- Use synthetic data
- Make status cases intentional
- If a test creates state, describe cleanup explicitly

## 7) Completion checklist

- [ ] Output lives only in `result/<slug>/`
- [ ] Real secrets are not committed
- [ ] Every claim is evidence-backed
- [ ] A status coverage matrix exists and is not success-only
- [ ] The variable contract matches env templates
- [ ] Raw outputs and real runtime env files do not go into git
