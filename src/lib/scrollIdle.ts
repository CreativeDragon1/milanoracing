/** Defer expensive 3D setup until scrolling stops; cancel when its host leaves. */
export function afterScrollIdle(work: () => void) {
  let timer = 0, idle = 0, stopped = false;
  const cleanup = () => {
    window.clearTimeout(timer);
    if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
    window.removeEventListener('scroll', queue);
  };
  const run = () => {
    if (stopped) return;
    stopped = true; cleanup(); work();
  };
  function queue() {
    window.clearTimeout(timer);
    if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle);
    timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(run, { timeout: 1200 });
      else run();
    }, 250);
  }
  window.addEventListener('scroll', queue, { passive: true });
  queue();
  return () => { stopped = true; cleanup(); };
}
