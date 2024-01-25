export function isLeapYearThisYear() {
  return new Date(new Date().getFullYear(), 1, 29).getDate() === 29;
}
export function getDaysPerMonth(index: number) {
  const daysArray = [31, isLeapYearThisYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysArray[index];
}
