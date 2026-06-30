#!/usr/bin/env node
/**
 * update-results.mjs  (v3 — handles regular, extra-time & penalty results)
 * ---------------------------------------------------------------
 * The site is a single self-contained index.html with all match
 * data hardcoded inside it (minified, backtick-delimited fields
 * like  home:`Brazil`,away:`Japan`,...,result:null ).
 *
 * This script:
 *   1. Fetches latest World Cup results from football-data.org
 *   2. Finds each match inside index.html by home/away team names
 *   3. Writes the correct result string, including extra-time and
 *      penalty-shootout breakdowns for knockout games:
 *        - Regular:        2-0   (shown with en dash)
 *        - Extra time:     2-1 (AET)
 *        - Penalties:      1-1 (3-4 pens)
 *
 * No Vite, no build, no data.ts. The file it edits IS the live site.
 *
 * Run:  FOOTBALL_DATA_API_KEY=xxx node scripts/update-results.mjs
 * ---------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_FILE = path.join(__dirname, '..', 'index.html');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('Missing FOOTBALL_DATA_API_KEY environment variable.');
  process.exit(1);
}

const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches';

const TEAM_NAME_MAP = {
  'Korea Republic': 'South Korea',
  "Côte d'Ivoire": 'Ivory Coast',
  'IR Iran': 'Iran',
  'United States': 'USA',
  'Cabo Verde': 'Cape Verde',
  'Bosnia and Herzegovina': 'Bosnia & Herz.',
  'Congo DR': 'DR Congo',
};
function normalizeTeamName(name) {
  return TEAM_NAME_MAP[name] || name;
}

async function fetchMatches() {
  const res = await fetch(API_URL, { headers: { 'X-Auth-Token': API_KEY } });
  if (!res.ok) {
    throw new Error(`football-data.org API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.matches || [];
}

const DASH = '\u2013'; // en dash, matching the site's existing style

function formatResult(match) {
  if (match.status !== 'FINISHED') return null;
  const score = match.score || {};
  const ft = score.fullTime || {};
  const h = ft.home;
  const a = ft.away;
  if (h == null || a == null) return null;

  const duration = score.duration || 'REGULAR';

  if (duration === 'EXTRA_TIME') {
    return `${h}${DASH}${a} (AET)`;
  }

  if (duration === 'PENALTY_SHOOTOUT') {
    const pens = score.penalties || {};
    const ph = pens.home;
    const pa = pens.away;
    if (ph != null && pa != null) {
      return `${h}${DASH}${a} (${ph}${DASH}${pa} pens)`;
    }
    return `${h}${DASH}${a}`;
  }

  return `${h}${DASH}${a}`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
  console.log('Fetching FIFA World Cup 2026 matches from football-data.org...');
  const apiMatches = await fetchMatches();
  console.log(`Fetched ${apiMatches.length} matches.`);

  let html = fs.readFileSync(HTML_FILE, 'utf8');
  let updatedCount = 0;

  for (const m of apiMatches) {
    const home = normalizeTeamName(m.homeTeam?.name || '');
    const away = normalizeTeamName(m.awayTeam?.name || '');
    if (!home || !away) continue;

    const newResult = formatResult(m);
    if (!newResult) continue;

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

  if (updatedCount > 0) {
    fs.writeFileSync(HTML_FILE, html, 'utf8');
  }
  console.log(`Done. ${updatedCount} match result(s) updated in index.html.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
