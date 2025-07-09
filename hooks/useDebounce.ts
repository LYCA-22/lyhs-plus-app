import { useState, useEffect } from 'react';

/**
 * useDebounce Hook - 防抖處理，減少頻繁的狀態更新
 * @param value 需要防抖的值
 * @param delay 延遲時間（毫秒）
 * @returns 防抖後的值
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 設置定時器，在 delay 毫秒後更新防抖值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函數：如果 value 或 delay 改變，清除之前的定時器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
