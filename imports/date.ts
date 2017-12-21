export function today() {
  var now = new Date();
  return createDay(now.getFullYear(), now.getMonth(), now.getDate());
}

export function createDay(year, month, day) {
  return new Date(year, month, day, 0, 0, 0);
}
export function addDays(date, days) {
  date = convertToDate(date);
  return createDay(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
export function firstDayOfMonth(month) {
  return createDay(month.getFullYear(), month.getMonth(), 1);
}
export function calendarDaysForMonth(month, square=true) {
  var days = [];
  var firstDay = firstDayOfMonth(month);
  if (square) {
    for (var i = 0; i < 7 - (7 - firstDay.getDay()); ++ i) {
      days.unshift(addDays(firstDay, -(i + 1)));
    }    
  }
  var day = firstDay;
  while (day.getMonth() == month.getMonth() || day.getMonth() > month.getMonth() && days.length % 7 && square) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days;
}

export function convertToDate(date: Date|string): Date {
  if (typeof date == 'string') {
    return new Date(Date.parse(<string>date + ' 00:00'));
  }
  else {
    return <Date>date;
  }
}

export function formatDate(date) {
  if (date) {
    return date.getFullYear() + '-' + _.padStart(date.getMonth() + 1, 2, '0') + '-' + _.padStart(date.getDate(), 2, '0');    
  }
}

export function weeksForMonth(month: Date):Array<Array<Date>> {
  var days = calendarDaysForMonth(month);
  var weeks = [];
  for (var i = 0; i < days.length/7; ++i) {
    weeks.push(days.slice(i*7, i*7 + 7));
  }
  return weeks;
}
