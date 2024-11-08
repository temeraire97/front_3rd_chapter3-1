import { Event } from '../types.ts';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  /** 유효하지 않은 월에 대해 0을 반환합니다. */
  if (month < 1 || month > 12) return 0;

  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  /** 주의 첫 날짜 */
  const sunday = new Date(date.setDate(diff));

  /** 주의 모든 날짜 */
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    return nextDate;
  });

  return weekDates;
}

/**
 * 주어진 날짜의 월에 대한 모든 주의 정보를 반환합니다.
 */
export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  /** 월의 일수 */
  const daysInMonth = getDaysInMonth(year, month + 1);
  /** 월의 첫 날짜 */
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  /** 월의 모든 날짜의 배열 */
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  /** 필요한 총 주의 개수 계산 */
  const totalWeeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
  /** 초기 주 배열 생성 */
  const initialWeeks = Array.from({ length: totalWeeks }, () => Array(7).fill(null));

  /** 월의 모든 주의 배열 */
  const weeks = days.reduce((acc: Array<Array<number | null>>, day: number) => {
    /** 주에 해당하는 날짜 인덱스 */
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    /** 월에 해당하는 주 인덱스 */
    const weekIndex = Math.floor((firstDayOfMonth + day - 1) / 7);

    // 현재 날짜 설정
    acc[weekIndex][dayIndex] = day;

    return acc;
  }, initialWeeks);

  return weeks;
}

/**
 * 주어진 날짜에 해당하는 이벤트를 반환합니다.
 */
export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

/**
 * 주어진 날짜에 해당하는 주의 정보를 반환합니다.
 */
export function formatWeek(targetDate: Date) {
  const dayOfWeek = targetDate.getDay();
  const diffToThursday = 4 - dayOfWeek;
  const thursday = new Date(targetDate);
  thursday.setDate(targetDate.getDate() + diffToThursday);

  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;

  const firstDayOfMonth = new Date(thursday.getFullYear(), thursday.getMonth(), 1);

  const firstThursday = new Date(firstDayOfMonth);
  firstThursday.setDate(1 + ((4 - firstDayOfMonth.getDay() + 7) % 7));

  const weekNumber: number =
    Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

/**
 * 주어진 숫자를 0으로 채워 주어진 크기만큼의 문자열로 반환합니다.
 */
export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

/**
 * 주어진 날짜를 "YYYY-MM-DD" 형식으로 반환합니다.
 */
export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}
