import { useState } from "react";
import { asset } from "../assets";
import { Press } from "../motion";

const charts = [
  { name: "Drag by version", image: "01_drag_by_version.svg", caption: "Drag across the four illustrative versions, at an example airspeed of 20 m/s." },
  { name: "Drag breakdown", image: "02_v4_drag_breakdown.svg", caption: "How components contribute to the illustrative MK 4 drag total." },
  { name: "Convergence", image: "03_convergence.svg", caption: "An example of simulation results settling over successive iterations." },
  { name: "Wing angle", image: "04_wing_sweep.svg", caption: "An illustrative sweep from −4° to 6°, comparing drag and downforce." },
  { name: "Pressure", image: "05_pressure_coefficient.svg", caption: "Example pressure-coefficient distributions along the top centreline of MK 1 and MK 4." },
  { name: "Drag & mass", image: "06_drag_and_mass.svg", caption: "Drag and mass across the same illustrative version series." },
];
export default function EngineeringCharts() {
  const [index, setIndex] = useState(0);
  const chart = charts[index];
  return <section className="engineering-charts section" id="charts">
    <div className="section-heading"><h2>Inside the airflow.</h2><p>Illustrative data</p></div>
    <div className="chart-switcher" role="group" aria-label="Choose engineering chart">{charts.map((item, i) => <Press key={item.name} aria-pressed={i === index} onClick={() => setIndex(i)} className={i === index ? "selected" : ""}>{item.name}</Press>)}</div>
    <figure className="engineering-chart"><img src={asset(chart.image)} alt={chart.caption} width="1680" height="1120" loading="lazy"/><figcaption aria-live="polite">{chart.caption}</figcaption></figure>
    <a className="text-link chart-download" href={asset(chart.image)} download={chart.image}>Download full-size chart ↓</a>
  </section>;
}
