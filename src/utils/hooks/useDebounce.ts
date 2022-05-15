import { useEffect, useCallback, useRef } from 'react';
export default function useDebounce<T extends Array<any>, R = void>(fn: (...args: T)=> R, delay: number, dep: any[] = []) {
    const { current } = useRef({ fn, timer: null }) as any;
    useEffect(function () {
      current.fn = fn;
    }, [fn]);
  
    return useCallback(function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
      }, delay);
    }, dep)
}
  