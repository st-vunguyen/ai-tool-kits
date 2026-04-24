# Consumer Journey Skill

Use this skill only for API-consumer or client-journey interpretation from spec and docs.

This is **not** a UI/component/frontend implementation skill.

## Goal

Model user-facing API journeys, chained request flows, and publishable/client-facing surfaces in a spec-first way.

## Primary outputs

- `result/<slug>/03-scenarios/`
- `result/<slug>/05-postman/` E2E or integration collections
- `result/<slug>/06-env/` client-flow variable contracts
- `result/<slug>/08-helpers/` journey runbooks

## Responsibilities

- derive journeys from evidenced endpoints and docs
- document actor, preconditions, steps, expected outcomes, and evidence
- capture variables passed across requests
- identify client-visible failure paths such as auth, stale version, or missing setup

## Hard rules

- do not add React, component, CSS, or UI architecture guidance
- do not invent client workflows not supported by the spec/docs
- do not claim UX behavior when only API behavior is evidenced
