import { useMemo, type CSSProperties } from "react";
import type { MascotExpression, PersonaShape } from "../types";
import "./Mascot.css";

type Props = {
  color: string;
  shape: PersonaShape;
  size?: number;
  expression?: MascotExpression;
  phase?: number;
  label?: string;
};

const BLOB =
  "M62 18C78 12 98 22 108 40C118 58 116 78 104 94C92 110 70 118 50 112C30 106 16 90 14 70C12 50 24 28 46 20C51 18 57 19 62 18Z";

export function Mascot({
  color,
  shape,
  size = 96,
  expression = "idle",
  phase = 0,
  label,
}: Props) {
  const motion = useMemo(() => {
    const blinkMs = 80 + Math.round((phase % 1) * 40);
    const blinkGap = 2.4 + (phase % 1) * 2.4;
    const glanceDelay = 0.3 + (phase % 1) * 0.6;
    const squishDelay = (phase * 0.37) % 1.1;
    const tilt = 4 + (phase % 1) * 2;
    return {
      "--blink-duration": `${blinkMs}ms`,
      "--blink-gap": `${blinkGap}s`,
      "--glance-delay": `${glanceDelay}s`,
      "--squish-delay": `${squishDelay}s`,
      "--tilt": `${tilt}deg`,
      "--phase": `${phase}s`,
    } as CSSProperties;
  }, [phase]);

  return (
    <div
      className={`mascot mascot--${expression}`}
      style={{ width: size, height: size, ...motion }}
      aria-label={label || "마스코트"}
      role="img"
    >
      <div className="mascot__squish">
        <svg viewBox="0 0 120 120" width={size} height={size}>
          {shape === "circle" && (
            <circle cx="60" cy="62" r="46" fill={color} />
          )}
          {shape === "square" && (
            <rect x="16" y="18" width="88" height="88" rx="22" fill={color} />
          )}
          {shape === "blob" && <path d={BLOB} fill={color} />}
          <ellipse cx="44" cy="40" rx="16" ry="9" fill="#FFFFFF" opacity="0.22" />
          <g className="mascot__face">
            <g className="mascot__eye mascot__eye--left">
              <ellipse cx="44" cy="58" rx="11" ry="14" fill="#FFFFFF" />
              <circle className="mascot__pupil" cx="46" cy="60" r="4.2" fill="#1A1714" />
            </g>
            <g className="mascot__eye mascot__eye--right">
              <ellipse cx="76" cy="58" rx="11" ry="14" fill="#FFFFFF" />
              <circle className="mascot__pupil" cx="74" cy="60" r="4.2" fill="#1A1714" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
