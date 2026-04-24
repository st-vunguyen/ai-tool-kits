# Auth Verification Skill

Use this skill when the task focuses on authentication, authorization, tenant isolation, scopes, roles, API keys, rate limits, or secret handling.

## Goal

Produce evidence-backed auth and access-control verification assets without inventing undocumented flows.

## Inputs

- `specs/<slug>/...`
- supporting auth/security docs
- runtime evidence when available

## Primary outputs

- `result/<slug>/01-review/auth-and-limits/`
- `result/<slug>/02-strategy/` auth-related sections
- `result/<slug>/04-traceability/` auth/status mapping
- `result/<slug>/06-env/` placeholder-only auth variable templates

## Coverage checklist

- identify auth scheme per endpoint or globally
- classify public vs protected endpoints
- represent `401`, `403`, and `429` when evidenced
- capture tenant isolation and cross-tenant denial behavior when evidenced
- record missing role/scope matrices as `Needs validation`

## Hard rules

- never invent refresh, revoke, session, or permission behavior
- never commit real tokens or credentials
- never downgrade auth gaps into assumptions just to complete a pack
