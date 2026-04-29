# Raw Report Outputs

## What this folder is for / Folder này để làm gì

EN:
- Holds machine-readable runner outputs (Newman JSON, k6 summary, ZAP report, JMeter csv/log).
- These are noisy logs intended for engineers and debug, not for stakeholder review.

VN:
- Chứa output thô có thể đọc bằng máy (Newman JSON, k6 summary, ZAP report, JMeter csv/log).
- Đây là log nhiễu cho engineer và debug, KHÔNG phải để stakeholder đọc.

## Why separated from curated / Vì sao tách khỏi curated

| Aspect | Raw (this folder) | Curated (`10-reports/<family>/<run-slug>/`) |
|---|---|---|
| Reader | Engineer / debug | Lead / PM / stakeholder |
| Content | Full machine output | Summary + interpretation |
| Safety | May include diagnostic data unsafe to share | Reviewed and labeled |
| Permanence | Often discarded after curated summary | Kept as the audit record |

For non-tech readers: always go to `10-reports/<family>/<run-slug>/00_index.md` first; come back here only when the curated summary needs deeper raw evidence.

## Who reads this / Ai đọc folder này

| Audience | Why |
|---|---|
| Engineer | Re-run, debug, regenerate dashboards |
| QC verifier | Cross-check curated summary vs raw evidence |
| Stakeholder | NOT directly — read curated summaries |

Store machine-readable runner outputs here when needed.

## Suggested files

| Tool | Example outputs |
|---|---|
| Newman | `newman-summary.json`, `newman-junit.xml`, CLI log |
| k6 | `k6-summary.json` |
| ZAP baseline | `zap-report.html`, `zap-report.json` |
| JMeter | `results.csv`, `jmeter.log`, standard HTML report output |

Do not commit bulky one-off raw outputs by default. Prefer CI artifact upload unless a curated sample is explicitly needed.

For performance runs, use the nested convention `result/<slug>/10-reports/raw/performance/<run-slug>/` and keep `result/<slug>/10-reports/raw/performance/README.md` committed as the folder contract.

Curated dashboard assets belong outside `raw/`, in the matching curated report folder under `10-reports/`.
