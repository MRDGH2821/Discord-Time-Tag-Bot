import { getTimeZones } from '@vvo/tzdb';

export function offSetMinutesToClock(minute: number) {
  let mins = minute;
  const sign = mins < 0 ? '-' : '+';
  if (sign === '-') {
    mins *= -1;
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hours = h < 10 ? `0${h}` : h; // (or alternatively) h = String(h).padStart(2, '0')
  const minutes = m < 10 ? `0${m}` : m; // (or alternatively) m = String(m).padStart(2, '0')
  return `${sign}${hours}:${minutes}`;
}

export function hourMinuteToClock(h: number, m: number) {
  const hours = h < 10 ? `0${h}` : h; // (or alternatively) h = String(h).padStart(2, '0')
  const minutes = m < 10 ? `0${m}` : m; // (or alternatively) m = String(m).padStart(2, '0')
  return `${hours}:${minutes}`;
}

export function encodeInvalid(str: string) {
  return str.replace('/', '_').toLowerCase();
}

export function decodeInvalid(str: string) {
  return str.replace('_', '/');
}

export const timeZones = getTimeZones({ includeUtc: true });

export function searchTZ(input: string) {
  console.log({ searching: input });
  const results = timeZones.filter((timeZone) => {
    const str = JSON.stringify(timeZone).toString().toLowerCase();
    const matches = str.match(input);
    return !!matches;
  });
  console.log({ resultsFound: results.length });
  return results;
}
