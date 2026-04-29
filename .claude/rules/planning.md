# Planning Rules

Planning is mandatory for non-trivial API verification work in this repository.

## Required planning sequence

1. inspect the provided spec and supporting docs
2. identify domains, operations, risks, dependencies, and unknowns
3. decide what can be reviewed, generated, executed, or only proposed
4. define explicit gates before moving to runnable assets or execution

## Planning outputs must clarify

- in-scope vs out-of-scope areas
- response-code coverage intent, not just happy-path intent
- auth, permissions, rate-limit, pagination, conflict, and validation lines when evidenced
- blockers caused by missing docs, missing environment access, or unsafe execution boundaries
- which contradiction checks, root-cause checks, and report-verification gates will be applied before claiming completion
- which `result/<slug>/` folders will receive the outputs, especially the curated report family under `10-reports/`

## Hard rules

- Do not jump straight to collection generation when review and strategy are still missing for a broad task.
- Do not silently skip a major phase; mark it as `Skipped with reason` or `Blocked`.
- If evidence is weak, narrow the plan instead of fabricating details.
- Do not leave report placement implicit; choose a report family such as `performance`, `security-baseline`, `verification`, or `maintenance` before publishing curated findings.
- For non-trivial work, reserve a final verification pass for "findings vs evidence vs recommendation" consistency before handoff.

## Pipeline phase sequencing (MANDATORY)

When executing a multi-phase pipeline (e.g., `00-run-phase-1` through `00-run-phase-4`):

1. **Execute phases in strict sequence** — Phase 1 → Phase 2 → Phase 3 → Phase 4.
2. **Gate on Required Output Files** — before starting Phase N+1, verify that every file listed in Phase N's `Required Output Files` checklist exists on disk with non-empty content.
3. **Do not assume** a previous phase completed because the prompt finished running; confirm each output file explicitly.
4. **If Phase N is incomplete**, mark it `Partial — blocked on: <list missing files>` and resolve the gaps before continuing.
5. **Never skip phases silently**; if a phase must be skipped, record it as `Skipped — reason: <reason>` in the run summary.
6. **Phase summary required** — after completing each phase, output a checklist showing ✅/❌ for every required file in that phase before proceeding.

## Required Output Files discipline

- Every prompt that declares `Required Output Files` is making a contract — all files are mandatory, not optional.
- After generating each file, verify it contains meaningful, spec-aligned content — not placeholder text, not empty arrays, not stub outlines.
- If a file cannot be generated (e.g., missing spec evidence), mark it `BLOCKED: <reason>` in the phase summary instead of omitting it.