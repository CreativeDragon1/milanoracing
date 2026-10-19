declare global {
  interface Window {
    __MILANO_ASSETS__?: Record<string, string>;
    __MILANO_OFFLINE__?: boolean;
  }
}

/** Same assets in a hosted build and the self-contained offline HTML. */
export function asset(file: string) {
  const path = file.startsWith('/assets/') ? file : `/assets/${file}`;
  return window.__MILANO_ASSETS__?.[path] ?? path;
}
