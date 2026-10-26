// Position-driven movement stays in step with scrolling, in both directions.
export default function MotionRibbon() {
  return <div className="motion-ribbon" aria-hidden="true">
    <div className="motion-ribbon-track">
      {[0, 1, 2].map(copy => <span className="motion-ribbon-group" key={copy}>
        <span>Milano Racing</span><i/><span className="ribbon-outline">Always the fastest</span><i/><span>STEM Racing</span><i/>
      </span>)}
    </div>
  </div>;
}
