import { useDebugValue, useSyncExternalStore } from 'react';

type Callback = () => void;

function useMediaQuery(query: string) {
  const getSnapshot = () => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      return window.matchMedia(query).matches;
    }

    return false;
  };

  const subscribe = (callback: Callback) => {
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener('change', callback);

    return () => mediaQueryList.removeEventListener('change', callback);
  };

  const matchesQuery = useSyncExternalStore(subscribe, getSnapshot);

  useDebugValue([query, matchesQuery]);

  return matchesQuery;
}

export default useMediaQuery;
