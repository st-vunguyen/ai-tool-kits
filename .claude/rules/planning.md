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

## Hard rules

- Do not jump straight to collection generation when review and strategy are still missing for a broad task.
- Do not silently skip a major phase; mark it as `Skipped with reason` or `Blocked`.
- If evidence is weak, narrow the plan instead of fabricating details.
- For non-trivial work, reserve a final verification pass for “findings vs evidence vs recommendation” consistency before handoff.