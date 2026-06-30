export type Match = {
  stage: string;
  group: string;
  date: string;
  utc: string;
  home: string;
  away: string;
  diff: 1 | 2 | 3 | 4 | 5;
  result: string | null;
  venue: string;
  fav: string | null;
  favPct: number | null;
};

function etToUtc(date: string, etTime: string): string {
  const cleaned = etTime.replace(' ET', '');
  let [h, m] = cleaned.split(':').map(Number);
  let utcH = h + 4;
  let utcDate = date;
  if (utcH >= 24) {
    utcH -= 24;
    const d = new Date(date + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + 1);
    utcDate = d.toISOString().slice(0, 10);
  }
  return `${utcDate}T${String(utcH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const MATCHES: Match[] = [
  // Group stage
  { stage: 'Group stage', group: 'A', date: '2026-06-11', utc: '2026-06-11T19:00', home: 'Mexico', away: 'South Africa', diff: 5, result: '2–0', venue: 'Estadio Azteca, Mexico City', fav: 'Mexico', favPct: 77 },
  { stage: 'Group stage', group: 'A', date: '2026-06-11', utc: '2026-06-11T22:00', home: 'South Korea', away: 'Czechia', diff: 2, result: '2–1', venue: 'Estadio Akron, Zapopan', fav: 'South Korea', favPct: 54 },
  { stage: 'Group stage', group: 'B', date: '2026-06-12', utc: etToUtc('2026-06-12', '21:00 ET'), home: 'Canada', away: 'Bosnia & Herz.', diff: 2, result: '1–1', venue: 'Toronto Stadium', fav: 'Canada', favPct: 55 },
  { stage: 'Group stage', group: 'D', date: '2026-06-12', utc: etToUtc('2026-06-12', '22:00 ET'), home: 'USA', away: 'Paraguay', diff: 4, result: '4–1', venue: 'LA Stadium, Inglewood', fav: 'USA', favPct: 68 },
  { stage: 'Group stage', group: 'B', date: '2026-06-13', utc: etToUtc('2026-06-13', '18:00 ET'), home: 'Qatar', away: 'Switzerland', diff: 4, result: '1–1', venue: "Levi's Stadium, Santa Clara", fav: 'Switzerland', favPct: 66 },
  { stage: 'Group stage', group: 'C', date: '2026-06-13', utc: etToUtc('2026-06-13', '18:00 ET'), home: 'Brazil', away: 'Morocco', diff: 4, result: '1–1', venue: 'MetLife Stadium, NJ', fav: 'Brazil', favPct: 67 },
  { stage: 'Group stage', group: 'C', date: '2026-06-13', utc: etToUtc('2026-06-13', '21:00 ET'), home: 'Haiti', away: 'Scotland', diff: 5, result: '0–1', venue: 'Gillette Stadium, Foxborough', fav: 'Scotland', favPct: 79 },
  { stage: 'Group stage', group: 'D', date: '2026-06-14', utc: etToUtc('2026-06-14', '12:00 ET'), home: 'Australia', away: 'Türkiye', diff: 2, result: '2–0', venue: 'BC Place, Vancouver', fav: 'Türkiye', favPct: 56 },
  { stage: 'Group stage', group: 'E', date: '2026-06-14', utc: etToUtc('2026-06-14', '15:00 ET'), home: 'Germany', away: 'Curaçao', diff: 5, result: '7–1', venue: 'NRG Stadium, Houston', fav: 'Germany', favPct: 92 },
  { stage: 'Group stage', group: 'F', date: '2026-06-14', utc: etToUtc('2026-06-14', '18:00 ET'), home: 'Netherlands', away: 'Japan', diff: 2, result: '2–2', venue: 'AT&T Stadium, Arlington', fav: 'Netherlands', favPct: 57 },
  { stage: 'Group stage', group: 'E', date: '2026-06-14', utc: etToUtc('2026-06-14', '19:00 ET'), home: 'Ivory Coast', away: 'Ecuador', diff: 2, result: '1–0', venue: 'Lincoln Financial Field, Philadelphia', fav: 'Ivory Coast', favPct: 53 },
  { stage: 'Group stage', group: 'F', date: '2026-06-14', utc: etToUtc('2026-06-14', '22:00 ET'), home: 'Sweden', away: 'Tunisia', diff: 4, result: '5–1', venue: 'Estadio BBVA, Monterrey', fav: 'Sweden', favPct: 67 },
  { stage: 'Group stage', group: 'H', date: '2026-06-15', utc: etToUtc('2026-06-15', '12:00 ET'), home: 'Spain', away: 'Cape Verde', diff: 5, result: '0–0', venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'Spain', favPct: 84 },
  { stage: 'Group stage', group: 'G', date: '2026-06-15', utc: etToUtc('2026-06-15', '15:00 ET'), home: 'Belgium', away: 'Egypt', diff: 4, result: '1–1', venue: 'Lumen Field, Seattle', fav: 'Belgium', favPct: 65 },
  { stage: 'Group stage', group: 'H', date: '2026-06-15', utc: etToUtc('2026-06-15', '18:00 ET'), home: 'Saudi Arabia', away: 'Uruguay', diff: 2, result: '1–1', venue: 'Hard Rock Stadium, Miami', fav: 'Uruguay', favPct: 57 },
  { stage: 'Group stage', group: 'G', date: '2026-06-15', utc: etToUtc('2026-06-15', '21:00 ET'), home: 'Iran', away: 'New Zealand', diff: 4, result: '2–2', venue: 'SoFi Stadium, Inglewood', fav: 'Iran', favPct: 63 },
  { stage: 'Group stage', group: 'I', date: '2026-06-16', utc: etToUtc('2026-06-16', '15:00 ET'), home: 'France', away: 'Senegal', diff: 4, result: '3–1', venue: 'MetLife Stadium, NJ', fav: 'France', favPct: 66 },
  { stage: 'Group stage', group: 'I', date: '2026-06-16', utc: etToUtc('2026-06-16', '18:00 ET'), home: 'Iraq', away: 'Norway', diff: 4, result: '1–4', venue: 'Gillette Stadium, Foxborough', fav: 'Norway', favPct: 65 },
  { stage: 'Group stage', group: 'J', date: '2026-06-16', utc: etToUtc('2026-06-16', '21:00 ET'), home: 'Argentina', away: 'Algeria', diff: 5, result: '3–0', venue: 'Arrowhead Stadium, Kansas City', fav: 'Argentina', favPct: 81 },
  { stage: 'Group stage', group: 'J', date: '2026-06-17', utc: etToUtc('2026-06-16', '24:00 ET'), home: 'Austria', away: 'Jordan', diff: 4, result: '3–1', venue: "Levi's Stadium, Santa Clara", fav: 'Austria', favPct: 69 },
  { stage: 'Group stage', group: 'K', date: '2026-06-17', utc: etToUtc('2026-06-17', '13:00 ET'), home: 'Portugal', away: 'DR Congo', diff: 5, result: '1–1', venue: 'NRG Stadium, Houston', fav: 'Portugal', favPct: 83 },
  { stage: 'Group stage', group: 'L', date: '2026-06-17', utc: etToUtc('2026-06-17', '16:00 ET'), home: 'England', away: 'Croatia', diff: 4, result: '4–2', venue: 'AT&T Stadium, Arlington', fav: 'England', favPct: 65 },
  { stage: 'Group stage', group: 'L', date: '2026-06-17', utc: etToUtc('2026-06-17', '19:00 ET'), home: 'Ghana', away: 'Panama', diff: 2, result: '1–0', venue: 'BMO Field, Toronto', fav: 'Ghana', favPct: 55 },
  { stage: 'Group stage', group: 'K', date: '2026-06-17', utc: etToUtc('2026-06-17', '22:00 ET'), home: 'Uzbekistan', away: 'Colombia', diff: 5, result: '1–3', venue: 'Estadio Azteca, Mexico City', fav: 'Colombia', favPct: 78 },
  { stage: 'Group stage', group: 'A', date: '2026-06-18', utc: etToUtc('2026-06-18', '12:00 ET'), home: 'Czechia', away: 'South Africa', diff: 4, result: '1–1', venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'Czechia', favPct: 64 },
  { stage: 'Group stage', group: 'B', date: '2026-06-18', utc: etToUtc('2026-06-18', '15:00 ET'), home: 'Switzerland', away: 'Bosnia & Herz.', diff: 4, result: '4–1', venue: 'SoFi Stadium, Inglewood', fav: 'Switzerland', favPct: 66 },
  { stage: 'Group stage', group: 'B', date: '2026-06-18', utc: etToUtc('2026-06-18', '18:00 ET'), home: 'Canada', away: 'Qatar', diff: 4, result: '6–0', venue: 'BC Place, Vancouver', fav: 'Canada', favPct: 65 },
  { stage: 'Group stage', group: 'A', date: '2026-06-18', utc: etToUtc('2026-06-18', '21:00 ET'), home: 'Mexico', away: 'South Korea', diff: 2, result: '1–0', venue: 'Estadio Akron, Zapopan', fav: 'Mexico', favPct: 54 },
  { stage: 'Group stage', group: 'D', date: '2026-06-19', utc: etToUtc('2026-06-19', '15:00 ET'), home: 'USA', away: 'Australia', diff: 4, result: '2–0', venue: 'Lumen Field, Seattle', fav: 'USA', favPct: 66 },
  { stage: 'Group stage', group: 'C', date: '2026-06-19', utc: etToUtc('2026-06-19', '18:00 ET'), home: 'Scotland', away: 'Morocco', diff: 2, result: '0–1', venue: 'Gillette Stadium, Foxborough', fav: 'Morocco', favPct: 56 },
  { stage: 'Group stage', group: 'C', date: '2026-06-19', utc: etToUtc('2026-06-19', '20:30 ET'), home: 'Brazil', away: 'Haiti', diff: 5, result: '3–0', venue: 'Lincoln Financial Field, Philadelphia', fav: 'Brazil', favPct: 88 },
  { stage: 'Group stage', group: 'D', date: '2026-06-19', utc: etToUtc('2026-06-19', '23:00 ET'), home: 'Türkiye', away: 'Paraguay', diff: 2, result: '0–1', venue: "Levi's Stadium, Santa Clara", fav: 'Türkiye', favPct: 56 },
  { stage: 'Group stage', group: 'F', date: '2026-06-20', utc: etToUtc('2026-06-20', '13:00 ET'), home: 'Netherlands', away: 'Sweden', diff: 4, result: '5–1', venue: 'NRG Stadium, Houston', fav: 'Netherlands', favPct: 66 },
  { stage: 'Group stage', group: 'E', date: '2026-06-20', utc: etToUtc('2026-06-20', '16:00 ET'), home: 'Germany', away: 'Ivory Coast', diff: 4, result: '2–1', venue: 'BMO Field, Toronto', fav: 'Germany', favPct: 67 },
  { stage: 'Group stage', group: 'E', date: '2026-06-20', utc: etToUtc('2026-06-20', '20:00 ET'), home: 'Ecuador', away: 'Curaçao', diff: 5, result: '0–0', venue: 'Arrowhead Stadium, Kansas City', fav: 'Ecuador', favPct: 80 },
  { stage: 'Group stage', group: 'F', date: '2026-06-21', utc: etToUtc('2026-06-20', '24:00 ET'), home: 'Tunisia', away: 'Japan', diff: 2, result: '0–4', venue: 'Estadio BBVA, Monterrey', fav: 'Japan', favPct: 55 },
  { stage: 'Group stage', group: 'H', date: '2026-06-21', utc: etToUtc('2026-06-21', '12:00 ET'), home: 'Spain', away: 'Saudi Arabia', diff: 5, result: '4–0', venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'Spain', favPct: 82 },
  { stage: 'Group stage', group: 'G', date: '2026-06-21', utc: etToUtc('2026-06-21', '15:00 ET'), home: 'Belgium', away: 'Iran', diff: 5, result: '0–0', venue: 'SoFi Stadium, Inglewood', fav: 'Belgium', favPct: 78 },
  { stage: 'Group stage', group: 'H', date: '2026-06-21', utc: etToUtc('2026-06-21', '18:00 ET'), home: 'Uruguay', away: 'Cape Verde', diff: 5, result: '2–2', venue: 'Hard Rock Stadium, Miami', fav: 'Uruguay', favPct: 80 },
  { stage: 'Group stage', group: 'G', date: '2026-06-21', utc: etToUtc('2026-06-21', '21:00 ET'), home: 'New Zealand', away: 'Egypt', diff: 2, result: '1–3', venue: 'BC Place, Vancouver', fav: 'Egypt', favPct: 53 },
  { stage: 'Group stage', group: 'J', date: '2026-06-22', utc: etToUtc('2026-06-22', '13:00 ET'), home: 'Argentina', away: 'Austria', diff: 5, result: '2–0', venue: 'AT&T Stadium, Arlington', fav: 'Argentina', favPct: 76 },
  { stage: 'Group stage', group: 'I', date: '2026-06-22', utc: etToUtc('2026-06-22', '17:00 ET'), home: 'France', away: 'Iraq', diff: 5, result: '3–0', venue: 'Lincoln Financial Field, Philadelphia', fav: 'France', favPct: 84 },
  { stage: 'Group stage', group: 'I', date: '2026-06-22', utc: etToUtc('2026-06-22', '20:00 ET'), home: 'Norway', away: 'Senegal', diff: 2, result: '3–2', venue: 'MetLife Stadium, NJ', fav: 'Norway', favPct: 54 },
  { stage: 'Group stage', group: 'J', date: '2026-06-22', utc: etToUtc('2026-06-22', '23:00 ET'), home: 'Jordan', away: 'Algeria', diff: 2, result: '1–2', venue: "Levi's Stadium, Santa Clara", fav: 'Algeria', favPct: 55 },
  { stage: 'Group stage', group: 'K', date: '2026-06-23', utc: etToUtc('2026-06-23', '13:00 ET'), home: 'Portugal', away: 'Uzbekistan', diff: 5, result: '5–0', venue: 'NRG Stadium, Houston', fav: 'Portugal', favPct: 85 },
  { stage: 'Group stage', group: 'L', date: '2026-06-23', utc: etToUtc('2026-06-23', '16:00 ET'), home: 'England', away: 'Ghana', diff: 4, result: '0–0', venue: 'Gillette Stadium, Foxborough', fav: 'England', favPct: 70 },
  { stage: 'Group stage', group: 'L', date: '2026-06-23', utc: etToUtc('2026-06-23', '19:00 ET'), home: 'Panama', away: 'Croatia', diff: 4, result: '0–1', venue: 'BMO Field, Toronto', fav: 'Croatia', favPct: 66 },
  { stage: 'Group stage', group: 'K', date: '2026-06-23', utc: etToUtc('2026-06-23', '22:00 ET'), home: 'Colombia', away: 'DR Congo', diff: 4, result: '1–0', venue: 'Estadio Akron, Zapopan', fav: 'Colombia', favPct: 67 },
  { stage: 'Group stage', group: 'B', date: '2026-06-24', utc: etToUtc('2026-06-24', '15:00 ET'), home: 'Switzerland', away: 'Canada', diff: 2, result: '2–1', venue: 'BC Place, Vancouver', fav: 'Switzerland', favPct: 53 },
  { stage: 'Group stage', group: 'B', date: '2026-06-24', utc: etToUtc('2026-06-24', '15:00 ET'), home: 'Bosnia & Herz.', away: 'Qatar', diff: 4, result: '3–1', venue: 'Lumen Field, Seattle', fav: 'Bosnia & Herz.', favPct: 65 },
  { stage: 'Group stage', group: 'C', date: '2026-06-24', utc: etToUtc('2026-06-24', '18:00 ET'), home: 'Scotland', away: 'Brazil', diff: 5, result: '0–3', venue: 'Hard Rock Stadium, Miami', fav: 'Brazil', favPct: 77 },
  { stage: 'Group stage', group: 'C', date: '2026-06-24', utc: etToUtc('2026-06-24', '18:00 ET'), home: 'Morocco', away: 'Haiti', diff: 5, result: '4–2', venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'Morocco', favPct: 82 },
  { stage: 'Group stage', group: 'A', date: '2026-06-24', utc: etToUtc('2026-06-24', '21:00 ET'), home: 'Czechia', away: 'Mexico', diff: 2, result: '0–3', venue: 'Estadio Azteca, Mexico City', fav: 'Mexico', favPct: 54 },
  { stage: 'Group stage', group: 'A', date: '2026-06-24', utc: etToUtc('2026-06-24', '21:00 ET'), home: 'South Africa', away: 'South Korea', diff: 2, result: '1–0', venue: 'Estadio BBVA, Monterrey', fav: 'South Korea', favPct: 53 },
  { stage: 'Group stage', group: 'E', date: '2026-06-25', utc: etToUtc('2026-06-25', '16:00 ET'), home: 'Curaçao', away: 'Ivory Coast', diff: 5, result: '0–2', venue: 'Lincoln Financial Field, Philadelphia', fav: 'Ivory Coast', favPct: 80 },
  { stage: 'Group stage', group: 'E', date: '2026-06-25', utc: etToUtc('2026-06-25', '16:00 ET'), home: 'Ecuador', away: 'Germany', diff: 4, result: '2–1', venue: 'MetLife Stadium, NJ', fav: 'Germany', favPct: 68 },
  { stage: 'Group stage', group: 'F', date: '2026-06-25', utc: etToUtc('2026-06-25', '19:00 ET'), home: 'Japan', away: 'Sweden', diff: 2, result: '1–1', venue: 'AT&T Stadium, Arlington', fav: 'Sweden', favPct: 56 },
  { stage: 'Group stage', group: 'F', date: '2026-06-25', utc: etToUtc('2026-06-25', '19:00 ET'), home: 'Tunisia', away: 'Netherlands', diff: 5, result: '1–3', venue: 'Arrowhead Stadium, Kansas City', fav: 'Netherlands', favPct: 78 },
  { stage: 'Group stage', group: 'D', date: '2026-06-25', utc: etToUtc('2026-06-25', '22:00 ET'), home: 'Türkiye', away: 'USA', diff: 2, result: '3–2', venue: 'SoFi Stadium, Inglewood', fav: 'USA', favPct: 55 },
  { stage: 'Group stage', group: 'D', date: '2026-06-25', utc: etToUtc('2026-06-25', '22:00 ET'), home: 'Paraguay', away: 'Australia', diff: 2, result: '0–0', venue: "Levi's Stadium, Santa Clara", fav: 'Australia', favPct: 53 },
  { stage: 'Group stage', group: 'I', date: '2026-06-26', utc: etToUtc('2026-06-26', '15:00 ET'), home: 'Norway', away: 'France', diff: 2, result: '1–4', venue: 'Gillette Stadium, Foxborough', fav: 'France', favPct: 57 },
  { stage: 'Group stage', group: 'I', date: '2026-06-26', utc: etToUtc('2026-06-26', '15:00 ET'), home: 'Senegal', away: 'Iraq', diff: 4, result: '5–0', venue: 'BMO Field, Toronto', fav: 'Senegal', favPct: 65 },
  { stage: 'Group stage', group: 'H', date: '2026-06-26', utc: etToUtc('2026-06-26', '20:00 ET'), home: 'Cape Verde', away: 'Saudi Arabia', diff: 2, result: '0–0', venue: 'NRG Stadium, Houston', fav: 'Saudi Arabia', favPct: 56 },
  { stage: 'Group stage', group: 'H', date: '2026-06-26', utc: etToUtc('2026-06-26', '20:00 ET'), home: 'Uruguay', away: 'Spain', diff: 4, result: '0–1', venue: 'Estadio Akron, Zapopan', fav: 'Spain', favPct: 65 },
  { stage: 'Group stage', group: 'G', date: '2026-06-26', utc: etToUtc('2026-06-26', '23:00 ET'), home: 'Egypt', away: 'Iran', diff: 1, result: '1–1', venue: 'Lumen Field, Seattle', fav: null, favPct: 50 },
  { stage: 'Group stage', group: 'G', date: '2026-06-26', utc: etToUtc('2026-06-26', '23:00 ET'), home: 'New Zealand', away: 'Belgium', diff: 5, result: '1–5', venue: 'BC Place, Vancouver', fav: 'Belgium', favPct: 80 },
  { stage: 'Group stage', group: 'L', date: '2026-06-27', utc: etToUtc('2026-06-27', '17:00 ET'), home: 'Panama', away: 'England', diff: 5, result: '0–2', venue: 'MetLife Stadium, NJ', fav: 'England', favPct: 82 },
  { stage: 'Group stage', group: 'L', date: '2026-06-27', utc: etToUtc('2026-06-27', '17:00 ET'), home: 'Croatia', away: 'Ghana', diff: 4, result: '2–1', venue: 'Lincoln Financial Field, Philadelphia', fav: 'Croatia', favPct: 65 },
  { stage: 'Group stage', group: 'K', date: '2026-06-27', utc: etToUtc('2026-06-27', '19:30 ET'), home: 'Colombia', away: 'Portugal', diff: 2, result: '0–0', venue: 'Hard Rock Stadium, Miami', fav: 'Portugal', favPct: 57 },
  { stage: 'Group stage', group: 'K', date: '2026-06-27', utc: etToUtc('2026-06-27', '19:30 ET'), home: 'DR Congo', away: 'Uzbekistan', diff: 4, result: '3–1', venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'Uzbekistan', favPct: 65 },
  { stage: 'Group stage', group: 'J', date: '2026-06-27', utc: etToUtc('2026-06-27', '22:00 ET'), home: 'Algeria', away: 'Austria', diff: 2, result: '3–3', venue: 'Arrowhead Stadium, Kansas City', fav: 'Austria', favPct: 55 },
  { stage: 'Group stage', group: 'J', date: '2026-06-27', utc: etToUtc('2026-06-27', '22:00 ET'), home: 'Jordan', away: 'Argentina', diff: 5, result: '1–3', venue: 'AT&T Stadium, Arlington', fav: 'Argentina', favPct: 83 },
  // Round of 32
  { stage: 'Round of 32', group: '-', date: '2026-06-28', utc: etToUtc('2026-06-28', '15:00 ET'), home: 'South Africa', away: 'Canada', diff: 3, result: '0–1', venue: 'SoFi Stadium, Inglewood', fav: 'Canada', favPct: 55 },
  { stage: 'Round of 32', group: '-', date: '2026-06-29', utc: etToUtc('2026-06-29', '13:00 ET'), home: 'Brazil', away: 'Japan', diff: 4, result: '2–1', venue: 'NRG Stadium, Houston', fav: 'Brazil', favPct: 70 },
  { stage: 'Round of 32', group: '-', date: '2026-06-29', utc: etToUtc('2026-06-29', '16:30 ET'), home: 'Germany', away: 'Paraguay', diff: 4, result: '4–5', venue: 'Gillette Stadium, Foxborough', fav: 'Germany', favPct: 70 },
  { stage: 'Round of 32', group: '-', date: '2026-06-29', utc: etToUtc('2026-06-29', '21:00 ET'), home: 'Netherlands', away: 'Morocco', diff: 3, result: '3–4', venue: 'Estadio BBVA, Monterrey', fav: 'Netherlands', favPct: 58 },
  { stage: 'Round of 32', group: '-', date: '2026-06-30', utc: etToUtc('2026-06-30', '13:00 ET'), home: 'Ivory Coast', away: 'Norway', diff: 2, result: null, venue: 'AT&T Stadium, Arlington', fav: 'Norway', favPct: 55 },
  { stage: 'Round of 32', group: '-', date: '2026-06-30', utc: etToUtc('2026-06-30', '17:00 ET'), home: 'France', away: 'Sweden', diff: 4, result: null, venue: 'MetLife Stadium, NJ', fav: 'France', favPct: 70 },
  { stage: 'Round of 32', group: '-', date: '2026-06-30', utc: etToUtc('2026-06-30', '21:00 ET'), home: 'Mexico', away: 'Ecuador', diff: 4, result: null, venue: 'Estadio Azteca, Mexico City', fav: 'Mexico', favPct: 65 },
  { stage: 'Round of 32', group: '-', date: '2026-07-01', utc: etToUtc('2026-07-01', '12:00 ET'), home: 'England', away: 'DR Congo', diff: 4, result: null, venue: 'Mercedes-Benz Stadium, Atlanta', fav: 'England', favPct: 70 },
  { stage: 'Round of 32', group: '-', date: '2026-07-01', utc: etToUtc('2026-07-01', '16:00 ET'), home: 'Belgium', away: 'Senegal', diff: 4, result: null, venue: 'Lumen Field, Seattle', fav: 'Belgium', favPct: 65 },
  { stage: 'Round of 32', group: '-', date: '2026-07-01', utc: etToUtc('2026-07-01', '20:00 ET'), home: 'USA', away: 'Bosnia & Herz.', diff: 4, result: null, venue: "Levi's Stadium, Santa Clara", fav: 'USA', favPct: 64 },
  { stage: 'Round of 32', group: '-', date: '2026-07-02', utc: etToUtc('2026-07-02', '15:00 ET'), home: 'Spain', away: 'Austria', diff: 4, result: null, venue: 'SoFi Stadium, Inglewood', fav: 'Spain', favPct: 65 },
  { stage: 'Round of 32', group: '-', date: '2026-07-02', utc: etToUtc('2026-07-02', '19:00 ET'), home: 'Portugal', away: 'Croatia', diff: 3, result: null, venue: 'BMO Field, Toronto', fav: 'Portugal', favPct: 55 },
  { stage: 'Round of 32', group: '-', date: '2026-07-02', utc: etToUtc('2026-07-02', '23:00 ET'), home: 'Switzerland', away: 'Algeria', diff: 4, result: null, venue: 'BC Place, Vancouver', fav: 'Switzerland', favPct: 64 },
  { stage: 'Round of 32', group: '-', date: '2026-07-03', utc: etToUtc('2026-07-03', '14:00 ET'), home: 'Australia', away: 'Egypt', diff: 3, result: null, venue: 'AT&T Stadium, Arlington', fav: 'Egypt', favPct: 53 },
  { stage: 'Round of 32', group: '-', date: '2026-07-03', utc: etToUtc('2026-07-03', '18:00 ET'), home: 'Argentina', away: 'Cape Verde', diff: 5, result: null, venue: 'Hard Rock Stadium, Miami', fav: 'Argentina', favPct: 85 },
  { stage: 'Round of 32', group: '-', date: '2026-07-03', utc: etToUtc('2026-07-03', '21:30 ET'), home: 'Colombia', away: 'Ghana', diff: 3, result: null, venue: 'Arrowhead Stadium, Kansas City', fav: 'Colombia', favPct: 58 },
  // Round of 16
  { stage: 'Round of 16', group: '-', date: '2026-07-04', utc: etToUtc('2026-07-04', '13:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'NRG Stadium, Houston', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-04', utc: etToUtc('2026-07-04', '17:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Lincoln Financial Field, Philadelphia', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-05', utc: etToUtc('2026-07-05', '16:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'MetLife Stadium, NJ', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-05', utc: etToUtc('2026-07-05', '20:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Estadio Azteca, Mexico City', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-06', utc: etToUtc('2026-07-06', '15:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'AT&T Stadium, Arlington', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-06', utc: etToUtc('2026-07-06', '20:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Lumen Field, Seattle', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-07', utc: etToUtc('2026-07-07', '12:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Mercedes-Benz Stadium, Atlanta', fav: null, favPct: null },
  { stage: 'Round of 16', group: '-', date: '2026-07-07', utc: etToUtc('2026-07-07', '16:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'BC Place, Vancouver', fav: null, favPct: null },
  // Quarterfinals
  { stage: 'Quarterfinals', group: '-', date: '2026-07-09', utc: etToUtc('2026-07-09', '16:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Gillette Stadium, Foxborough', fav: null, favPct: null },
  { stage: 'Quarterfinals', group: '-', date: '2026-07-10', utc: etToUtc('2026-07-10', '15:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'SoFi Stadium, Inglewood', fav: null, favPct: null },
  { stage: 'Quarterfinals', group: '-', date: '2026-07-11', utc: etToUtc('2026-07-11', '17:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Hard Rock Stadium, Miami', fav: null, favPct: null },
  { stage: 'Quarterfinals', group: '-', date: '2026-07-11', utc: etToUtc('2026-07-11', '21:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Arrowhead Stadium, Kansas City', fav: null, favPct: null },
  // Semifinals
  { stage: 'Semifinals', group: '-', date: '2026-07-14', utc: etToUtc('2026-07-14', '15:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'AT&T Stadium, Arlington', fav: null, favPct: null },
  { stage: 'Semifinals', group: '-', date: '2026-07-15', utc: etToUtc('2026-07-15', '15:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'Mercedes-Benz Stadium, Atlanta', fav: null, favPct: null },
  // Final
  { stage: 'Final', group: '-', date: '2026-07-18', utc: etToUtc('2026-07-18', '17:00 ET'), home: '3rd Place', away: '4th Place', diff: 1, result: null, venue: 'Hard Rock Stadium, Miami', fav: null, favPct: null },
  { stage: 'Final', group: '-', date: '2026-07-19', utc: etToUtc('2026-07-19', '15:00 ET'), home: 'TBD', away: 'TBD', diff: 1, result: null, venue: 'MetLife Stadium, East Rutherford, NJ', fav: null, favPct: null },
];

export const STAGE_ORDER = ['Group stage', 'Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

export const DIFF_CONFIG = {
  1: { label: 'Coin flip',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   desc: 'Truly unpredictable — <52%' },
  2: { label: 'Competitive', color: '#f97316', bg: 'rgba(249,115,22,0.15)',  desc: 'Slight edge — 52–58%' },
  3: { label: 'Comfortable', color: '#eab308', bg: 'rgba(234,179,8,0.15)',   desc: 'Clear favorite — 58–65%' },
  4: { label: 'Favorable',   color: '#84cc16', bg: 'rgba(132,204,22,0.15)', desc: 'Strong favorite — 65–75%' },
  5: { label: 'Walkover',    color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   desc: 'Dominant favorite — 75%+' },
} as const;

export function toEET(utcStr: string): string {
  const d = new Date(utcStr + ':00Z');
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Sofia' });
}

export function formatDate(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}
