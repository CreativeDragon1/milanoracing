import { useEffect, useMemo, useState } from "react";

export const competitionStart = Date.parse("2026-11-23T00:00:00+08:00");
export function competitionClock(now: number) {
  const seconds = Math.max(0, Math.ceil((competitionStart - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60,
    phase: now < competitionStart ? "countdown" : now < competitionStart + 86400000 ? "today" : "complete" };
}
export default function CompetitionCountdown() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      setNow(Date.now()); timer = setTimeout(tick, 1000 - Date.now() % 1000);
    };
    tick(); document.addEventListener("visibilitychange", tick);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", tick); };
  }, []);
  const localDate = useMemo(() => new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(competitionStart), []);
  const digits = useMemo(() => new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2, useGrouping: false }), []);
  const clock = competitionClock(now);
  const parts = [[clock.days,"Days"],[clock.hours,"Hours"],[clock.minutes,"Minutes"],[clock.seconds,"Seconds"]] as const;
  return <section className="competition-countdown raised" aria-labelledby="competition-title">
    <div className="competition-heading">
      <h2 id="competition-title">Final Countdown</h2>
      <p>STEM Racing</p>
      <time dateTime="2026-11-23T00:00:00+08:00">{localDate}</time>
    </div>
    {clock.phase === "countdown" ? <div className="competition-clock" role="timer" aria-live="off"
      aria-label={`${clock.days} days, ${clock.hours} hours, ${clock.minutes} minutes and ${clock.seconds} seconds until STEM Racing`}>
      {parts.map(([value,label]) => <div className="countdown-unit" key={label} aria-hidden="true"><strong>{digits.format(value)}</strong><span>{label}</span></div>)}
    </div> : <p className="competition-arrived" role="status">{clock.phase === "today" ? "It's competition day." : "The countdown is complete."}</p>}
  </section>;
}
