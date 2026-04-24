# Services Rules

This repository is not product service code.

“Services” here means the **verification workflow service chain**:

1. analyze source inputs
2. plan scope and gates
3. generate artifacts
4. execute the smallest safe validation
5. verify outputs and reports
6. recommend the next smallest useful action

Allowed work is limited to API testing assets under:

- `result/<slug>/...`
- `specs/<slug>/...` as input only

## Workflow rules

- Review and strategy must lead runnable asset generation when the task is broader than a single refresh.
- Fix testing assets before classifying failures as product issues.
- Verify curated reports against raw evidence before claiming the report is trustworthy.
- If execution is unsafe or unsupported, produce a blocked report rather than pretending the run completed.
- End every substantial workflow with explicit blockers, evidence gaps, and next-step suggestions.
- End every substantial workflow with a root-cause view and prioritized recommendations, not only a symptom list.
