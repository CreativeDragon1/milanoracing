import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownToLine, ArrowLeft, ArrowRight } from "lucide-react";
import { engineeringCharts, chartCsv, type ChartData } from "../lib/engineeringCharts";
import "./EngineeringCharts.css";

const format = (n: number, unit: string) => n.toLocaleString("en-US", { minimumFractionDigits: unit === "g" ? 1 : 3, maximumFractionDigits: unit === "g" ? 1 : 4 });
function Plot({ chart, point, onPoint, hidden }: { chart: ChartData; point: number; onPoint: (n: number) => void; hidden: string[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(Math.max(240, entries[0].contentRect.width)));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const panels = chart.split ? chart.series.map(s => [s]) : [chart.series];
  const height = chart.split ? 190 : 340;
  const left = 47, right = width - 18, top = 30, bottom = height - 42;
  const x = (i: number) => left + (chart.x[i] - chart.x[0]) / (chart.x.at(-1)! - chart.x[0]) * (right - left);
  function inspect(clientX: number, rect: DOMRect) {
    const fraction = Math.max(0, Math.min(1, ((clientX - rect.left) * width / rect.width - left) / (right - left)));
    const value = chart.x[0] + fraction * (chart.x.at(-1)! - chart.x[0]);
    onPoint(chart.x.reduce((best, v, i) => Math.abs(v - value) < Math.abs(chart.x[best] - value) ? i : best, 0));
  }
  return <div className="ec-plot" ref={host}>
    {panels.map((series, panel) => {
      const domain = chart.domains[panel] ?? chart.domains[0];
      const y = (value: number) => bottom - (value - domain[0]) / (domain[1] - domain[0]) * (bottom - top);
      const ticks = Array.from({ length: 5 }, (_, i) => domain[0] + i * (domain[1] - domain[0]) / 4);
      const tickCount = Math.min(width < 400 ? 4 : 6, chart.x.length);
      const xTicks = [...new Set(Array.from({ length: tickCount }, (_, i) => Math.round(i * (chart.x.length - 1) / (tickCount - 1))))];
      return <svg key={panel} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${chart.name}, ${chart.split ? series[0].name : series.map(s => s.name).join(' and ')}. Use the point slider below to inspect exact values.`}
        onPointerMove={e => { if (e.pointerType === "mouse" || e.buttons) inspect(e.clientX, e.currentTarget.getBoundingClientRect()); }}
        onPointerDown={e => inspect(e.clientX, e.currentTarget.getBoundingClientRect())}>
        <text x={left} y={15} className="ec-axis-title">{chart.split ? `${series[0].name} / ${series[0].unit}` : series[0].unit === "Cp" ? "Pressure coefficient / Cp" : "Force / N"}</text>
        {ticks.map(t => <g key={t}><line x1={left} x2={right} y1={y(t)} y2={y(t)} className={Math.abs(t) < .0001 ? "ec-zero" : "ec-gridline"}/><text x={left - 10} y={y(t) + 4} textAnchor="end" className="ec-axis">{Number(t.toFixed(2))}</text></g>)}
        {domain[0] < 0 && <line x1={left} x2={right} y1={y(0)} y2={y(0)} className="ec-zero"/>}
        {xTicks.map(i => <text key={i} x={x(i)} y={height - 15} textAnchor={i === 0 ? "start" : i === chart.x.length - 1 ? "end" : "middle"} className="ec-axis">{chart.labels[i]}</text>)}
        <line x1={x(point)} x2={x(point)} y1={top} y2={bottom} className="ec-crosshair"/>
        {series.filter(s => !hidden.includes(s.name)).map(s => <g key={s.name}>
          <motion.path className="ec-curve" d={s.values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")} stroke={s.color} strokeDasharray={s.dash} fill="none" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .5 }}/>
          <circle cx={x(point)} cy={y(s.values[point])} r={5} fill={s.color} stroke="white" strokeWidth={2}/>
        </g>)}
      </svg>;
    })}
    <p className="ec-x-label">{chart.xLabel}</p>
  </div>;
}
function ChartPanel({ chart }: { chart: ChartData }) {
  const [point, setPoint] = useState(chart.defaultPoint);
  const [hidden, setHidden] = useState<string[]>([]);
  const [csvUrl, setCsvUrl] = useState("");
  useEffect(() => {
    const url = URL.createObjectURL(new Blob([chartCsv(chart)], { type: "text/csv;charset=utf-8" }));
    setCsvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [chart]);
  const reduced = useReducedMotion();
  const sliderId = useId();
  const total = chart.series[0].values.reduce((a, b) => a + b, 0);
  return <div className="ec-panel">
    <div className="ec-workspace">
      <div className="ec-visual">
        <div className="ec-legend" role="group" aria-label="Visible chart series">
          {chart.series.map(s => <button key={s.name} type="button" aria-pressed={!hidden.includes(s.name)} disabled={!hidden.includes(s.name) && chart.series.length - hidden.length === 1} onClick={() => setHidden(hidden.includes(s.name) ? hidden.filter(n => n !== s.name) : [...hidden, s.name])}><span style={{ background: s.color }} />{s.name}{s.dash && <span className="ec-dash" aria-hidden="true">{s.dash === '2 5' ? '···' : '– –'}</span>}</button>)}
        </div>
        {chart.type === "bars" ? <div className="ec-bars" aria-label={chart.name}>
          {chart.labels.map((label, i) => <button key={label} className={`ec-bar-row ${point === i ? "is-active" : ""}`} aria-pressed={point === i} onClick={() => setPoint(i)} onMouseEnter={() => setPoint(i)} onFocus={() => setPoint(i)}>
            <span className="ec-bar-label">{label}</span><strong>{format(chart.series[0].values[i], "N")} <small>N</small></strong>
            <span className="ec-bar-track"><motion.span initial={reduced ? false : { width: 0 }} animate={{ width: `${chart.series[0].values[i] / chart.domains[0][1] * 100}%` }} transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : i * .045 }}/></span>
          </button>)}
          <div className="ec-bar-scale"><span>0 N</span><span>{chart.domains[0][1]} N</span></div>
        </div> : <Plot chart={chart} point={point} onPoint={setPoint} hidden={hidden}/>}
        <div className="ec-scrub">
          <label htmlFor={sliderId}>{chart.xLabel}<strong>{chart.labels[point]}</strong></label>
          <div className="ec-scrub-controls"><button aria-label="Previous data point" disabled={point === 0} onClick={() => setPoint(point - 1)}><ArrowLeft size={16}/></button><input id={sliderId} type="range" min={0} max={chart.x.length - 1} value={point} onChange={e => setPoint(Number(e.target.value))} aria-valuetext={`${chart.labels[point]}; ${chart.series.filter(s => !hidden.includes(s.name)).map(s => `${s.name} ${format(s.values[point], s.unit)} ${s.unit}`).join(', ')}`}/><button aria-label="Next data point" disabled={point === chart.x.length - 1} onClick={() => setPoint(point + 1)}><ArrowRight size={16}/></button></div>
        </div>
      </div>
      <aside className="ec-readout" aria-label="Selected data values">
        <div className="ec-headline"><span>{chart.headlineLabel}</span><strong>{chart.headline}</strong></div>
        <div className="ec-point"><span>{chart.xLabel}</span><h3>{chart.labels[point]}</h3></div>
        <dl>{chart.series.filter(s => !hidden.includes(s.name)).map(s => <div key={s.name}><dt>{s.name}</dt><dd>{format(s.values[point], s.unit)} <small>{s.unit}</small></dd></div>)}</dl>
        {chart.id === "breakdown" && <p className="ec-share">{(chart.series[0].values[point] / total * 100).toFixed(1)}% <span>of total drag</span></p>}
        <p className="ec-caption">{chart.caption}</p>
        <span className="ec-data-label">Illustrative data</span>
      </aside>
    </div>
    <div className="ec-data-tools">
      <details><summary>View data table</summary><div className="ec-table-scroll" tabIndex={0} role="region" aria-label={`${chart.name} data table`}><table><caption>{chart.name} · illustrative data</caption><thead><tr><th scope="col">{chart.xLabel}</th>{chart.series.map(s => <th scope="col" key={s.name}>{s.name} ({s.unit})</th>)}</tr></thead><tbody>{chart.x.map((_, i) => <tr key={i}><th scope="row">{chart.labels[i]}</th>{chart.series.map(s => <td key={s.name}>{s.values[i]}</td>)}</tr>)}</tbody></table></div></details>
      <a href={csvUrl || undefined} download={`milano-${chart.id}-illustrative.csv`}><ArrowDownToLine size={16}/>Download data</a>
    </div>
  </div>;
}
export default function EngineeringCharts({ initialChart = "drag" }: { initialChart?: string }) {
  const [selected, setSelected] = useState(initialChart);
  const chart = engineeringCharts.find(c => c.id === selected) ?? engineeringCharts[0];
  return <section className="engineering-charts ec-section section" id="charts">
    <div className="section-heading"><h2>Inside the airflow.</h2><p>Explore the numbers.</p></div>
    <div className="ec-switcher" role="group" aria-label="Choose engineering chart">{engineeringCharts.map(item => <button key={item.id} type="button" aria-pressed={item.id === selected} onClick={() => setSelected(item.id)}>{item.name}</button>)}</div>
    <ChartPanel key={chart.id} chart={chart}/>
  </section>;
}
export function EngineeringChartPreview() {
  const chart = engineeringCharts[2];
  return <div className="ec-preview"><svg viewBox="0 0 640 300" role="img" aria-label="Illustrative convergence of drag across MK 1 to MK 4"><path d="M30 80H610 M30 150H610 M30 220H610" stroke="#ffffff20" fill="none"/>{chart.series.map((s, si) => <path key={s.name} d={s.values.map((v, i) => `${i ? 'L' : 'M'}${30 + i / 100 * 580},${260 - (v - .4) / .7 * 230}`).join(' ')} fill="none" stroke={["#ffffff", "#ff7a00", "#ffffff88", "#ffffff55"][si]} strokeDasharray={s.dash} strokeWidth={3}/>)}</svg><span>Inside the airflow <ArrowRight size={18}/></span></div>;
}
