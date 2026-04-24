---
globs: "**/{api-pack,templates/api-pack,env,examples,zap-scanning}/**/*.{md,json,example,sh,ps1,yml,yaml,js}"
---

# API Security & Safe Handling

## Focus

Security in this repository refers to **security testing artifacts**, not auth implementation code from the application.

It also includes auth verification discipline, tenant isolation coverage, rate-limit evidence, and safe execution boundaries.

## When Writing Security-Related Assets

- State the auth scheme explicitly from the spec or docs: bearer, API key, basic auth, OAuth2, cookie session.
- If there is no evidence for refresh-token flow, scope handling, or role matrices, call it out as missing evidence.
- For ZAP / DAST baselines, prefer safe defaults and exclude destructive paths until they are verified.
- Treat cross-tenant access, missing auth, malformed auth, revoked auth, and wrong-role access as separate lines when evidence supports them.

## Secrets and Environments

- Commit only `.example` files, template JSON files, or placeholder values.
- Do not commit real tokens, real session cookies, internal production base URLs, or real credentials.
- When you need to mention a secret name, use placeholders such as `{{ACCESS_TOKEN}}`, `API_BASE_URL`, or `CLIENT_SECRET`.
- Do not leak real internal URLs, staging hostnames, callback URLs, or one-time secrets into committed examples.

## Auth test coverage

When evidence exists, cover at least:

- unauthenticated → `401` or the documented equivalent
- wrong scope / role → `403`
- malformed token / key → `401` or `403`
- expired token / replay / revoked token when documented
- forbidden cross-tenant resource access → documented denial status

## Rate Limits and Abuse Protection

- If the API publishes rate limits, the pack should preserve headers or response-body evidence.
- Do not ignore `429` when the spec, docs, or runtime provide evidence for it.
- Do not spam workloads against a real environment; performance and security runs need explicit runbooks and guardrails.
- If rate limiting is not evidenced, write `Not specified` rather than inventing a window, quota, or retry policy.

## ZAP / scanning rules

- Scan configuration must state scope, excludes, and auth bootstrap when applicable.
- Raw outputs must be kept separate in `reports/raw/`.
- Summary reports must distinguish confirmed findings, false positives, and items that still need triage.
- Curated reports must distinguish asset misconfiguration from actual target-system findings.

## Do Not Do This

- Do not write security guidance tied to a specific auth framework such as NextAuth when the repository does not provide that implementation.
- Do not claim a vulnerability or protection mechanism without evidence.
- Do not broaden scan scope beyond what the runbook and explicit permission allow.
