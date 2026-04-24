# Performance Pack

This directory contains the baseline runner assets for `result/<slug>/09-performance/`.

## Expected report destinations

1. Runner assets and configuration live in `result/<slug>/09-performance/`
2. Raw outputs live in `result/<slug>/10-reports/raw/performance/<run-slug>/`
3. Curated findings live in `result/<slug>/10-reports/performance/<run-slug>/`

## Runtime prerequisites

- Newman is pinned in the root `package.json`
- k6 / ZAP / JMeter are declared in `tooling/runtime-tools.json`
- Run `pnpm run runtime:doctor` before executing real workloads
