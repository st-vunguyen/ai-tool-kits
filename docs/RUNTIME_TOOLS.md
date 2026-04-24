# Runtime Tools

This repository is a **standalone API testing tool**. All operating commands must go through `pnpm` or `pnpx`, while the wrappers decide whether to use local binaries or containers.

## Canonical Sources in the Repository

- `package.json` defines the single user-facing command surface.
- `tooling/runtime-tools.json` stores the runtime contract for `newman`, `k6`, `zap`, and `jmeter`.
- `scripts/runtime-tools.js` implements `list`, `plan`, `prepare`, `doctor`, and each execution wrapper.

## Quick start

```bash
pnpm install
pnpm run runtime:list
pnpm run runtime:plan
pnpm run runtime:prepare
pnpm run runtime:doctor
```

## What Each Command Does

- `pnpm run runtime:list`: prints the runtime manifest stored in source code.
- `pnpm run runtime:plan`: prints the standard wrapper commands and runtime mode for each tool.
- `pnpm run runtime:prepare`: pre-pulls the container images used for `k6`, `ZAP`, and `JMeter`.
- `pnpm run runtime:doctor`: verifies the local `Newman` package and wrapper readiness for `k6`, `ZAP`, and `JMeter`.

## Standard Wrapper Commands

```bash
pnpm run tool:newman -- --version
pnpm run tool:k6 -- version
pnpm run tool:zap -- -version
pnpm run tool:jmeter -- --version
```

## How the Wrappers Work

### Newman

- Runs through the package pinned in this repository.
- No direct `node` or binary invocation is required.
- Standard wrapper: `pnpm run tool:newman -- <args>`

### k6

- If the machine has `k6` on `PATH`, the wrapper uses the local binary.
- Otherwise, the wrapper uses the `grafana/k6:latest` container.
- Standard wrapper: `pnpm run tool:k6 -- <args>`

### ZAP

- If the machine has `zap.sh` or `zaproxy` on `PATH`, the wrapper uses the local install.
- Otherwise, the wrapper uses the `ghcr.io/zaproxy/zaproxy:stable` container.
- Standard wrapper: `pnpm run tool:zap -- <args>`

### JMeter

- If the machine has `jmeter` on `PATH`, the wrapper uses the local binary.
- Otherwise, the wrapper uses the `justb4/jmeter:5.5` container.
- Standard wrapper: `pnpm run tool:jmeter -- <args>`

## Practical Prerequisites

- `pnpm install` is required to make the local `newman` package available.
- If you want container fallback for `k6`, `ZAP`, or `JMeter`, `docker` must be available.
- When you want to warm up the images before a real run, use `pnpm run runtime:prepare`.

## Example Operations

```bash
pnpm run tool:newman -- run result/<slug>/05-postman/collection.json
pnpm run tool:k6 -- run result/<slug>/09-performance/k6-script.js
pnpm run tool:zap -- -cmd -version
pnpm run tool:jmeter -- -n -t result/<slug>/09-performance/jmeter/test-plan.jmx
```

## Policy

- Do not instruct users to run raw `node`, `bash`, `brew`, or `docker` commands directly.
- Prefer the repository wrappers to keep the command surface consistent.
- Raw outputs must still be written into `result/<slug>/10-reports/raw/`.
- This repository does not generate root `.github/workflows/` entries by default.
