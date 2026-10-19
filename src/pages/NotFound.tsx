import { asset, nav, ArrowLink, Eyebrow, Heading } from "../components/site";
export default function NotFound() {
  return (
    <div className="not-found">
      <Eyebrow>404 / Off the track</Eyebrow>
      <h1>
        This page isn’t
        <br />
        in the archive.
      </h1>
      <ArrowLink to="/">Back to home</ArrowLink>
    </div>
  );
}
