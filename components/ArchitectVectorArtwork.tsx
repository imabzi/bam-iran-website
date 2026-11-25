import { useId } from "react";

/*
  Minimal architectural line drawings, used in place of portraits on the
  homepage Leading Architects cards. Original artwork, drawn from geometry:
  a tower elevation with a curved facade, an axonometric structural frame and
  a low-rise arcade composition. Lines use currentColor and the accent uses
  --accent, so the drawing follows the theme. Strokes do not scale, so lines
  stay hairline-crisp at every size.
*/

export type ArtworkVariant = 0 | 1 | 2;

const W = 300;
const H = 400;
const range = (from: number, to: number, step: number) => {
  const values: number[] = [];
  for (let value = from; value <= to + 0.001; value += step) values.push(Math.round(value * 100) / 100);
  return values;
};

function DraftingGrid() {
  return (
    <g className="va-grid">
      {range(25, W - 25, 25).map((x) => <line key={`x${x}`} x1={x} y1={0} x2={x} y2={H} />)}
      {range(25, H - 25, 25).map((y) => <line key={`y${y}`} x1={0} y1={y} x2={W} y2={y} />)}
    </g>
  );
}

function DimensionLine({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g className="va-faint">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 5} y1={y1 + 5} x2={x + 5} y2={y1 - 5} />
      <line x1={x - 5} y1={y2 + 5} x2={x + 5} y2={y2 - 5} />
      <line x1={x - 9} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 9} y1={y2} x2={x + 4} y2={y2} />
    </g>
  );
}

// 1 — A tower elevation with a curved facade on a glazed podium.
function Tower({ clipId }: { clipId: string }) {
  const tower = "M95 300 V146 Q95 70 178 62 H215 V300 Z";
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={tower} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g className="va-faint">{range(126, 200, 30).map((x) => <line key={x} x1={x} y1={40} x2={x} y2={300} />)}</g>
        <g className="va-line">{range(80, 296, 18).map((y) => <line key={y} x1={80} y1={y} x2={230} y2={y} />)}</g>
        <line className="va-accent" x1={80} y1={206} x2={230} y2={206} />
      </g>
      <path className="va-strong" d={tower} />
      <rect className="va-strong" x={60} y={300} width={190} height={50} />
      <g className="va-line">{range(79, 231, 19).map((x) => <line key={x} x1={x} y1={300} x2={x} y2={350} />)}</g>
      <line className="va-strong" x1={20} y1={350} x2={280} y2={350} />
      <DimensionLine x={262} y1={62} y2={350} />
    </>
  );
}

// 2 — An axonometric structural frame: three bays by two, four floors.
function Frame() {
  const cos = Math.cos(Math.PI / 6);
  const sin = Math.sin(Math.PI / 6);
  const bay = 38;
  const floor = 44;
  // Centred: the frame spans x 68–233 and y 74–345.
  const origin = { x: 134, y: 250 };
  const point = (x: number, y: number, z: number) => ({
    x: origin.x + (x - z) * bay * cos,
    y: origin.y + (x + z) * bay * sin - y * floor,
  });
  const line = (a: [number, number, number], b: [number, number, number], key: string, className = "va-line") => {
    const p = point(...a);
    const q = point(...b);
    return <line key={key} className={className} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
  };
  const xs = [0, 1, 2, 3];
  const zs = [0, 1, 2];
  const floors = [0, 1, 2, 3, 4];
  const ground = [point(0, 0, 0), point(3, 0, 0), point(3, 0, 2), point(0, 0, 2)];
  const slab = (y: number) => [point(0, y, 0), point(3, y, 0), point(3, y, 2), point(0, y, 2)];

  return (
    <>
      <polygon className="va-faint" points={ground.map((p) => `${p.x},${p.y + 22}`).join(" ")} />
      {xs.flatMap((x) => zs.map((z) => line([x, 0, z], [x, 4, z], `c${x}${z}`, x === 0 || z === 0 ? "va-strong" : "va-line")))}
      {floors.flatMap((y) => [
        ...zs.map((z) => line([0, y, z], [3, y, z], `bx${y}${z}`, y === 4 && z === 0 ? "va-strong" : "va-line")),
        ...xs.map((x) => line([x, y, 0], [x, y, 2], `bz${y}${x}`, y === 4 && x === 0 ? "va-strong" : "va-line")),
      ])}
      <polygon className="va-strong va-nofill" points={slab(4).map((p) => `${p.x},${p.y}`).join(" ")} />
      {/* One bay of the top floor, picked out in the accent colour. */}
      <polygon
        className="va-accent va-nofill"
        points={[point(2, 3, 0), point(3, 3, 0), point(3, 4, 0), point(2, 4, 0)].map((p) => `${p.x},${p.y}`).join(" ")}
      />
      <line className="va-strong" x1={18} y1={378} x2={282} y2={378} />
    </>
  );
}

// 3 — A low-rise composition: an arcade, a slatted tower and a brick volume.
function Arcade() {
  const arches = range(38, 122, 21);
  return (
    <>
      <rect className="va-strong" x={30} y={200} width={120} height={140} />
      <rect className="va-strong" x={150} y={238} width={120} height={102} />
      <rect className="va-strong" x={108} y={112} width={42} height={88} />
      <g className="va-line">{range(116, 142, 6.5).map((x) => <line key={x} x1={x} y1={122} x2={x} y2={190} />)}</g>
      <g className="va-line">
        {arches.map((x) => (
          <path key={x} d={`M${x} 340 V306 A8.5 8.5 0 0 1 ${x + 17} 306 V340`} />
        ))}
      </g>
      <g className="va-line">
        {range(222, 266, 18).map((y) => <line key={y} x1={42} y1={y} x2={138} y2={y} />)}
        {range(54, 126, 24).map((x) => <line key={x} x1={x} y1={214} x2={x} y2={276} />)}
      </g>
      <g className="va-faint">
        {range(248, 332, 8).map((y, row) =>
          range(row % 2 ? 158 : 166, 262, 16).map((x) => <line key={`${x}-${y}`} x1={x} y1={y} x2={x + 10} y2={y} />)
        )}
      </g>
      <circle className="va-accent va-nofill" cx={226} cy={140} r={15} />
      <line className="va-strong" x1={18} y1={340} x2={282} y2={340} />
      <line className="va-faint va-dashed" x1={18} y1={366} x2={282} y2={366} />
    </>
  );
}

export function ArchitectVectorArtwork({ variant, className }: { variant: ArtworkVariant; className?: string }) {
  const clipId = useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`vector-artwork ${className ?? ""}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <DraftingGrid />
      {variant === 0 && <Tower clipId={`tower-${clipId}`} />}
      {variant === 1 && <Frame />}
      {variant === 2 && <Arcade />}
    </svg>
  );
}
