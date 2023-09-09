/* eslint-disable prefer-spread */
import type { DependencyList } from 'react';
import { useEffect } from 'react';

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps as any);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
