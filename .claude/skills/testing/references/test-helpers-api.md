# API Testing References

| File | Purpose |
|---|---|
| `docs/APPLY_RECIPE.md` | How to scaffold `result/<slug>/` |
| `docs/GUIDELINE.md` | Practical operating model for the kit |
| `.github/prompts/README.md` | How to choose prompts by goal |
| `AGENTS.md` | Repo mission, support model, and operating boundaries |
| `result/README.md` | Canonical output conventions |
| `docs/RUNTIME_TOOLS.md` | How to install and verify `Newman`, `k6`, `ZAP`, and `JMeter` |
| `tooling/runtime-tools.json` | Runtime toolchain manifest committed in source |

## Canonical locations

- `result/<slug>/02-strategy/`
- `result/<slug>/03-scenarios/`
- `result/<slug>/04-traceability/`
- `result/<slug>/05-postman/`
- `result/<slug>/06-env/`
- `result/<slug>/07-data/`
- `result/<slug>/08-helpers/`
- `result/<slug>/09-performance/`
- `result/<slug>/10-reports/`

## Default decision ladder

1. trust the provided spec as source input, not as editable workspace state
2. record contradictions and gaps in review outputs
3. use strategy and traceability to decide what is safe to generate or execute
4. verify reports against evidence before presenting conclusions
