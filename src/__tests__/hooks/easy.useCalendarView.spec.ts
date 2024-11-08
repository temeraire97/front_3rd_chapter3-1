import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { assertDate, setupHook } from '../utils.ts';

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime('2024-10-01T00:00:00');
});

afterAll(() => {
  vi.useRealTimers();
});
describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    expect(result.current.view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    assertDate(result.current.currentDate, new Date());
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    expect(result.current.holidays).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });
});

describe('주간 view test', () => {
  const weekCalendar = () => {
    return setupHook({
      hook: useCalendarView,
      initialAction: (current) => current.setView('week'),
    });
  };

  it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
    const result = weekCalendar();
    expect(result.current.view).toBe('week');
  });

  it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
    const result = weekCalendar();
    act(() => {
      result.current.navigate('next');
    });
    assertDate(result.current.currentDate, new Date('2024-10-08'));
  });

  it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
    const result = weekCalendar();

    act(() => {
      result.current.navigate('prev');
    });
    assertDate(result.current.currentDate, new Date('2024-09-24'));
  });
});

describe('월간 view test', () => {
  const monthCalendar = () => {
    return setupHook({
      hook: useCalendarView,
      initialAction: (current) => current.setView('month'),
    });
  };

  it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
    const result = monthCalendar();
    act(() => {
      result.current.navigate('prev');
    });
    assertDate(result.current.currentDate, new Date('2024-09-01'));
  });

  it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
    const result = monthCalendar();
    act(() => {
      result.current.setCurrentDate(new Date('2024-01-01'));
    });
    expect(result.current.holidays).toEqual({ '2024-01-01': '신정' });
  });
});
