#!/usr/bin/env node
/**
 * update-results.mjs  (v4 — robust team-name matching + AET/pens)
 * ---------------------------------------------------------------
 * Patches the single self-contained index.html directly.
 * Handles regular / extra-time / penalty results, and matches
 * teams even when the API spells them differently (e.g.
 * "Bosnia-Herzegovina" vs "Bosnia & Herz.", "Turkey" vs "Türkiye").
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

// Explicit overrides for names that can't be auto-derived by canonicalisation
// (e.g. "Korea Republic" -> "South Korea", which share no common root).
const TEAM_NAME_MAP = {
  'Korea Republic': 'South Korea',
  "Côte d'Ivoire": 'Ivory Coast',
  'IR Iran': 'Iran',
  'United States': 'USA',
  'Cabo Verde': 'Cape Verde',
  'Congo DR': 'DR Congo',
  'Turkey': 'Türkiye',
};

const DASH = '\u2013'; // en dash

// Canonical form: lowercase, drop connector words & punctuation & accents,
// so "Bosnia-Herzegovina", "Bosnia and Herzegovina", "Bosnia & Herz." all
// reduce to a comparable root ("bosniaherz..."). Used as a fallback matcher.
function canonical(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/\band\b/g, ' ')
    .replace(/[&\-.]/g, ' ')
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, '');
}

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
  const score = match.score || {};
  const ft = score.fullTime || {};
  const h = ft.home, a = ft.away;
  if (h == null || a == null) return null;

  const duration = score.duration || 'REGULAR';
  if (duration === 'EXTRA_TIME') return `${h}${DASH}${a} (AET)`;
  if (duration === 'PENALTY_SHOOTOUT') {
    const p = score.penalties || {};
    if (p.home != null && p.away != null) return `${h}${DASH}${a} (${p.home}${DASH}${p.away} pens)`;
    return `${h}${DASH}${a}`;
  }
  return `${h}${DASH}${a}`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Extract every home/away pair present in the HTML, once, so we can do a
// canonical-fallback lookup when the direct name doesn't match.
function extractHtmlTeams(html) {
  const names = new Set();
  const re = /home:`([^`]*)`,away:`([^`]*)`/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    names.add(m[1]);
    names.add(m[2]);
  }
  // Map canonical -> actual HTML spelling
  const byCanonical = new Map();
  for (const n of names) byCanonical.set(canonical(n), n);
  return byCanonical;
}

// Resolve an API team name to the exact spelling used in the HTML.
// Tries, in order: exact canonical match, then prefix match (to handle
// abbreviations like "Herz." for "Herzegovina").
function resolveToHtmlName(apiName, htmlByCanonical) {
  const candidates = [canonical(normalizeTeamName(apiName)), canonical(apiName)];

  // 1) Exact canonical match
  for (const c of candidates) {
    if (htmlByCanonical.has(c)) return htmlByCanonical.get(c);
  }

  // 2) Prefix match — one canonical form is a prefix of the other.
  //    Require the shorter string to be >= 4 chars to avoid accidental
  //    collisions between short unrelated names.
  for (const c of candidates) {
    for (const [htmlC, htmlName] of htmlByCanonical) {
      const shorter = c.length < htmlC.length ? c : htmlC;
      const longer = c.length < htmlC.length ? htmlC : c;
      if (shorter.length >= 4 && longer.startsWith(shorter)) {
        return htmlName;
      }
    }
  }

  return normalizeTeamName(apiName); // last resort — may not match, will be skipped
}

async function main() {
  console.log('Fetching FIFA World Cup 2026 matches from football-data.org...');
  const apiMatches = await fetchMatches();
  console.log(`Fetched ${apiMatches.length} matches.`);

  let html = fs.readFileSync(HTML_FILE, 'utf8');
  const htmlByCanonical = extractHtmlTeams(html);
  let updatedCount = 0;

  for (const m of apiMatches) {
    const rawHome = m.homeTeam?.name || '';
    const rawAway = m.awayTeam?.name || '';
    if (!rawHome || !rawAway) continue;

    const newResult = formatResult(m);
    if (!newResult) continue; // not finished yet

    const home = resolveToHtmlName(rawHome, htmlByCanonical);
    const away = resolveToHtmlName(rawAway, htmlByCanonical);

    const pattern = new RegExp(
      '(home:`' + escapeRegex(home) + '`,away:`' + escapeRegex(away) + '`,diff:\\d+,result:)(null|`[^`]*`)'
    );
    const found = html.match(pattern);
    if (!found) continue; // fixture not present (e.g. unresolved knockout placeholder)

    const currentResult = found[2] === 'null' ? null : found[2].slice(1, -1);
    if (currentResult === newResult) continue; // already correct

    html = html.replace(pattern, '$1`' + newResult + '`');
    updatedCount++;
    console.log(`Updated: ${home} vs ${away} -> ${newResult}`);
  }

  if (updatedCount > 0) fs.writeFileSync(HTML_FILE, html, 'utf8');
  console.log(`Done. ${updatedCount} match result(s) updated in index.html.`);
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
