//categoryの一覧を取得するAPIを作成する。

function calculateDaysBetweenDates(begin: any, end: any) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisBetween = end - begin;
  return millisBetween / millisecondsPerDay;
}
