// One-off diagnostic: dump what football-data.org returns for USA / Bosnia.
// Run once via the workflow, read the logs, then delete this file.
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
if (!API_KEY) { console.error('Missing FOOTBALL_DATA_API_KEY'); process.exit(1); }

const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
  headers: { 'X-Auth-Token': API_KEY },
});
const json = await res.json();
const matches = json.matches || [];
console.log(`Total matches fetched: ${matches.length}`);

// Find any match involving USA or Bosnia (by loose substring, case-insensitive)
const wanted = matches.filter(m => {
  const h = (m.homeTeam?.name || '').toLowerCase();
  const a = (m.awayTeam?.name || '').toLowerCase();
  return h.includes('bosnia') || a.includes('bosnia') ||
         h.includes('united states') || a.includes('united states') ||
         h.includes('usa') || a.includes('usa');
});

console.log(`\nFound ${wanted.length} USA/Bosnia matches:\n`);
for (const m of wanted) {
  console.log('---');
  console.log(`  homeTeam.name : "${m.homeTeam?.name}"`);
  console.log(`  awayTeam.name : "${m.awayTeam?.name}"`);
  console.log(`  status        : "${m.status}"`);
  console.log(`  stage         : "${m.stage}"`);
  console.log(`  utcDate       : "${m.utcDate}"`);
  console.log(`  score.duration: "${m.score?.duration}"`);
  console.log(`  score.fullTime: ${JSON.stringify(m.score?.fullTime)}`);
  console.log(`  score.winner  : "${m.score?.winner}"`);
}
process.exit(0);
