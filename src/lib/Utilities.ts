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
    const condition = timeZone.abbreviation.includes(input)
      || timeZone.alternativeName.includes(input)
      || timeZone.continentCode.includes(input)
      || timeZone.continentName.includes(input)
      || timeZone.countryCode.includes(input)
      || timeZone.countryName.includes(input)
      || timeZone.name.includes(input)
      || timeZone.rawFormat.includes(input);
    // console.log({ condition });

    const condition2 = timeZone.group.flat().some((tz) => tz.includes(input));
    // console.log({ condition2 });

    const condition3 = timeZone.mainCities.flat().some((tz) => tz.includes(input));
    // console.log({ condition3 });

    const condition4 = timeZone.rawOffsetInMinutes.toString().includes(input);
    // console.log({ condition4 });
    /*
    const condition5 = Object.values(timeZone)
      .flat()
      .some((tz) => tz.includes(input));
    console.log({ condition5 });
    */
    if (condition || condition2 || condition3 || condition4) {
      console.log(condition || condition2 || condition3 || condition4);
    }
    return condition || condition2 || condition3 || condition4;
  });
  console.log({ resultsFound: results.length });
  return results;
}
