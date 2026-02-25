"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import {
  PageShell, PageContent, AppBar,
  Card, Label, Divider, ResRow, TotalRow,
  ActionButtons,
} from "@/components/ui";

type DiameterMode = "outer" | "mid" | "inner";

const MODES: { value: DiameterMode; label: string }[] = [
  { value: "outer", label: "Внешний диаметр" },
  { value: "mid",   label: "Средний диаметр" },
  { value: "inner", label: "Внутренний диаметр" },
];

/** Calculates the strip width needed to roll into a tube. */
function calcTube(mode: DiameterMode, thickness: number, diameter: number) {
  let midDiameter: number;
  switch (mode) {
    case "outer": midDiameter = diameter - thickness;        break;
    case "mid":   midDiameter = diameter;                    break;
    case "inner": midDiameter = diameter + thickness;        break;
  }
  const outerDiam  = midDiameter + thickness;
  const innerDiam  = midDiameter - thickness;
  const stripWidth = Math.PI * midDiameter;
  return {
    midDiameter:  +midDiameter.toFixed(3),
    outerDiameter: +outerDiam.toFixed(3),
    innerDiameter: +innerDiam.toFixed(3),
    stripWidth:    +stripWidth.toFixed(3),
  };
}

// ─── SVG diagram ─────────────────────────────────────────────────────────────
function TubeDiagram({ mode }: { mode: DiameterMode }) {
  return (
    <svg viewBox="0 0 280 170" width="100%" style={{ display: "block" }}>
      {/* Amber background gradient */}
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8E1"/>
          <stop offset="100%" stopColor="#FFE082"/>
        </linearGradient>
        <linearGradient id="tubeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0E0E0"/>
          <stop offset="50%" stopColor="#BDBDBD"/>
          <stop offset="100%" stopColor="#9E9E9E"/>
        </linearGradient>
        <linearGradient id="tubeHole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#757575"/>
          <stop offset="100%" stopColor="#424242"/>
        </linearGradient>
      </defs>
      <rect width="280" height="170" rx="8" fill="url(#bg)"/>

      {/* Tube body — cylinder side */}
      <rect x="60" y="52" width="170" height="66" rx="0" fill="url(#tubeBody)"/>

      {/* Front ellipse face */}
      <ellipse cx="230" cy="85" rx="12" ry="33" fill="#D0D0D0" stroke="#9E9E9E" strokeWidth="1"/>

      {/* Back ellipse face */}
      <ellipse cx="60" cy="85" rx="22" ry="33" fill="#C0C0C0" stroke="#888" strokeWidth="1.5"/>

      {/* Inner hole on back face */}
      <ellipse cx="60" cy="85" rx="12" ry="19" fill="url(#tubeHole)" stroke="#616161" strokeWidth="1"/>

      {/* ── Dimension A: wall thickness ───────────────────────────── */}
      {/* Vertical bracket on left face showing wall thickness */}
      <line x1="38" y1="66" x2="38" y2="85" stroke="#c00" strokeWidth="1.5"/>
      <line x1="34" y1="66" x2="42" y2="66" stroke="#c00" strokeWidth="1.5"/>
      <line x1="34" y1="85" x2="42" y2="85" stroke="#c00" strokeWidth="1.5"/>
      <text x="26" y="78" fontSize="13" fontWeight="800" fill="#c00" textAnchor="middle">A</text>

      {/* ── Dimension B: chosen diameter ──────────────────────────── */}
      {/* Horizontal dimension arrow on right side */}
      {mode === "outer" ? (
        // Outer diameter — full height of tube body
        <>
          <line x1="245" y1="52" x2="245" y2="118" stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="52"  x2="249" y2="52"  stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="118" x2="249" y2="118" stroke="#c00" strokeWidth="1.5"/>
          <text x="260" y="90" fontSize="13" fontWeight="800" fill="#c00" textAnchor="middle">B</text>
        </>
      ) : mode === "inner" ? (
        // Inner diameter — height of the hole
        <>
          <line x1="245" y1="66" x2="245" y2="104" stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="66"  x2="249" y2="66"  stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="104" x2="249" y2="104" stroke="#c00" strokeWidth="1.5"/>
          <text x="260" y="90" fontSize="13" fontWeight="800" fill="#c00" textAnchor="middle">B</text>
        </>
      ) : (
        // Middle diameter — mid line
        <>
          <line x1="245" y1="59" x2="245" y2="111" stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="59"  x2="249" y2="59"  stroke="#c00" strokeWidth="1.5"/>
          <line x1="241" y1="111" x2="249" y2="111" stroke="#c00" strokeWidth="1.5"/>
          <text x="260" y="90" fontSize="13" fontWeight="800" fill="#c00" textAnchor="middle">B</text>
          {/* Center dashed line */}
          <line x1="60" y1="85" x2="230" y2="85" stroke="#c00" strokeWidth="1" strokeDasharray="4 3"/>
        </>
      )}

      {/* Label at bottom */}
      <text x="140" y="155" fontSize="11" fill={MD.textMed} textAnchor="middle" fontStyle="italic">
        {mode === "outer" ? "B = Внешний диаметр" : mode === "inner" ? "B = Внутренний диаметр" : "B = Средний диаметр"}
      </text>
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TubePage() {
  const router = useRouter();
  const [mode, setMode]           = useState<DiameterMode>("outer");
  const [thickness, setThickness] = useState("");
  const [diameter, setDiameter]   = useState("");
  const [result, setResult]       = useState<ReturnType<typeof calcTube> | null>(null);

  function handleCalculate() {
    const a = parseFloat(thickness), b = parseFloat(diameter);
    if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) return;
    setResult(calcTube(mode, a, b));
  }
  function handleClear() { setThickness(""); setDiameter(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт ширины заготовки для изготовления трубки" onBack={() => router.back()} />

      <PageContent>
        {/* Diameter mode tabs */}
        <div style={{ background: MD.surface, borderRadius: 12, boxShadow: MD.elevation1, display: "flex", overflow: "hidden" }}>
          {MODES.map(m => (
            <button key={m.value} onClick={() => { setMode(m.value); setResult(null); }}
              style={{
                flex: 1, padding: "12px 4px", border: "none",
                borderBottom: mode === m.value ? `3px solid ${MD.primary}` : "3px solid transparent",
                background: mode === m.value ? MD.primaryLight : "transparent",
                color: mode === m.value ? MD.primary : MD.textMed,
                fontWeight: mode === m.value ? 700 : 400,
                fontSize: 12, cursor: "pointer", transition: "all 0.18s",
                lineHeight: 1.3, textAlign: "center",
              }}
            >{m.label}</button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Толщина заготовки (A)\nмм.", value: thickness, set: setThickness },
            { label: "Диаметр (B)\nмм.",           value: diameter,  set: setDiameter  },
          ].map(({ label, value, set }) => (
            <Card key={label} style={{ flex: 1 }}>
              <Label style={{ whiteSpace: "pre-line", textTransform: "none", fontSize: 11, lineHeight: 1.4 }}>{label}</Label>
              <input type="number" inputMode="decimal" value={value}
                onChange={e => { set(e.target.value); setResult(null); }}
                placeholder="0.0"
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 22, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
              />
              <div style={{ height: 2, background: MD.divider, borderRadius: 1, marginTop: 6 }} />
            </Card>
          ))}
        </div>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result card */}
        <Card>
          <Label>Результат</Label>
          {result ? (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow label="Внешний диаметр"  value={`${result.outerDiameter} мм`} />
              <Divider />
              <ResRow label="Средний диаметр"  value={`${result.midDiameter} мм`} />
              <Divider />
              <ResRow label="Внутренний диаметр" value={`${result.innerDiameter} мм`} />
              <Divider />
              <TotalRow label="Ширина заготовки" value={`${result.stripWidth} мм`} />
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Diagram */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Диаметр</Label>
          <TubeDiagram mode={mode} />
        </Card>

      </PageContent>
    </PageShell>
  );
}
