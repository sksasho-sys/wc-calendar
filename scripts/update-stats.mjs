#!/usr/bin/env node
/**
 * update-stats.mjs — bakes team stats into index.html for inline display.
 * ---------------------------------------------------------------
 * Source: API-Football (api-sports.io direct).
 * Per team, writes into  window.__WC_STATS__ :
 *   - cleanSheetPct   (clean_sheet.total / fixtures.played.total)
 *   - xgForAvg        (average expected_goals across finished games)
 *
 * The inline card UI reads these two values (labels "CS" and "xG").
 *
 * Env: API_FOOTBALL_KEY
 * ---------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_FILE = path.join(__dirname, '..', 'index.html');

const KEY = process.env.API_FOOTBALL_KEY;
if (!KEY) { console.error('Missing API_FOOTBALL_KEY environment variable.'); process.exit(1); }

const BASE = 'https://v3.football.api-sports.io';
const LEAGUE = 1;
const SEASON = 2026;
const HEADERS = { 'x-apisports-key': KEY };
const FINISHED = new Set(['FT', 'AET', 'PEN']);

const NAME_OVERRIDES = {
  'United States': 'USA',
  'Korea Republic': 'South Korea',
  'Czech Republic': 'Czechia',
};

function canonical(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\band\b/g, ' ').replace(/[&\-.'']/g, ' ')
    .replace(/[^a-z ]/g, '').replace(/\s+/g, '');
}

function extractHtmlTeams(html) {
  const names = new Set();
  const re = /home:`([^`]*)`,away:`([^`]*)`/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    for (const n of [m[1], m[2]]) {
      if (n && !/^(TBD|Best 3rd|Winner |Runner-up )/.test(n)) names.add(n);
    }
  }
  const byC = new Map();
  for (const n of names) byC.set(canonical(n), n);
  return byC;
}

function toHtmlName(apiName, htmlByCanonical) {
  if (NAME_OVERRIDES[apiName]) return NAME_OVERRIDES[apiName];
  const c = canonical(apiName);
  if (htmlByCanonical.has(c)) return htmlByCanonical.get(c);
  for (const [hc, hn] of htmlByCanonical) {
    const short = c.length < hc.length ? c : hc;
    const long = c.length < hc.length ? hc : c;
    if (short.length >= 4 && long.startsWith(short)) return hn;
  }
  return apiName;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function api(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`API ${endpoint}: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return json.response;
}

async function main() {
  const html = fs.readFileSync(HTML_FILE, 'utf8');
  const htmlByCanonical = extractHtmlTeams(html);

  console.log('Fetching fixtures...');
  const fixtures = await api(`/fixtures?league=${LEAGUE}&season=${SEASON}`);
  console.log(`  ${fixtures.length} fixtures.`);

  // Build team id -> htmlName from the fixtures (single source of truth for IDs)
  const teams = new Map();
  for (const f of fixtures) {
    for (const side of ['home', 'away']) {
      const t = f.teams[side];
      if (t?.id && !teams.has(t.id)) {
        teams.set(t.id, toHtmlName(t.name, htmlByCanonical));
      }
    }
  }
  console.log(`  ${teams.size} teams.`);

  const stats = {};
  for (const htmlName of teams.values()) {
    if (!stats[htmlName]) stats[htmlName] = { cleanSheetPct: null, xgForAvg: null, _xgSum: 0, _xgN: 0 };
  }

  // 1) Clean sheet % from /teams/statistics (one call per team)
  console.log('Fetching team statistics (clean sheet %)...');
  for (const [id, htmlName] of teams) {
    await sleep(150);
    try {
      const r = await api(`/teams/statistics?league=${LEAGUE}&season=${SEASON}&team=${id}`);
      const played = r?.fixtures?.played?.total || 0;
      const cs = r?.clean_sheet?.total || 0;
      stats[htmlName].cleanSheetPct = played ? Math.round((cs / played) * 100) : null;
    } catch (e) {
      console.warn(`  team ${htmlName} stats failed: ${e.message}`);
    }
  }

  // 2) Average xG from /fixtures/statistics for each finished fixture
  //    (one call per fixture returns both teams' stat blocks)
  const finishedFixtures = fixtures.filter(f => FINISHED.has(f.fixture.status.short));
  console.log(`Fetching xG for ${finishedFixtures.length} finished fixtures...`);
  for (const f of finishedFixtures) {
    await sleep(150);
    try {
      const blocks = await api(`/fixtures/statistics?fixture=${f.fixture.id}`);
      if (!Array.isArray(blocks)) continue;
      for (const block of blocks) {
        const htmlName = teams.get(block.team?.id);
        if (!htmlName || !stats[htmlName]) continue;
        const row = (block.statistics || []).find(s => s.type === 'expected_goals');
        if (row && row.value != null) {
          stats[htmlName]._xgSum += parseFloat(row.value);
          stats[htmlName]._xgN += 1;
        }
      }
    } catch (e) {
      console.warn(`  fixture ${f.fixture.id} xG failed: ${e.message}`);
    }
  }

  // Finalize averages, strip temp fields
  for (const name in stats) {
    const s = stats[name];
    s.xgForAvg = s._xgN ? +(s._xgSum / s._xgN).toFixed(2) : null;
    delete s._xgSum; delete s._xgN;
  }

  // Inject/replace window.__WC_STATS__ in index.html
  const payload = `<script>window.__WC_STATS__=${JSON.stringify(stats)};</script>`;
  let out = html;
  const existing = /<script>window\.__WC_STATS__=[\s\S]*?<\/script>/;
  if (existing.test(out)) {
    out = out.replace(existing, payload);
  } else {
    out = out.replace('</body>', `${payload}</body>`);
  }
  fs.writeFileSync(HTML_FILE, out, 'utf8');

  const withCS = Object.values(stats).filter(s => s.cleanSheetPct != null).length;
  const withXG = Object.values(stats).filter(s => s.xgForAvg != null).length;
  console.log(`Done. ${Object.keys(stats).length} teams; ${withCS} with CS%, ${withXG} with xG.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
