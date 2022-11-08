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
  return str.replace('/', '_-_');
}

export function decodeInvalid(str: string) {
  return str.replace('_-_', '/');
}
