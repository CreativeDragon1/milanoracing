import KitShortcut from "../components/KitShortcut";
import LiveryPreview from "../components/LiveryPreview";
import CompetitionCountdown from "../components/CompetitionCountdown";
import SponsorLogo from "../components/SponsorLogo";
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
            We’re Milano Racing, a team from Singapore competing in STEM Racing.
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
        <Reveal className="hero-visual" delay={.08}>
          <Link to="/journal/livery" className="hero-livery-link" aria-label="Discover the upcoming Milano Racing livery"><LiveryPreview /></Link>
        </Reveal>
      </section>
      <CompetitionCountdown/>
      <section className="intro section">
        <Reveal>
          <h2>
            Every detail is
            <br />a decision.
          </h2>
          <svg className="intro-team-logo logo-light" viewBox="25 230 555 185" role="img" aria-label="Milano Racing logo">
            <image href={asset("milano-official.png")} width="648" height="648" />
          </svg>
          <svg className="intro-team-logo logo-dark" viewBox="0 0 555 185" role="img" aria-label="Milano Racing logo"><image href={asset("milano-dark.svg")} width="555" height="185"/></svg>
        </Reveal>
        <Reveal className="intro-copy" delay={.08}>
          <p className="large-copy">A miniature car. A whole team of ideas.</p>
          <p>
            We design and develop our car for STEM Racing, bringing together
            aerodynamics, engineering, communication and planning.
          </p>
          <p>
            Explore how our car has evolved, from early concepts to our latest design.
          </p>
          <Link className="text-link" to="/team">
            The people behind the project <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </section>
      <Reveal as="section" className="archive-preview raised">
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
              <span>{car.label}</span>
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
      </Reveal>
      <Reveal as="section" className="kit-signature">
        <Link to="/team#team-kit" className="kit-signature-link" aria-label="Explore and personalise the Milano team kit"><KitShortcut/></Link>
        <div className="kit-signature-copy"><h2>Made to stand<br/>for something.</h2><p>From the workshop to competition day, our kit brings the team together. Explore the details and make it your own.</p><ArrowLink to="/team#team-kit">Explore & personalise the kit</ArrowLink></div>
      </Reveal>
      <section className="section journal-preview">
        <Reveal className="section-heading">
          <div>
            <h2>The work behind the car.</h2>
          </div>
          <Link className="text-link" to="/journal">
            Visit the journal <ArrowUpRight size={18} />
          </Link>
        </Reveal>
        <div className="home-story-grid">
          {posts.slice(0, 2).map((post, index) => (
            <Reveal key={post.id} delay={index * .07}><Link
              to={`/journal/${post.id}`}
              className="story-link"
              key={post.id}
            >
              <div className={`story-image ${post.id}`}>
                {post.id === "livery" ? <LiveryPreview compact /> : post.id === "jersey" ? <KitShortcut/> : <img
                  src={asset(post.image!)}
                  loading="lazy"
                  alt={post.caption}
                />}
                <span className="round-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="story-meta">
                {post.category}
              </div>
              <h3>{post.title}</h3>
            </Link></Reveal>
          ))}
        </div>
      </section>
      <Reveal as="section" className="partners-home">
        <div>
          <span className="small-label">Supported by</span>
          <Link to="/partners" className="text-link">
            Our partners <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="partners-logo-grid" aria-label="Our sponsors">
          {sponsors.map((s) => (
            <a className="partner-logo-link" key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={`Visit ${s.name}`}>
              <SponsorLogo image={s.image} name={s.name} />
            </a>
          ))}
        </div>
      </Reveal>
    </>
  );
}
