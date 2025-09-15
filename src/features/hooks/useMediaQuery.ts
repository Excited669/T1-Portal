import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const get = () => window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    m.addEventListener('change', onChange);
    setMatches(m.matches); 
    return () => m.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
