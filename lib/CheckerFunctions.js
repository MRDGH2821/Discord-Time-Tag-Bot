function checkYear(year) {

  /*
   * return true if year is a multiple
   * of 4 and not multiple of 100.
   * OR year is multiple of 400.
   */
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

function DateTimeCheck(year, month, day, min) {
  year = Number(year);
  month = Number(month);
  day = Number(day);
  min = Number(min);

  let validity;

  if (
    month === 1 ||
    month === 3 ||
    month === 5 ||
    month === 7 ||
    month === 8 ||
    month === 10 ||
    month === 12
  ) {
    // january, March, May, July, August, October, December check.
    if (day <= 31) {
      validity = true;
    }
    else {
      validity = false;
    }
  }
  else if (month === 4 || month === 6 || month == 9 || month === 11) {
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
    if (!checkYear(year)) {
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

  if (min > 60) {
    validity = false;
  }

  return validity;
}

module.exports = {
  DateTimeCheck,
  checkYear
};
