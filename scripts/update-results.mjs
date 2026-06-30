#!/usr/bin/env node
/**
 * update-results.mjs  (v2 — patches index.html directly)
 * ---------------------------------------------------------------
 * The site is a single self-contained index.html with all match
 * data hardcoded inside it (minified, using backtick-delimited
 * fields like  home:`Brazil`,away:`Japan`,...,result:null ).
 *
 * This script:
 *   1. Fetches latest World Cup results from football-data.org
 *   2. Finds each match inside index.html by home/away team names
 *   3. Replaces result:null  ->  result:`2–1`  for finished matches
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

// football-data.org -> our index.html team-name spelling
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

function formatResult(match) {
  if (match.status !== 'FINISHED') return null;
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;
  if (home == null || away == null) return null;
  return `${home}–${away}`; // en dash, matching the site's existing style
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
    if (!newResult) continue; // not finished yet

    // Find this exact match in the HTML by its home/away pair, and replace
    // its result field (whether currently null or an old score).
    // Pattern: home:`Brazil`,away:`Japan`,diff:N,result:<null or `x`>
    const pattern = new RegExp(
      '(home:`' + escapeRegex(home) + '`,away:`' + escapeRegex(away) + '`,diff:\\d+,result:)(null|`[^`]*`)'
    );

    const match = html.match(pattern);
    if (!match) continue; // this fixture not present in the HTML (e.g. knockout placeholder)

    const currentResult = match[2] === 'null' ? null : match[2].slice(1, -1);
    if (currentResult === newResult) continue; // already correct

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
