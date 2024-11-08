import { act, renderHook } from '@testing-library/react';
import { FC } from 'react';

import { fillZero } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

// 시간 포맷 변환
export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

type SetupHookOptions<T> = {
  hook: () => T;
  // eslint-disable-next-line no-unused-vars
  initialAction?: (result: T) => void | Promise<void>;
};

// 훅 초기화
export const setupHook = <T>({ hook, initialAction }: SetupHookOptions<T>) => {
  const { result } = renderHook(() => hook());

  if (initialAction) {
    act(() => {
      initialAction(result.current);
    });
  }

  return result;
};
