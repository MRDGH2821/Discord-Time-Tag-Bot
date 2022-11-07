export function checkLeapYear(year: number) {
  // return true if year is a multiple of 4 and not multiple of 100. OR year is multiple of 400.

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const monthOf30Days = [4, 6, 9, 11];
const monthOf31Days = [1, 3, 5, 7, 8, 10, 12];

export function dateTimeCheck(yyyy: number, mm: number, dd: number) {
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);

  if (monthOf31Days.includes(month)) {
    // January, March, May, July, August, October, December check.
    return day <= 31;
  }
  if (monthOf30Days.includes(month)) {
    // April, June, September, November check.
    return day <= 30;
  }
  if (month === 2) {
    // February check
    if (!checkLeapYear(year)) {
      return day <= 28;
    }
    return day <= 29;
  }
  return false;
}
