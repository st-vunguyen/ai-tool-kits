#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token.startsWith('--')) {
      const [key, inlineValue] = token.split('=', 2);
      const normalizedKey = key.replace(/^--/, '');
      if (inlineValue !== undefined) {
        args[normalizedKey] = inlineValue;
      } else {
        const next = argv[index + 1];
        if (!next || next.startsWith('--')) {
          args[normalizedKey] = true;
        } else {
          args[normalizedKey] = next;
          index += 1;
        }
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function usage() {
  return [
    'Usage:',
    '  node scripts/render-report-dashboard.js build --mode <newman|k6|zap|jmeter|generic> --input <json> [--output-dir <dir>] [--output-html <file>] [--output-data <file>] [--output-md <file>] [--title <title>] [--run-label <label>] [--subtitle <text>] [--threshold-p95 <ms>] [--threshold-error-pct <pct>]',
    '  node scripts/render-report-dashboard.js render --input <dashboard-data.json> [--output-html <file>] [--output-md <file>]',
  ].join('\n');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function writeText(targetPath, content) {
  ensureDir(targetPath);
  fs.writeFileSync(targetPath, content, 'utf8');
}

function escapeHtml(input) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNumber(value, fractionDigits = 0) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return '0';
  return number.toLocaleString('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
}

function formatDurationMs(value) {
  const ms = Number(value || 0);
  if (!Number.isFinite(ms) || ms <= 0) return 'n/a';
  if (ms < 1000) return `${formatNumber(ms, 0)} ms`;
  if (ms < 60000) return `${formatNumber(ms / 1000, 1)} s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function badgeTone(status) {
  const normalized = String(status || '').toLowerCase();
  if (['passed', 'approved', 'ok', 'success'].includes(normalized)) return 'good';
  if (['blocked', 'constrained', 'needs review', 'warning'].includes(normalized)) return 'warn';
  if (['failed', 'not approved yet', 'error'].includes(normalized)) return 'bad';
  return 'neutral';
}

function buildBaseData(input) {
  return {
    title: input.title || 'API Testing Executive Dashboard',
    subtitle: input.subtitle || '',
    reportFamily: input.reportFamily || 'execution',
    overallStatus: input.overallStatus || 'Needs review',
    runLabel: input.runLabel || '',
    generatedAt: input.generatedAt || new Date().toISOString(),
    summaryCards: input.summaryCards || [],
    findings: input.findings || [],
    nextActions: input.nextActions || [],
    metadata: input.metadata || [],
    sections: input.sections || [],
    links: input.links || [],
    caveats: input.caveats || [],
  };
}

function parseStatusSpreadFromExecutions(executions) {
  const counts = {};
  for (const execution of executions || []) {
    const code = execution?.response?.code;
    if (code === undefined || code === null) continue;
    counts[String(code)] = (counts[String(code)] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([code, count]) => ({ code, count }));
}

function buildFromNewman(data, args) {
  const run = data.run || data;
  const stats = run.stats || {};
  const requests = stats.requests?.total || 0;
  const assertions = stats.assertions?.total || 0;
  const failedAssertions = stats.assertions?.failed || 0;
  const failures = Array.isArray(run.failures) ? run.failures : [];
  const duration = (run.timings?.completed || 0) - (run.timings?.started || 0);
  const executions = Array.isArray(run.executions) ? run.executions : [];
  const slowest = executions
    .map((execution) => ({
      name: execution?.item?.name || execution?.cursor?.ref || 'Unnamed request',
      duration: execution?.response?.responseTime || 0,
      code: execution?.response?.code || 'n/a',
    }))
    .sort((left, right) => right.duration - left.duration)
    .slice(0, 8);
  const statusSpread = parseStatusSpreadFromExecutions(executions);
  const overallStatus = failures.length > 0 || failedAssertions > 0 ? 'Failed' : 'Passed';

  const findings = [];
  if (failedAssertions > 0) {
    findings.push({
      title: 'Assertion failures detected',
      severity: 'high',
      summary: `${formatNumber(failedAssertions)} assertion(s) failed across the Newman run.`,
      evidence: 'Derived from run.stats.assertions.failed and run.failures.',
    });
  }
  if (slowest[0]?.duration > 1000) {
    findings.push({
      title: 'Slowest request deserves review',
      severity: 'medium',
      summary: `${slowest[0].name} reached ${formatDurationMs(slowest[0].duration)}.`,
      evidence: 'Derived from run.executions[].response.responseTime.',
    });
  }
  if (statusSpread.length === 1 && statusSpread[0].code.startsWith('2')) {
    findings.push({
      title: 'Success-only status spread',
      severity: 'medium',
      summary: 'Observed responses show only success-path coverage in this run.',
      evidence: 'Derived from run.executions[].response.code.',
    });
  }

  return buildBaseData({
    title: args.title || 'Newman / Collection Execution Dashboard',
    subtitle: args.subtitle || 'Executive summary for API collection execution',
    reportFamily: 'newman',
    overallStatus,
    runLabel: args['run-label'] || '',
    summaryCards: [
      { label: 'Requests', value: formatNumber(requests), tone: 'info', note: 'Executed requests' },
      { label: 'Assertions', value: formatNumber(assertions), tone: failedAssertions > 0 ? 'bad' : 'good', note: `${formatNumber(failedAssertions)} failed` },
      { label: 'Failures', value: formatNumber(failures.length), tone: failures.length > 0 ? 'bad' : 'good', note: 'run.failures count' },
      { label: 'Duration', value: formatDurationMs(duration), tone: 'info', note: 'Total run duration' },
    ],
    findings,
    nextActions: [
      { priority: failures.length > 0 ? 'Do now' : 'Do next', owner: 'test asset', action: 'Review failed assertions and execution logs against traceability and env bindings.' },
      { priority: 'Do next', owner: 'report', action: 'Compare this run against curated verification findings before approval.' },
    ],
    metadata: [
      { label: 'Runner', value: 'Newman' },
      { label: 'Executions', value: formatNumber(executions.length) },
      { label: 'Overall status', value: overallStatus },
    ],
    sections: [
      {
        title: 'Status-code spread',
        type: 'table',
        columns: ['Status', 'Count'],
        rows: statusSpread.map((entry) => [entry.code, formatNumber(entry.count)]),
      },
      {
        title: 'Slowest requests',
        type: 'table',
        columns: ['Request', 'Status', 'Duration'],
        rows: slowest.map((entry) => [entry.name, String(entry.code), formatDurationMs(entry.duration)]),
      },
      {
        title: 'Failure notes',
        type: 'list',
        items: failures.length > 0
          ? failures.slice(0, 8).map((failure) => failure.error?.message || failure.source?.name || 'Unknown failure')
          : ['No Newman failures were recorded in the summary JSON.'],
      },
    ],
  });
}

function buildFromK6(data, args) {
  const metrics = data.metrics || {};
  const durationMetric = metrics.http_req_duration?.values || {};
  const requestMetric = metrics.http_reqs?.values || {};
  const failMetric = metrics.http_req_failed?.values || {};
  const checkMetric = metrics.checks?.values || {};
  const thresholdResults = [];

  for (const [metricName, metric] of Object.entries(metrics)) {
    for (const [thresholdName, result] of Object.entries(metric?.thresholds || {})) {
      thresholdResults.push({
        metric: metricName,
        threshold: thresholdName,
        ok: Boolean(result?.ok),
        actual: result?.actual ?? 'n/a',
      });
    }
  }

  const p95 = durationMetric['p(95)'] || durationMetric.p95 || 0;
  const errorPct = (failMetric.rate || failMetric.value || 0) * 100;
  const overallStatus = thresholdResults.some((item) => item.ok === false) || errorPct > 1 ? 'Constrained' : 'Passed';

  const findings = [];
  if (p95 > Number(args['threshold-p95'] || 1000)) {
    findings.push({
      title: 'p95 latency exceeds dashboard threshold',
      severity: 'medium',
      summary: `Observed p95 latency is ${formatDurationMs(p95)}.`,
      evidence: 'Derived from metrics.http_req_duration.values.',
    });
  }
  if (errorPct > Number(args['threshold-error-pct'] || 1)) {
    findings.push({
      title: 'Request failure rate exceeds dashboard threshold',
      severity: 'high',
      summary: `Observed request failure rate is ${formatNumber(errorPct, 2)}%.`,
      evidence: 'Derived from metrics.http_req_failed.values.',
    });
  }

  return buildBaseData({
    title: args.title || 'k6 Performance Dashboard',
    subtitle: args.subtitle || 'Executive summary for k6 workload execution',
    reportFamily: 'k6',
    overallStatus,
    runLabel: args['run-label'] || '',
    summaryCards: [
      { label: 'Requests', value: formatNumber(requestMetric.count || 0), tone: 'info', note: `${formatNumber(requestMetric.rate || 0, 2)} req/s` },
      { label: 'Error Rate', value: `${formatNumber(errorPct, 2)}%`, tone: errorPct > 1 ? 'bad' : 'good', note: 'http_req_failed' },
      { label: 'p95', value: formatDurationMs(p95), tone: p95 > Number(args['threshold-p95'] || 1000) ? 'warn' : 'good', note: 'http_req_duration' },
      { label: 'Checks', value: formatNumber(checkMetric.passes || 0), tone: 'info', note: `${formatNumber(checkMetric.fails || 0)} failed checks` },
    ],
    findings,
    nextActions: [
      { priority: 'Do now', owner: 'performance', action: 'Review threshold failures and validate whether the run is representative or constrained.' },
      { priority: 'Do next', owner: 'infra', action: 'If telemetry is missing, collect server-side evidence before claiming bottlenecks.' },
    ],
    metadata: [
      { label: 'Runner', value: 'k6' },
      { label: 'Overall status', value: overallStatus },
      { label: 'Generated metrics', value: formatNumber(Object.keys(metrics).length) },
    ],
    sections: [
      {
        title: 'Threshold results',
        type: 'table',
        columns: ['Metric', 'Threshold', 'OK', 'Actual'],
        rows: thresholdResults.length > 0
          ? thresholdResults.map((entry) => [entry.metric, entry.threshold, entry.ok ? 'Yes' : 'No', String(entry.actual)])
          : [['n/a', 'n/a', 'n/a', 'No thresholds were present in the summary JSON']],
      },
      {
        title: 'Metric highlights',
        type: 'table',
        columns: ['Metric', 'Value'],
        rows: [
          ['http_req_duration avg', formatDurationMs(durationMetric.avg || 0)],
          ['http_req_duration p99', formatDurationMs(durationMetric['p(99)'] || 0)],
          ['iterations', formatNumber(metrics.iterations?.values?.count || 0)],
          ['vus max', formatNumber(metrics.vus_max?.values?.max || metrics.vus_max?.values?.value || 0)],
        ],
      },
    ],
  });
}

function buildFromZap(data, args) {
  const sites = Array.isArray(data.site) ? data.site : [];
  const alerts = sites.flatMap((site) => site.alerts || data.alerts || []);
  const riskCounts = {};
  for (const alert of alerts) {
    const risk = String(alert.riskdesc || alert.risk || 'Informational').split(' ')[0];
    riskCounts[risk] = (riskCounts[risk] || 0) + 1;
  }
  const highRisk = (riskCounts.High || 0) + (riskCounts.Medium || 0);
  const overallStatus = highRisk > 0 ? 'Needs review' : 'Passed';

  return buildBaseData({
    title: args.title || 'ZAP Security Baseline Dashboard',
    subtitle: args.subtitle || 'Executive summary for passive security scan outputs',
    reportFamily: 'zap',
    overallStatus,
    runLabel: args['run-label'] || '',
    summaryCards: [
      { label: 'Alerts', value: formatNumber(alerts.length), tone: alerts.length > 0 ? 'warn' : 'good', note: 'Total alert records' },
      { label: 'High + Medium', value: formatNumber(highRisk), tone: highRisk > 0 ? 'bad' : 'good', note: 'Needs manual review' },
      { label: 'Sites', value: formatNumber(sites.length), tone: 'info', note: 'Scanned sites' },
      { label: 'Status', value: overallStatus, tone: badgeTone(overallStatus), note: 'Baseline posture' },
    ],
    findings: highRisk > 0
      ? [{ title: 'Material alerts require triage', severity: 'high', summary: `${formatNumber(highRisk)} alert(s) were classified as High or Medium risk.`, evidence: 'Derived from ZAP alert risk metadata.' }]
      : [{ title: 'No material passive alerts at baseline', severity: 'low', summary: 'Current JSON does not show High or Medium alerts.', evidence: 'Derived from ZAP alert risk metadata.' }],
    nextActions: [
      { priority: 'Do now', owner: 'security', action: 'Review High and Medium findings for false positives and environment constraints.' },
      { priority: 'Do next', owner: 'test asset', action: 'Document auth limitations or exclusions so the baseline remains reproducible.' },
    ],
    metadata: [
      { label: 'Runner', value: 'OWASP ZAP baseline' },
      { label: 'Overall status', value: overallStatus },
    ],
    sections: [
      {
        title: 'Risk distribution',
        type: 'table',
        columns: ['Risk', 'Count'],
        rows: Object.keys(riskCounts).length > 0
          ? Object.entries(riskCounts).map(([risk, count]) => [risk, formatNumber(count)])
          : [['Informational', '0']],
      },
      {
        title: 'Top alerts',
        type: 'table',
        columns: ['Alert', 'Risk', 'Instances'],
        rows: alerts.slice(0, 10).map((alert) => [
          alert.name || 'Unnamed alert',
          String(alert.riskdesc || alert.risk || 'Informational'),
          formatNumber(Array.isArray(alert.instances) ? alert.instances.length : 0),
        ]),
      },
    ],
    caveats: [
      'Passive baseline results are a starting point, not a full security approval.',
      'Complex authenticated surfaces may still need manual validation.',
    ],
  });
}

function pickNumber(record, keys, fallback = 0) {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  }
  return fallback;
}

function normalizeJMeterStats(data) {
  const entries = [];
  if (Array.isArray(data)) {
    for (const item of data) if (item && typeof item === 'object') entries.push(item);
  } else if (data && typeof data === 'object') {
    for (const [label, value] of Object.entries(data)) {
      if (value && typeof value === 'object') entries.push({ label, ...value });
    }
  }
  const normalized = entries.map((entry) => ({
    label: entry.label || entry.transaction || entry.name || entry.sampleLabel || 'Unnamed',
    sampleCount: pickNumber(entry, ['sampleCount', 'samplesCount', 'count', 'samples', 'n']),
    errorCount: pickNumber(entry, ['errorCount', 'errors', 'ko']),
    errorPct: pickNumber(entry, ['errorPct', 'errorPercentage', 'pctError', 'errorRate'], 0),
    avg: pickNumber(entry, ['meanResTime', 'avg', 'average', 'mean', 'avgResponseTime']),
    p95: pickNumber(entry, ['pct2ResTime', 'p95', 'perc95', 'percentile95']),
    p99: pickNumber(entry, ['pct3ResTime', 'p99', 'perc99', 'percentile99']),
    max: pickNumber(entry, ['maxResTime', 'max']),
    throughput: pickNumber(entry, ['throughput', 'tps', 'requestsPerSecond']),
  })).filter((entry) => entry.sampleCount > 0 || entry.avg > 0 || entry.throughput > 0);
  const overall = normalized.find((entry) => /^(total|all|overall)$/i.test(entry.label)) || normalized[0] || {
    label: 'Total', sampleCount: 0, errorPct: 0, avg: 0, p95: 0, p99: 0, max: 0, throughput: 0,
  };
  const transactions = normalized.filter((entry) => entry !== overall && !/^(total|all|overall)$/i.test(entry.label));
  return { overall, transactions };
}

function buildFromJMeter(data, args) {
  const { overall, transactions } = normalizeJMeterStats(data);
  const thresholdP95 = Number(args['threshold-p95'] || 1000);
  const thresholdErrorPct = Number(args['threshold-error-pct'] || 1);
  const highRisk = transactions.filter((entry) => entry.p95 > thresholdP95 || entry.errorPct > thresholdErrorPct);
  const overallStatus = overall.errorPct > thresholdErrorPct || overall.p95 > thresholdP95 ? 'Constrained' : 'Passed';
  return buildBaseData({
    title: args.title || 'JMeter Executive Dashboard',
    subtitle: args.subtitle || 'Executive summary for JMeter performance execution',
    reportFamily: 'jmeter',
    overallStatus,
    runLabel: args['run-label'] || '',
    summaryCards: [
      { label: 'Samples', value: formatNumber(overall.sampleCount), tone: 'info', note: 'Loaded samples' },
      { label: 'Average', value: formatDurationMs(overall.avg), tone: 'info', note: 'Mean response time' },
      { label: 'p95', value: formatDurationMs(overall.p95), tone: overall.p95 > thresholdP95 ? 'warn' : 'good', note: `Threshold ${formatNumber(thresholdP95)} ms` },
      { label: 'Error %', value: `${formatNumber(overall.errorPct, 2)}%`, tone: overall.errorPct > thresholdErrorPct ? 'bad' : 'good', note: `Threshold ${formatNumber(thresholdErrorPct, 2)}%` },
      { label: 'Throughput', value: `${formatNumber(overall.throughput, 2)} req/s`, tone: 'info', note: 'Observed throughput' },
    ],
    findings: highRisk.slice(0, 5).map((entry) => ({
      title: `${entry.label} needs review`,
      severity: entry.errorPct > thresholdErrorPct ? 'high' : 'medium',
      summary: `p95 ${formatDurationMs(entry.p95)}, error ${formatNumber(entry.errorPct, 2)}%.`,
      evidence: 'Derived from standard JMeter statistics output.',
    })),
    nextActions: [
      { priority: 'Do now', owner: 'performance', action: 'Investigate the highest-latency and highest-error transactions first.' },
      { priority: 'Do next', owner: 'report', action: 'Cross-check threshold sources before using them as approval criteria.' },
    ],
    metadata: [
      { label: 'Runner', value: 'JMeter' },
      { label: 'Transactions', value: formatNumber(transactions.length) },
      { label: 'Overall status', value: overallStatus },
    ],
    sections: [
      {
        title: 'Transaction breakdown',
        type: 'table',
        columns: ['Label', 'Samples', 'Avg', 'p95', 'p99', 'Error %', 'Throughput'],
        rows: transactions.map((entry) => [
          entry.label,
          formatNumber(entry.sampleCount),
          formatDurationMs(entry.avg),
          formatDurationMs(entry.p95),
          formatDurationMs(entry.p99),
          `${formatNumber(entry.errorPct, 2)}%`,
          `${formatNumber(entry.throughput, 2)} req/s`,
        ]),
      },
      {
        title: 'Focus areas',
        type: 'list',
        items: highRisk.length > 0
          ? highRisk.slice(0, 8).map((entry) => `${entry.label}: p95 ${formatDurationMs(entry.p95)}, error ${formatNumber(entry.errorPct, 2)}%`)
          : ['No transactions exceeded the current dashboard thresholds.'],
      },
    ],
  });
}

function renderHtml(data) {
  const summaryCards = (data.summaryCards || []).map((card) => `
    <div class="card tone-${escapeHtml(card.tone || 'neutral')}">
      <div class="card-label">${escapeHtml(card.label)}</div>
      <div class="card-value">${escapeHtml(card.value)}</div>
      ${card.note ? `<div class="card-note">${escapeHtml(card.note)}</div>` : ''}
    </div>`).join('');

  const findings = (data.findings || []).map((finding, index) => `
    <div class="finding severity-${escapeHtml(finding.severity || 'medium')}">
      <div class="finding-title">${index + 1}. ${escapeHtml(finding.title)}</div>
      <div class="finding-summary">${escapeHtml(finding.summary || '')}</div>
      ${finding.evidence ? `<div class="finding-evidence">Evidence: ${escapeHtml(finding.evidence)}</div>` : ''}
    </div>`).join('') || '<div class="empty">No findings recorded.</div>';

  const nextActions = (data.nextActions || []).map((item) => `
    <li><strong>${escapeHtml(item.priority || 'Next')}:</strong> ${escapeHtml(item.action || '')}${item.owner ? ` <span class="owner">(${escapeHtml(item.owner)})</span>` : ''}</li>`).join('') || '<li>No follow-up actions recorded.</li>';

  const metadata = (data.metadata || []).map((item) => `
    <div class="meta-row"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('');

  const sections = (data.sections || []).map((section, index) => {
    if (section.type === 'table') {
      const header = (section.columns || []).map((column) => `<th>${escapeHtml(column)}</th>`).join('');
      const rows = (section.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${section.columns?.length || 1}">No rows available.</td></tr>`;
      return `<details class="section" ${index < 2 ? 'open' : ''}><summary>${escapeHtml(section.title)}</summary><div class="section-body"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div></details>`;
    }
    if (section.type === 'list') {
      const items = (section.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
      return `<details class="section" ${index < 2 ? 'open' : ''}><summary>${escapeHtml(section.title)}</summary><div class="section-body"><ul>${items}</ul></div></details>`;
    }
    return `<details class="section" ${index < 2 ? 'open' : ''}><summary>${escapeHtml(section.title)}</summary><div class="section-body"><p>${escapeHtml(section.text || '')}</p></div></details>`;
  }).join('');

  const caveats = (data.caveats || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const links = (data.links || []).map((link) => `<li><a href="${escapeHtml(link.href || '#')}">${escapeHtml(link.label || link.href || '')}</a></li>`).join('');
  const statusClass = `status-${badgeTone(data.overallStatus)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.title)}</title>
  <style>
    :root {
      --bg: #0b1220; --panel: #121b2d; --panel2:#172235; --text:#eff6ff; --muted:#96a4bf; --border:rgba(255,255,255,.08);
      --good:#22c55e; --warn:#f59e0b; --bad:#ef4444; --info:#60a5fa; --shadow:0 14px 40px rgba(0,0,0,.25);
    }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, Arial, sans-serif; background: radial-gradient(circle at top left, #162547 0%, var(--bg) 45%); color:var(--text); }
    .wrap { max-width: 1380px; margin: 0 auto; padding: 28px; }
    .hero, .panel, .section { background: rgba(18,27,45,.92); border:1px solid var(--border); border-radius: 22px; box-shadow: var(--shadow); }
    .hero { padding: 28px; margin-bottom: 20px; }
    .hero-top { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; flex-wrap:wrap; }
    h1 { margin:0 0 8px; font-size: 34px; }
    .subtitle { color: var(--muted); max-width: 860px; }
    .status-badge { padding: 10px 16px; border-radius: 999px; font-weight: 700; font-size: 14px; }
    .status-good { background: rgba(34,197,94,.14); color: #9df2b4; }
    .status-warn { background: rgba(245,158,11,.14); color: #ffd184; }
    .status-bad { background: rgba(239,68,68,.14); color: #ffb0b0; }
    .status-neutral { background: rgba(148,163,184,.14); color: #d5deee; }
    .cards { display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-top: 22px; }
    .card { padding: 18px; border-radius: 18px; border:1px solid var(--border); background: rgba(23,34,53,.92); }
    .card-label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .card-value { font-size: 30px; font-weight: 800; margin-top: 10px; }
    .card-note { color: var(--muted); font-size: 12px; margin-top: 8px; }
    .tone-good .card-value { color: #8df0b4; }
    .tone-warn .card-value { color: #ffd184; }
    .tone-bad .card-value { color: #ffb0b0; }
    .tone-info .card-value { color: #9dc3ff; }
    .layout { display:grid; grid-template-columns: 2fr 1fr; gap: 18px; margin-bottom: 18px; }
    .panel { padding: 22px; }
    .panel h2 { margin-top: 0; font-size: 22px; }
    .finding { border-left: 4px solid var(--info); background: rgba(255,255,255,.02); border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
    .finding.severity-high { border-left-color: var(--bad); }
    .finding.severity-medium { border-left-color: var(--warn); }
    .finding.severity-low { border-left-color: var(--good); }
    .finding-title { font-weight: 700; margin-bottom: 6px; }
    .finding-summary, .finding-evidence, .meta-row, li { color: var(--muted); }
    .finding-evidence { font-size: 12px; margin-top: 8px; }
    .meta-row { display:flex; justify-content:space-between; gap:12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
    .meta-row:last-child { border-bottom: none; }
    .owner { color: var(--text); }
    details.section { margin-bottom: 14px; }
    details.section summary { list-style: none; cursor: pointer; padding: 18px 20px; font-weight: 700; }
    details.section summary::-webkit-details-marker { display: none; }
    details.section .section-body { padding: 0 20px 20px; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding: 12px 10px; border-bottom:1px solid rgba(255,255,255,.06); text-align:left; vertical-align: top; }
    th { color:#d8e5ff; font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
    td { color:var(--muted); }
    ul { margin: 0; padding-left: 18px; }
    .footer { color: var(--muted); font-size: 12px; text-align:center; margin-top: 18px; }
    .empty { color: var(--muted); }
    a { color: #9dc3ff; }
    @media (max-width: 980px) { .layout { grid-template-columns: 1fr; } .wrap { padding: 16px; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="hero-top">
        <div>
          <h1>${escapeHtml(data.title)}</h1>
          ${data.subtitle ? `<div class="subtitle">${escapeHtml(data.subtitle)}</div>` : ''}
        </div>
        <div class="status-badge ${statusClass}">${escapeHtml(data.overallStatus)}</div>
      </div>
      <div class="cards">${summaryCards}</div>
    </div>
    <div class="layout">
      <div class="panel">
        <h2>Top Findings</h2>
        ${findings}
      </div>
      <div class="panel">
        <h2>Run Context</h2>
        ${metadata}
        <h2 style="margin-top:24px;">Next Actions</h2>
        <ul>${nextActions}</ul>
        ${caveats ? `<h2 style="margin-top:24px;">Limitations</h2><ul>${caveats}</ul>` : ''}
        ${links ? `<h2 style="margin-top:24px;">Links</h2><ul>${links}</ul>` : ''}
      </div>
    </div>
    ${sections}
    <div class="footer">Generated ${escapeHtml(data.generatedAt)} · Dashboard derived from evidence-backed report data</div>
  </div>
</body>
</html>`;
}

function buildMarkdown(data) {
  const lines = [];
  lines.push(`# ${data.title}`);
  lines.push('');
  if (data.subtitle) {
    lines.push(data.subtitle);
    lines.push('');
  }
  lines.push(`- **Status**: ${data.overallStatus}`);
  if (data.runLabel) lines.push(`- **Run Label**: ${data.runLabel}`);
  lines.push(`- **Generated At**: ${data.generatedAt}`);
  lines.push('');
  if (data.summaryCards?.length) {
    lines.push('## Summary');
    for (const card of data.summaryCards) {
      lines.push(`- **${card.label}**: ${card.value}${card.note ? ` — ${card.note}` : ''}`);
    }
    lines.push('');
  }
  if (data.findings?.length) {
    lines.push('## Top Findings');
    for (const finding of data.findings) {
      lines.push(`- **${finding.title}**: ${finding.summary}${finding.evidence ? ` Evidence: ${finding.evidence}` : ''}`);
    }
    lines.push('');
  }
  if (data.nextActions?.length) {
    lines.push('## Next Actions');
    for (const action of data.nextActions) {
      lines.push(`- **${action.priority || 'Next'}**: ${action.action}${action.owner ? ` (${action.owner})` : ''}`);
    }
    lines.push('');
  }
  for (const section of data.sections || []) {
    lines.push(`## ${section.title}`);
    if (section.type === 'table') {
      const columns = section.columns || [];
      lines.push(`| ${columns.join(' | ')} |`);
      lines.push(`| ${columns.map(() => '---').join(' | ')} |`);
      for (const row of section.rows || []) lines.push(`| ${row.join(' | ')} |`);
    } else if (section.type === 'list') {
      for (const item of section.items || []) lines.push(`- ${item}`);
    } else if (section.text) {
      lines.push(section.text);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

function outputPaths(args) {
  const outputDir = args['output-dir'] || '';
  return {
    html: args['output-html'] || (outputDir ? path.join(outputDir, 'dashboard.html') : ''),
    data: args['output-data'] || (outputDir ? path.join(outputDir, 'dashboard-data.json') : ''),
    md: args['output-md'] || (outputDir ? path.join(outputDir, '00_index.md') : ''),
  };
}

function buildDataByMode(mode, input, args) {
  if (mode === 'newman') return buildFromNewman(input, args);
  if (mode === 'k6') return buildFromK6(input, args);
  if (mode === 'zap') return buildFromZap(input, args);
  if (mode === 'jmeter') return buildFromJMeter(input, args);
  if (mode === 'generic') return buildBaseData(input);
  throw new Error(`Unsupported mode: ${mode}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0] || 'help';
  if (command === 'help' || command === '--help') {
    console.log(usage());
    process.exit(0);
  }

  const inputPath = args.input;
  if (!inputPath) {
    console.error('Missing required --input');
    console.error(usage());
    process.exit(1);
  }
  const input = readJson(inputPath);
  let dashboardData;
  if (command === 'render') {
    dashboardData = buildBaseData(input);
  } else if (command === 'build') {
    const mode = args.mode || 'generic';
    dashboardData = buildDataByMode(mode, input, args);
  } else {
    console.error(`Unknown command: ${command}`);
    console.error(usage());
    process.exit(1);
  }

  const paths = outputPaths(args);
  const html = renderHtml(dashboardData);
  const markdown = buildMarkdown(dashboardData);
  if (paths.data) writeText(paths.data, `${JSON.stringify(dashboardData, null, 2)}\n`);
  if (paths.html) writeText(paths.html, html);
  if (paths.md) writeText(paths.md, markdown);

  if (paths.html) console.log(`Dashboard written to ${paths.html}`);
  if (paths.data) console.log(`Dashboard data written to ${paths.data}`);
  if (paths.md) console.log(`Markdown summary written to ${paths.md}`);
}

main();