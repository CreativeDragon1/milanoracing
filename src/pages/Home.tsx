import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cars, posts, sponsors } from "../content";
import { Reveal } from "../motion";

import { asset, ArrowLink, SingaporeFlag } from "../components/site";
export default function Home() {
  return (
    <>
      <section className="hero">
        <Reveal className="hero-copy">
          <h1>
            Small car.
            <br />
            <span className="blue">Big thinking</span>
            <span className="orange period">.</span>
          </h1>
          <p>
            We’re Milano Racing. A STEM Racing team turning curiosity
            into a car, one considered detail at a time.
          </p>
          <div className="actions">
            <ArrowLink to="/evolution">Explore the car</ArrowLink>
            <ArrowLink to="/team" light>
              Meet the team
            </ArrowLink>
          </div>
          <div className="hero-location">
            Singapore <SingaporeFlag/>
          </div>
        </Reveal>
        <Reveal className="hero-visual">
          <div className="hero-image">
            <img
              src={asset("current-car.webp")}
              alt="Actual Milano Racing miniature STEM Racing car with current black livery and sponsor decals"
              fetchPriority="high"
            />
          </div>
        </Reveal>
      </section>
      <section className="intro section">
        <Reveal>
          <h2>
            Every detail is
            <br />a decision.
          </h2>
        </Reveal>
        <Reveal className="intro-copy">
          <p className="large-copy">A miniature car. A whole team of ideas.</p>
          <p>
            We’re Milano Racing, based in Singapore.
            Design, aerodynamics, engineering, communication and planning all
            meet in one small car.
          </p>
          <p>
            Our archive makes that process visible: the versions, the design process
            and the questions still to be answered.
          </p>
          <Link className="text-link" to="/team">
            The people behind the project <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </section>
      <section className="archive-preview raised">
        <div className="archive-copy">
          <h2>
            Progress has
            <br />a paper trail.
          </h2>
          <p>
            Explore how drag, mass and airflow influence a design, with interactive charts that bring the engineering process into view.
          </p>
          <ArrowLink to="/evolution">Open the development archive</ArrowLink>
        </div>
        <div className="mini-chart">
          <div className="chart-heading">
            <span>DRAG BY VERSION</span>
            <span>NEWTONS / N</span>
          </div>
          {cars.map((car, i) => (
            <div className="bar-row" key={car.id}>
              <span>{car.id}</span>
              <div className="bar-track">
                <div
                  className={i === 1 ? "bar blue-bar" : "bar"}
                  style={{ width: `${(car.dragN / 0.7) * 100}%` }}
                />
              </div>
              <strong>{car.dragN.toFixed(3)}</strong>
            </div>
          ))}
          <p className="data-note">
            Illustrative data
          </p>
        </div>
      </section>
      <section className="kit-signature">
        <div className="kit-signature-art" aria-hidden="true"><img src={asset("kit-dragon-original.png")} alt=""/><span>THE MILANO<br/>SIGNATURE.</span><i/><b/></div>
        <div className="kit-signature-copy"><h2>Made to stand<br/>for something.</h2><p>From the workshop to competition day, our kit brings the team together. Explore the details and make it your own.</p><ArrowLink to="/team#team-kit">Explore & personalise the kit</ArrowLink></div>
      </section>
      <section className="section journal-preview">
        <div className="section-heading">
          <div>
            <h2>The work behind the car.</h2>
          </div>
          <Link className="text-link" to="/journal">
            Visit the journal <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-story-grid">
          {posts.slice(0, 2).map((post) => (
            <Link
              to={`/journal/${post.id}`}
              className="story-link"
              key={post.id}
            >
              <div className={`story-image ${post.id}`}>
                <img
                  src={asset(post.image!)}
                  loading="lazy"
                  alt={post.caption}
                />
                <span className="round-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="story-meta">
                {post.category}
              </div>
              <h3>{post.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="partner-strip">
        <div>
          <span className="small-label">Supported by</span>
          <Link to="/partners" className="text-link">
            Our partners <ArrowUpRight size={16} />
          </Link>
        </div>
        {sponsors.map((s) => (
          <img key={s.name} src={asset(s.image)} alt={s.name} loading="lazy" />
        ))}
      </section>
    </>
  );
}
