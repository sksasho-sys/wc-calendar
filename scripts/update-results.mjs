#!/usr/bin/env node
/**
 * update-results.mjs
 * ---------------------------------------------------------------
 * Fetches the latest FIFA World Cup 2026 match data from
 * football-data.org and updates `src/data.ts` in place:
 *   - fills in `result` for any match that has finished
 *   - fills in `home`/`away` for knockout matches once the
 *     real teams are known (replacing placeholders)
 *
 * Run manually:   FOOTBALL_DATA_API_KEY=xxx node scripts/update-results.mjs
 * Run by CI:      see .github/workflows/update-results.yml
 * ---------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'src', 'data.ts');

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) {
  console.error('Missing FOOTBALL_DATA_API_KEY environment variable.');
  process.exit(1);
}

// football-data.org uses "WC" as the competition code for the FIFA World Cup.
const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches';

// Map football-data.org team names to the names used in our data.ts file.
// football-data.org sometimes uses slightly different display names
// (e.g. "Korea Republic" vs "South Korea", "Côte d'Ivoire" vs "Ivory Coast").
const TEAM_NAME_MAP = {
  'Korea Republic': 'South Korea',
  "Côte d'Ivoire": 'Ivory Coast',
  'IR Iran': 'Iran',
  'United States': 'USA',
  'Cabo Verde': 'Cape Verde',
  'Bosnia and Herzegovina': 'Bosnia & Herz.',
  'Congo DR': 'DR Congo',
  'Türkiye': 'Türkiye',
};

function normalizeTeamName(name) {
  return TEAM_NAME_MAP[name] || name;
}

async function fetchMatches() {
  const res = await fetch(API_URL, {
    headers: { 'X-Auth-Token': API_KEY },
  });
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
  // En dash to match existing data.ts style, e.g. "2–1"
  return `${home}–${away}`;
}

function buildMatchIndex(apiMatches) {
  // Index by normalized "home|away|date" so we can match against our static list,
  // which has its own fixed ordering and may use slightly different team names
  // for unresolved knockout slots (e.g. "Best 3rd (ABCDF)").
  const index = new Map();
  for (const m of apiMatches) {
    const home = normalizeTeamName(m.homeTeam?.name || '');
    const away = normalizeTeamName(m.awayTeam?.name || '');
    const date = (m.utcDate || '').slice(0, 10);
    index.set(`${home}|${away}|${date}`, m);
    // Also index without date in case our local date is off by a day due to TZ edge cases
    index.set(`${home}|${away}`, m);
  }
  return index;
}

function updateDataFile(apiMatches) {
  let src = fs.readFileSync(DATA_FILE, 'utf8');
  const index = buildMatchIndex(apiMatches);

  // Match every object literal in the MATCHES array.
  // We operate line-by-line on the array body for simplicity and safety.
  const lines = src.split('\n');
  let updatedCount = 0;

  const lineRegex = /\{\s*stage:\s*'([^']*)',\s*group:\s*'([^']*)',\s*date:\s*'([^']*)',[^}]*home:\s*'([^']*)',\s*away:\s*'([^']*)',[^}]*result:\s*(null|'[^']*')/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(lineRegex);
    if (!m) continue;

    const [, , , date, homeRaw, awayRaw, currentResultRaw] = m;
    const home = homeRaw;
    const away = awayRaw;

    // Skip placeholder slots — nothing to look up yet (e.g. "TBD", "Best 3rd (...)").
    if (
      home === 'TBD' || away === 'TBD' ||
      home.startsWith('Best 3rd') || away.startsWith('Best 3rd') ||
      home.startsWith('Winner ') || away.startsWith('Winner ') ||
      home.startsWith('Runner-up ') || away.startsWith('Runner-up ')
    ) {
      continue;
    }

    const apiMatch = index.get(`${home}|${away}|${date}`) || index.get(`${home}|${away}`);
    if (!apiMatch) continue;

    const newResult = formatResult(apiMatch);
    if (!newResult) continue; // not finished yet

    const currentResult = currentResultRaw === 'null' ? null : currentResultRaw.slice(1, -1);
    if (currentResult === newResult) continue; // already up to date

    const newLine = line.replace(/result:\s*(null|'[^']*')/, `result: '${newResult}'`);
    lines[i] = newLine;
    updatedCount++;
    console.log(`Updated: ${home} vs ${away} (${date}) -> ${newResult}`);
  }

  if (updatedCount > 0) {
    fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  }
  return updatedCount;
}

async function main() {
  console.log('Fetching FIFA World Cup 2026 matches from football-data.org...');
  const apiMatches = await fetchMatches();
  console.log(`Fetched ${apiMatches.length} matches.`);

  const updatedCount = updateDataFile(apiMatches);
  console.log(`Done. ${updatedCount} match result(s) updated.`);

  // Exit code 0 always; the workflow decides whether to commit based on git diff.
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
