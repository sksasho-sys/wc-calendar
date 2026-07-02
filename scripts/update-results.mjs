#!/usr/bin/env node
/**
 * update-results.mjs  (v5 — API-Football source)
 * ---------------------------------------------------------------
 * Patches the single self-contained index.html directly with match
 * results fetched from API-Football (api-sports.io direct).
 *
 * Handles regular / extra-time / penalty results. Matches teams to
 * the HTML by name, with a canonical fallback for spelling variants
 * (e.g. "Bosnia & Herzegovina" -> "Bosnia & Herz.").
 *
 * Env: API_FOOTBALL_KEY
 * Run: API_FOOTBALL_KEY=xxx node scripts/update-results.mjs
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
const DASH = '\u2013';

// Explicit overrides where canonicalisation can't bridge the gap.
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

function formatResult(fx) {
  const st = fx.fixture.status.short;
  if (!['FT', 'AET', 'PEN'].includes(st)) return null;
  const g = fx.goals;
  if (g.home == null || g.away == null) return null;
  const score = fx.score;

  if (st === 'PEN') {
    const ft = score.fulltime || {};
    const pen = score.penalty || {};
    const base = (ft.home != null && ft.away != null)
      ? `${ft.home}${DASH}${ft.away}` : `${g.home}${DASH}${g.away}`;
    if (pen.home != null && pen.away != null) return `${base} (${pen.home}${DASH}${pen.away} pens)`;
    return base;
  }
  if (st === 'AET') return `${g.home}${DASH}${g.away} (AET)`;
  return `${g.home}${DASH}${g.away}`;
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function main() {
  console.log('Fetching World Cup fixtures from API-Football...');
  const res = await fetch(`${BASE}/fixtures?league=${LEAGUE}&season=${SEASON}`, {
    headers: { 'x-apisports-key': KEY },
  });
  if (!res.ok) throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  const fixtures = json.response || [];
  console.log(`Fetched ${fixtures.length} fixtures.`);

  let html = fs.readFileSync(HTML_FILE, 'utf8');
  const htmlByCanonical = extractHtmlTeams(html);
  let updatedCount = 0;

  for (const fx of fixtures) {
    const newResult = formatResult(fx);
    if (!newResult) continue; // not finished

    const home = toHtmlName(fx.teams.home.name, htmlByCanonical);
    const away = toHtmlName(fx.teams.away.name, htmlByCanonical);

    const pattern = new RegExp(
      '(home:`' + escapeRegex(home) + '`,away:`' + escapeRegex(away) + '`,diff:\\d+,result:)(null|`[^`]*`)'
    );
    const found = html.match(pattern);
    if (!found) continue;

    const currentResult = found[2] === 'null' ? null : found[2].slice(1, -1);
    if (currentResult === newResult) continue;

    html = html.replace(pattern, '$1`' + newResult + '`');
    updatedCount++;
    console.log(`Updated: ${home} vs ${away} -> ${newResult}`);
  }

  if (updatedCount > 0) fs.writeFileSync(HTML_FILE, html, 'utf8');
  console.log(`Done. ${updatedCount} match result(s) updated in index.html.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
