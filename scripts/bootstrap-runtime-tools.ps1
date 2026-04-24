param(
  [switch]$Execute
)

$ErrorActionPreference = 'Stop'

$commands = @(
  'pnpm install',
  'brew install k6',
  'brew install --cask zap',
  'brew install jmeter'
)

$mode = if ($Execute) { 'execute' } else { 'plan' }
Write-Host "Runtime bootstrap ($mode)"
Write-Host "- Newman : pnpm install"
Write-Host "- k6     : brew install k6"
Write-Host "- ZAP    : brew install --cask zap"
Write-Host "- JMeter : brew install jmeter"

if (-not $Execute) {
  Write-Host ''
  Write-Host 'Re-run with -Execute to run these commands on macOS.'
  exit 0
}

foreach ($command in $commands) {
  Write-Host "> $command"
  Invoke-Expression $command
}

Write-Host ''
Write-Host "Done. Run 'pnpm run runtime:doctor' to verify the toolchain."
