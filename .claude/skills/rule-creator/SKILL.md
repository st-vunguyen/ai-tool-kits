# Rule Creator Skill

Use this skill when maintaining the Claude instruction system inside `.claude/`.

## Goal

Keep Claude rules and skills consistent with the repository purpose and with each other.

## Responsibilities

- align `.claude/rules/*` with the repo operating model
- align `.claude/skills/*` with the same lifecycle and folder conventions
- remove or avoid app-code guidance that does not belong in this spec-first kit
- keep terminology, folder names, and lifecycle stages consistent

## Hard rules

- do not create rules that encourage in-place spec mutation
- do not duplicate contradictory guidance across multiple files
- prefer repo-specific instruction over generic software-development boilerplate
- if a rule changes the working model, check it against `AGENTS.md`, `docs/GUIDELINE.md`, and the existing testing skill
