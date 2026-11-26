import type { ReactNode } from "react";

// Abstract architectural linework for the history milestones that have no
// period photograph. Deliberately diagrammatic (survey grids, structural
// axes, a network diagram, a perspective horizon) so it can never be read as
// a drawing of a real BAM building. Strokes follow currentColor; paths marked
// `draw` trace themselves in when their milestone becomes active (CSS).

export type DrawingId = "origin" | "foundation" | "network" | "horizon";

function Frame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg viewBox="0 0 800 500" className="history-drawing" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {children}
      </g>
    </svg>
  );
}

// 1995: a site survey. Dotted grid, terrain contours, a datum and a first
// dashed outline: the beginning of a practice, before any building.
function Origin() {
  const dots = [];
  for (let x = 80; x <= 720; x += 40) for (let y = 60; y <= 440; y += 40) dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="currentColor" stroke="none" opacity=".35" />);
  return (
    <Frame>
      {dots}
      <g opacity=".55">
        <path className="draw" pathLength={1} d="M60 380 C180 340 260 360 360 320 S560 250 740 270" />
        <path className="draw" pathLength={1} d="M60 410 C200 380 280 395 380 360 S580 300 740 310" />
        <path className="draw" pathLength={1} d="M60 440 C210 420 300 430 400 400 S600 350 740 350" />
      </g>
      <path className="draw accent" pathLength={1} strokeDasharray="6 6" d="M300 170h200v120H300z" />
      <path d="M400 150v-24M388 138h24" />
      <circle cx="400" cy="138" r="7" />
      <g transform="translate(680 90)">
        <path d="M0 22V-22M0-22l-7 14M0-22l7 14" />
        <circle r="26" opacity=".5" />
      </g>
      <path d="M100 470h120M100 465v10M160 467v6M220 465v10" opacity=".7" />
    </Frame>
  );
}

// 2004: structural axes with column points and a single elevation outline,
// the founding of a construction company.
function Foundation() {
  const xs = [160, 280, 400, 520, 640];
  const ys = [110, 190, 270, 350];
  return (
    <Frame>
      <g opacity=".45" strokeDasharray="2 6">
        {xs.map((x) => <path key={`x${x}`} d={`M${x} 70V410`} />)}
        {ys.map((y) => <path key={`y${y}`} d={`M120 ${y}H680`} />)}
      </g>
      {xs.map((x, i) => (
        <g key={`bx${x}`}>
          <circle cx={x} cy="48" r="14" />
          <text x={x} y="53" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" opacity=".75">{String.fromCharCode(65 + i)}</text>
        </g>
      ))}
      {ys.map((y, i) => (
        <g key={`by${y}`}>
          <circle cx="94" cy={y} r="14" />
          <text x="94" y={y + 5} textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" opacity=".75">{i + 1}</text>
        </g>
      ))}
      {xs.flatMap((x) => ys.map((y) => <rect key={`c${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" fill="currentColor" stroke="none" opacity=".6" />))}
      <path className="draw accent" pathLength={1} strokeWidth="1.6" d="M160 350V190h120v-80h240v80h120v160" />
      <path d="M120 430h560" />
      <path className="draw" pathLength={1} opacity=".6" d="M160 470h480M160 462v16M640 462v16" />
    </Frame>
  );
}

// 2024: a network diagram of the markets named in the history. Positions are
// schematic, not a map.
function Network({ labels }: { labels: Record<"iran" | "uae" | "armenia" | "tajikistan", string> }) {
  const nodes = {
    iran: { x: 400, y: 260 },
    armenia: { x: 210, y: 120 },
    tajikistan: { x: 640, y: 110 },
    uae: { x: 470, y: 430 },
  } as const;
  const hub = nodes.iran;
  return (
    <Frame>
      <g opacity=".35" strokeDasharray="1 7">
        <circle cx={hub.x} cy={hub.y} r="90" />
        <circle cx={hub.x} cy={hub.y} r="180" />
        <circle cx={hub.x} cy={hub.y} r="270" />
      </g>
      {(["armenia", "tajikistan", "uae"] as const).map((key) => {
        const node = nodes[key];
        const mx = (hub.x + node.x) / 2 + (node.y - hub.y) * 0.18;
        const my = (hub.y + node.y) / 2 - (node.x - hub.x) * 0.18;
        return <path key={key} className="draw accent" pathLength={1} strokeDasharray="5 5" d={`M${hub.x} ${hub.y}Q${mx} ${my} ${node.x} ${node.y}`} />;
      })}
      {(Object.keys(nodes) as Array<keyof typeof nodes>).map((key) => {
        const node = nodes[key];
        const main = key === "iran";
        return (
          <g key={key}>
            <circle cx={node.x} cy={node.y} r={main ? 10 : 6} fill={main ? "currentColor" : "none"} className={main ? "node-main" : undefined} />
            <circle cx={node.x} cy={node.y} r={main ? 22 : 15} opacity=".5" />
            <text x={node.x} y={node.y + (main ? 46 : 36)} textAnchor="middle" fontSize="17" fill="currentColor" stroke="none">{labels[key]}</text>
          </g>
        );
      })}
    </Frame>
  );
}

// 2032: a perspective horizon. Rays to a vanishing point and dashed volumes:
// a vision, explicitly not a design.
function Horizon() {
  const vp = { x: 400, y: 210 };
  const rays = [-420, -260, -140, -40, 40, 140, 260, 420];
  return (
    <Frame>
      <path d="M40 210h720" />
      <g opacity=".45">
        {rays.map((dx) => <path key={dx} className="draw" pathLength={1} d={`M${vp.x} ${vp.y}L${vp.x + dx * 1.6} 480`} />)}
        {[250, 300, 370, 460].map((y) => <path key={y} d={`M40 ${y}h720`} opacity=".6" />)}
      </g>
      <g strokeDasharray="4 6" className="accent-group">
        <path className="draw accent" pathLength={1} d="M250 210v-70h50v70M318 210v-110h44v110M380 210v-150h40v150M438 210v-96h48v96M504 210v-60h56v60" />
      </g>
      <circle cx={vp.x} cy={vp.y} r="5" />
      <path d={`M${vp.x - 14} ${vp.y}h28M${vp.x} ${vp.y - 14}v28`} opacity=".6" />
    </Frame>
  );
}

export function HistoryDrawing({ id, networkLabels }: { id: DrawingId; networkLabels: Record<"iran" | "uae" | "armenia" | "tajikistan", string> }) {
  if (id === "origin") return <Origin />;
  if (id === "foundation") return <Foundation />;
  if (id === "network") return <Network labels={networkLabels} />;
  return <Horizon />;
}
