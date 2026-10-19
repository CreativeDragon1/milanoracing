import { asset } from "../assets";

// Original artwork bounds, excluding only the transparent padding in each PNG.
const artwork: Record<string, { size: [number, number]; bounds: [number, number, number, number] }> = {
  "hustle-hive.png": { size: [612, 408], bounds: [102, 117, 388, 164] },
  "npe.png": { size: [447, 447], bounds: [41, 147, 365, 152] },
  "enermax.png": { size: [403, 264], bounds: [44, 42, 323, 198] },
  "brindas.png": { size: [413, 292], bounds: [38, 92, 330, 108] },
  "axis.png": { size: [500, 500], bounds: [107, 100, 264, 329] },
};

export default function SponsorLogo({ image, name }: { image: string; name: string }) {
  const { size, bounds: [x, y, width, height] } = artwork[image];
  const ratio = width / height;
  // Equal optical area, with limits for especially wide or tall marks.
  const displayWidth = Math.min(220, Math.sqrt(14500 * ratio), 135 * ratio);
  const displayHeight = displayWidth / ratio;
  return (
    <svg className="partner-logo" viewBox="0 0 260 160" role="img" aria-label={name}>
      <svg x={(260 - displayWidth) / 2} y={(160 - displayHeight) / 2}
        width={displayWidth} height={displayHeight} viewBox={`${x} ${y} ${width} ${height}`}>
        <image href={asset(image)} width={size[0]} height={size[1]} />
      </svg>
    </svg>
  );
}
