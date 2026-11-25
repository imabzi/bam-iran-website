import Image from "next/image";
import type { Architect } from "@/data/architects";

/*
  The architect's portrait frame (3:4). It shows a supplied portrait of the
  architect personally when one exists, and otherwise a minimal vector
  placeholder: a head-and-shoulders line drawing with drafting construction
  lines for a person, or a geometric monogram for a practice. Project
  photographs are never used here.
*/

function PersonPlaceholder({ seed }: { seed: number }) {
  // A small, deterministic variation per architect: the accent's position.
  const accentAngle = [-38, -142, -64][seed % 3];
  const rad = (accentAngle * Math.PI) / 180;
  const ax = 150 + 52 * Math.cos(rad);
  const ay = 150 + 52 * Math.sin(rad);
  return (
    <>
      <g className="pp-construction">
        <circle cx={150} cy={150} r={84} />
        <line x1={150} y1={40} x2={150} y2={400} className="pp-dashed" />
        <line x1={40} y1={150} x2={260} y2={150} className="pp-dashed" />
        <line x1={66} y1={268} x2={234} y2={268} />
      </g>
      <g className="pp-figure">
        <circle cx={150} cy={150} r={52} />
        <path d="M134 199 L136 232 M166 199 L164 232" />
        <path d="M52 400 C54 312 92 262 150 262 C208 262 246 312 248 400" />
        <path d="M126 268 L150 300 L174 268" />
      </g>
      <circle className="pp-accent" cx={ax} cy={ay} r={3.2} />
      <line className="pp-accent-line" x1={150} y1={318} x2={150} y2={344} />
    </>
  );
}

function PracticePlaceholder({ letter }: { letter: string }) {
  return (
    <>
      <g className="pp-construction">
        <rect x={70} y={110} width={160} height={180} />
        <line x1={150} y1={60} x2={150} y2={340} className="pp-dashed" />
        <line x1={40} y1={200} x2={260} y2={200} className="pp-dashed" />
      </g>
      <text x={150} y={236} textAnchor="middle" className="pp-letter">{letter}</text>
      <line className="pp-accent-line" x1={70} y1={302} x2={110} y2={302} />
    </>
  );
}

export function ArchitectPortraitPlaceholder({ architect, seed = 0 }: { architect: Architect; seed?: number }) {
  const letter = (architect.name.en ?? architect.name.fa ?? "").trim().charAt(0).toUpperCase();
  return (
    <svg viewBox="0 0 300 400" className="portrait-placeholder" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <g className="pp-grid">
        {Array.from({ length: 11 }, (_, index) => (index + 1) * 25).map((x) => <line key={`x${x}`} x1={x} y1={0} x2={x} y2={400} />)}
        {Array.from({ length: 15 }, (_, index) => (index + 1) * 25).map((y) => <line key={`y${y}`} x1={0} y1={y} x2={300} y2={y} />)}
      </g>
      {architect.kind === "practice" ? <PracticePlaceholder letter={letter} /> : <PersonPlaceholder seed={seed} />}
    </svg>
  );
}

export function ArchitectPortrait({ architect, seed = 0, sizes, priority = false, alt }: { architect: Architect; seed?: number; sizes: string; priority?: boolean; alt: string }) {
  return (
    <div className="architect-portrait">
      {architect.portrait ? (
        <Image
          src={architect.portrait.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="architect-portrait-image"
          style={{ objectPosition: architect.portrait.position }}
        />
      ) : (
        <ArchitectPortraitPlaceholder architect={architect} seed={seed} />
      )}
    </div>
  );
}
