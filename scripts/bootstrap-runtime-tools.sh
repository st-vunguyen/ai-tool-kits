#!/usr/bin/env bash
set -euo pipefail

MODE="plan"
if [[ "${1:-}" == "--execute" ]]; then
  MODE="execute"
fi

PNPM_CMD="pnpm install"
K6_CMD="brew install k6"
ZAP_CMD="brew install --cask zap"
JMETER_CMD="brew install jmeter"

cat <<EOF
Runtime bootstrap (${MODE})
- Newman : ${PNPM_CMD}
- k6     : ${K6_CMD}
- ZAP    : ${ZAP_CMD}
- JMeter : ${JMETER_CMD}
EOF

if [[ "$MODE" != "execute" ]]; then
  echo ""
  echo "Re-run with --execute to run these commands on macOS."
  exit 0
fi

${PNPM_CMD}
${K6_CMD}
${ZAP_CMD}
${JMETER_CMD}

echo ""
echo "Done. Run 'pnpm run runtime:doctor' to verify the toolchain."
