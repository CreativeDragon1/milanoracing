import LiveryPreview from "../components/LiveryPreview";
import { EngineeringChartPreview } from "../components/EngineeringCharts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { posts } from "../content";
import { Press, Reveal } from "../motion";

import { asset, nav, ArrowLink, Eyebrow, Heading } from "../components/site";
export default function Journal() {
  const [filter, setFilter] = useState("All");
  const visible = posts.filter(
    (p) => filter === "All" || p.category === filter,
  );
  return (
    <>
      <Heading
        title="The work in progress."
        description="Design details, engineering records and glimpses behind the scenes. An honest notebook of what we have so far."
      />
      <div
        className="journal-filters segmented"
        role="group"
        aria-label="Filter journal"
      >
        {["All", "Engineering", "Design", "Team"].map((f) => (
          <Press
            key={f}
            className={filter === f ? "selected" : ""}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </Press>
        ))}
      </div>
      <div aria-live="polite" className="sr-only">
        {visible.length} journal entries
      </div>
      <div className="journal-grid">
        {visible.map((post) => (
          <Reveal key={post.id}>
            <Link className="story-link" to={`/journal/${post.id}`}>
              <div className={`story-image ${post.id}`}>
                {post.id === "livery" ? <LiveryPreview compact /> : post.id === "drag-log" ? <EngineeringChartPreview/> : <img src={asset(post.image)} alt={post.caption} loading="lazy" />}
                <span className="round-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="story-meta">
                {post.category}
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>

    </>
  );
}
