import { act, renderHook } from '@testing-library/react';

import { events as eventsData } from '../../__mocks__/response/events.json';
import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events = eventsData as Event[];

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime('2024-10-01T00:00:00');
});

afterAll(() => {
  vi.useRealTimers();
});

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([events[0]]);
});

describe('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  it('제목에 일치하는 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });
  it('설명에 일치하는 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    act(() => {
      result.current.setSearchTerm('팀 미팅');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });
  it('위치에 일치하는 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

    act(() => {
      result.current.setSearchTerm('회의실 B');
    });

    expect(result.current.filteredEvents).toEqual([events[0]]);
  });
});

describe('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  // 현재 시스템 시간이 2024-10-01이므로 주간 이벤트는 없어야 한다.
  // w1: 2024-09-29 ~ 2024-10-05
  // w2: 2024-10-06 ~ 2024-10-12
  // w3: 2024-10-13 ~ 2024-10-19
  // w4: 2024-10-20 ~ 2024-10-26
  // w5: 2024-10-27 ~ 2024-11-02
  it('주간 뷰에서 주간 이벤트만 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date(), 'week'));
    expect(result.current.filteredEvents).toEqual([]);
  });
  it('월간 뷰에서 월간 이벤트만 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date(), 'month'));
    expect(result.current.filteredEvents).toEqual(events);
  });
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([events[0]]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([]);
});
