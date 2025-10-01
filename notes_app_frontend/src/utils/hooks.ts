import { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export function useDebouncedValue<T>(value: T, delay = 300): T {
  /** Returns a debounced value that updates after specified delay */
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
