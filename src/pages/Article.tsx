import LiveryPreview from "../components/LiveryPreview";
import { Link, useLocation } from "react-router-dom";
import { posts } from "../content";

import { asset, nav, ArrowLink, Eyebrow, Heading } from "../components/site";
import NotFound from "./NotFound";
import JerseyViewer from "../components/JerseyViewer";
export default function Article() {
  const { pathname } = useLocation();
  const post = posts.find((p) => pathname === `/journal/${p.id}`);
  if (!post) return <NotFound />;
  if (post.id === "livery") return <article className="article livery-coming-article">
    <Link className="text-link" to="/journal">← Back to journal</Link>
    <Heading title="A new look. Under wraps." description={null} />
    <LiveryPreview />
    <div className="livery-release-footer"><p>Our next livery. Revealed on release day.</p><ArrowLink to="/evolution">Explore the car archive</ArrowLink></div>
  </article>;
  return (
    <article className={`article ${post.id === "livery" ? "livery-article" : ""}`}>
      <Link className="text-link" to="/journal">
        ← Back to journal
      </Link>
      <Heading
        label={post.category}
        title={post.title}
        description={post.excerpt}
      />
      {post.id === "jersey" ? <JerseyViewer /> : post.image && (
        <img
          className={`article-image ${post.id}`}
          src={asset(post.image)}
          alt={post.caption}
        />
      )}
      <div className="article-body">
        {post.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <span className="source-note">
          Source: {post.caption.toLowerCase()}.
        </span>
        <div className="actions">
          <ArrowLink to={post.id === "jersey" ? "/team#team-kit" : "/evolution"}>
            {post.id === "jersey"
              ? "Explore the team kit"
              : "Explore the car archive"}
          </ArrowLink>
        </div>
      </div>
    </article>
  );
}
