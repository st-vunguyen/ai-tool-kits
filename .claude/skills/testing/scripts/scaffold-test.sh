#!/usr/bin/env bash
set -euo pipefail

OUTPUT_SLUG="${1:-example-api}"
RESULT_ROOT="result/${OUTPUT_SLUG}"

mkdir -p "$RESULT_ROOT"/{01-review,02-strategy,03-scenarios,04-traceability,05-postman,06-env,07-data,08-helpers,09-performance,10-reports/raw}

echo "Scaffolded $RESULT_ROOT"
