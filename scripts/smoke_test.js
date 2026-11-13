/**
 * PROMPT AGENT — smoke test (no external services, no credentials needed).
 *
 * Validates the importable n8n workflow and the environment template:
 *  1. workflows/n8n_workflow_PROMPT_AGENT_v1.json parses as JSON.
 *  2. The expected nodes exist, with the expected types
 *     (schedule trigger, Gemini model, the 3 agent nodes, QA code node,
 *     Notion sync, Telegram approval).
 *  3. Every connection target references a node that exists.
 *  4. .env.example documents the keys the workflow needs.
 *
 * Connection source keys that are node IDs instead of node names are
 * reported as WARNINGS (n8n keys connections by node name; verify on
 * import) — they do not fail the test.
 *
 * Usage: npm test   (or: node scripts/smoke_test.js)
 * Exit code 0 = all checks passed; 1 = a check failed.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const WORKFLOW_PATH = path.join(ROOT, 'workflows', 'n8n_workflow_PROMPT_AGENT_v1.json');
const ENV_EXAMPLE_PATH = path.join(ROOT, '.env.example');

const failures = [];
const warnings = [];
let checks = 0;

function check(label, ok, detail) {
  checks += 1;
  if (ok) {
    console.log(`  PASS  ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function warn(label, detail) {
  warnings.push(label);
  console.log(`  WARN  ${label}${detail ? ` — ${detail}` : ''}`);
}

function readFile(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    check(label, false, `cannot read ${path.relative(ROOT, filePath)}: ${err.message}`);
    return null;
  }
}

// --- 1. Workflow JSON parses -------------------------------------------------
const workflowRaw = readFile(WORKFLOW_PATH, 'workflow file is readable');
let workflow = null;
if (workflowRaw !== null) {
  try {
    workflow = JSON.parse(workflowRaw);
    check('workflow JSON parses', true);
  } catch (err) {
    check('workflow JSON parses', false, err.message);
  }
}

// --- 2. Expected nodes exist, with expected types ---------------------------
const EXPECTED_NODES = [
  ['Trigger Semanal (Viernes 4:00 PM)', 'n8n-nodes-base.scheduleTrigger'],
  ['Google Gemini 3 Pro (API)', '@n8n/n8n-nodes-langchain.lmChatGoogleGemini'],
  ['1. AI Research Agent', '@n8n/n8n-nodes-langchain.agent'],
  ['3A. Content Factory (Multicanal)', '@n8n/n8n-nodes-langchain.agent'],
  ['3B. Video Director (60s Package)', '@n8n/n8n-nodes-langchain.agent'],
  ['4. Editorial QA & Consolidation', 'n8n-nodes-base.code'],
  ['5A. Notion Database Sync', 'n8n-nodes-base.notion'],
  ['5B. Human Approval Alert (Telegram / Slack)', 'n8n-nodes-base.telegram'],
];

if (workflow !== null) {
  const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
  check('workflow has 10 nodes', nodes.length === 10, `found ${nodes.length}`);
  const byName = new Map(nodes.map((n) => [n.name, n]));
  for (const [name, type] of EXPECTED_NODES) {
    const node = byName.get(name);
    check(
      `node exists: ${name}`,
      node !== undefined && node.type === type,
      node === undefined ? 'missing' : `wrong type: ${node.type}`,
    );
  }
  const agentNodes = nodes.filter((n) => n.type === '@n8n/n8n-nodes-langchain.agent');
  check('workflow has exactly 3 agent nodes', agentNodes.length === 3, `found ${agentNodes.length}`);

  // --- 3. Every connection target references an existing node ---------------
  const connections = workflow.connections && typeof workflow.connections === 'object'
    ? workflow.connections
    : {};
  const nodeNames = new Set(nodes.map((n) => n.name));
  let targetCount = 0;
  let missingTargets = [];
  for (const [source, outputs] of Object.entries(connections)) {
    if (!nodeNames.has(source)) {
      warn(
        `connection source is a node ID, not a node name: ${source}`,
        'n8n keys connections by node name — verify this link survives import',
      );
    }
    for (const outputList of Object.values(outputs)) {
      for (const connectionList of outputList) {
        for (const target of connectionList) {
          targetCount += 1;
          if (!nodeNames.has(target.node)) missingTargets.push(`${source} -> ${target.node}`);
        }
      }
    }
  }
  check(
    `all ${targetCount} connection targets resolve to existing nodes`,
    missingTargets.length === 0,
    missingTargets.join('; '),
  );
}

// --- 4. .env.example documents the required keys ---------------------------
const REQUIRED_ENV_KEYS = [
  'GEMINI_API_KEY',
  'NOTION_API_TOKEN',
  'NOTION_DATABASE_ID',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
];

const envExample = readFile(ENV_EXAMPLE_PATH, '.env.example is readable');
if (envExample !== null) {
  for (const key of REQUIRED_ENV_KEYS) {
    check(`.env.example documents ${key}`, new RegExp(`^${key}=`, 'm').test(envExample));
  }
}

// --- Summary ----------------------------------------------------------------
console.log('');
console.log(`Smoke test: ${checks - failures.length}/${checks} checks passed.`);
if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length} (see above; verify on n8n import).`);
}
if (failures.length > 0) {
  console.log(`Failures: ${failures.length}`);
  process.exit(1);
}
console.log('OK — workflow file and environment template are consistent.');
