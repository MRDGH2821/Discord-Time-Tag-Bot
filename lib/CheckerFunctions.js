/* eslint-disable no-magic-numbers */
function checkLeapYear(year) {
  // return true if year is a multiple of 4 and not multiple of 100. OR year is multiple of 400.

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const monthOf30Days = [
    4,
    6,
    9,
    11
  ],
  monthOf31Days = [
    1,
    3,
    5,
    7,
    8,
    10,
    12
  ];

function dateTimeCheck(yyyy, mm, dd) {
  const day = Number(dd),
    month = Number(mm),
    year = Number(yyyy);

  let validity = false;

  if (monthOf31Days.includes(month)) {
    // january, March, May, July, August, October, December check.
    if (day <= 31) {
      validity = true;
    }
    else {
      validity = false;
    }
  }
  else if (monthOf30Days.includes(month)) {
    // april, June, September, November check.
    if (day <= 30) {
      validity = true;
    }
    else {
      validity = false;
    }
  }
  else if (month === 2) {
    // februray check
    if (!checkLeapYear(year)) {
      if (day <= 28) {
        validity = true;
      }
      else {
        validity = false;
      }
    }
    else if (day <= 29) {
      validity = true;
    }
    else {
      validity = false;
    }
  }
  else {
    validity = false;
  }

  return validity;
}

module.exports = {
  checkLeapYear,
  dateTimeCheck
};
