import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export default function MotionRibbon() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const control = useRef<(stop: boolean) => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stop = paused || hovered || focused;
  const stopped = useRef(stop);
  stopped.current = stop;

  useEffect(() => {
    const element = root.current!, strip = track.current!;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let frame = 0, visible = false;
    const eligible = () => visible && !document.hidden && !preference.matches;
    const settle = (halt: boolean, immediate = false) => {
      cancelAnimationFrame(frame);
      if (!animation) return;
      if (!eligible()) { animation.pause(); animation.playbackRate = halt ? 0 : 1; return; }
      animation.play();
      const initial = animation.playbackRate, target = halt ? 0 : 1;
      const start = performance.now();
      const ease = (now: number) => {
        const t = immediate ? 1 : Math.min(1, (now - start) / 650);
        animation!.updatePlaybackRate(initial + (target - initial) * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(ease);
        else if (halt) animation!.pause();
      };
      frame = requestAnimationFrame(ease);
    };
    control.current = settle;
    const resize = () => {
      element.style.setProperty('--ribbon-viewport', `${document.documentElement.clientWidth}px`);
      animation?.effect?.updateTiming({ duration: strip.firstElementChild!.getBoundingClientRect().width / 52 * 1000 });
    };
    const configure = () => {
      cancelAnimationFrame(frame); animation?.cancel(); animation = undefined;
      resize();
      if (preference.matches) return;
      animation = strip.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-33.3333333333%)' }], {
        duration: strip.firstElementChild!.getBoundingClientRect().width / 52 * 1000,
        iterations: Infinity, easing: 'linear',
      });
      settle(stopped.current, true);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; settle(stopped.current, true); });
    const sizes = new ResizeObserver(resize);
    observer.observe(element); sizes.observe(document.documentElement); sizes.observe(strip.firstElementChild!);
    const visibility = () => settle(stopped.current, true);
    preference.addEventListener('change', configure);
    document.addEventListener('visibilitychange', visibility);
    configure();
    return () => {
      cancelAnimationFrame(frame); animation?.cancel(); observer.disconnect(); sizes.disconnect();
      preference.removeEventListener('change', configure); document.removeEventListener('visibilitychange', visibility);
      control.current = () => {};
    };
  }, []);
  useEffect(() => control.current(stop), [stop]);

  return <div ref={root} className="motion-ribbon" role="region" aria-label="Milano Racing. Always the fastest. STEM Racing."
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div ref={track} className="motion-ribbon-track" aria-hidden="true">
      {[0, 1, 2].map(copy => <span className="motion-ribbon-group" key={copy}>
        <span className="ribbon-outline">Milano Racing</span><i/><span className="ribbon-outline">Always the fastest</span><i/><span>STEM Racing</span><i/>
      </span>)}
    </div>
    <button type="button" className="ribbon-control" aria-label={paused ? 'Resume banner' : 'Pause banner'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? <Play size={16}/> : <Pause size={16}/>}
    </button>
  </div>;
}
