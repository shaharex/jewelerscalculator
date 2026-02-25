"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { getProbes, type MetalType } from "@/lib/metals";
import {
  PageShell, PageContent, AppBar,
  MetalTabs, ProbeRow,
  Card, Label, Divider, ResRow, TotalRow,
  ActionButtons,
} from "@/components/ui";

type ShapeType = "cubic" | "cylinder" | "sphere";

const SHAPES: { value: ShapeType; label: string }[] = [
  { value: "cubic",    label: "Кубические\nформы" },
  { value: "cylinder", label: "Цилиндрические\nформы" },
  { value: "sphere",   label: "Шарообразные\nформы" },
];

function calcVolume(shape: ShapeType, a: number, b: number, c: number): number {
  switch (shape) {
    case "cubic":    return a * b * c;                                  // L × W × H (mm³)
    case "cylinder": return Math.PI * (b / 2) * (c / 2) * a;          // ellipse cross-section × length
    case "sphere":   return (4 / 3) * Math.PI * (a / 2) * (b / 2) * (c / 2); // tri-axial ellipsoid
  }
}

// ─── SVG thumbnails ──────────────────────────────────────────────────────────
function CubicThumb({ active }: { active: boolean }) {
  const s = active ? MD.primary : MD.textMed;
  return (
    <svg viewBox="0 0 80 56" width="70" height="50">
      <rect width="80" height="56" rx="5" fill={active ? MD.primaryLight : MD.bg}/>
      {/* isometric box */}
      <polygon points="12,18 44,8 68,22 68,42 44,52 12,38" fill="#E8E8E8" stroke={s} strokeWidth="1.5"/>
      <polygon points="12,18 44,8 44,28 12,38" fill="#D0D0D0" stroke={s} strokeWidth="1.5"/>
      <polygon points="44,8 68,22 68,42 44,52 44,28" fill="#BDBDBD" stroke={s} strokeWidth="1.5"/>
      {/* A arrow */}
      <line x1="22" y1="11" x2="58" y2="15" stroke="#c00" strokeWidth="1.2"/>
      <text x="38" y="10" fontSize="8" fontWeight="700" fill="#c00" textAnchor="middle">A</text>
      {/* B arrow */}
      <line x1="12" y1="38" x2="44" y2="52" stroke="#c00" strokeWidth="1.2"/>
      <text x="22" y="52" fontSize="8" fontWeight="700" fill="#c00">B</text>
      {/* C arrow */}
      <line x1="68" y1="22" x2="68" y2="42" stroke="#c00" strokeWidth="1.2"/>
      <text x="71" y="34" fontSize="8" fontWeight="700" fill="#c00">C</text>
    </svg>
  );
}

function CylinderThumb({ active }: { active: boolean }) {
  const s = active ? MD.primary : MD.textMed;
  return (
    <svg viewBox="0 0 80 56" width="70" height="50">
      <rect width="80" height="56" rx="5" fill={active ? MD.primaryLight : MD.bg}/>
      {/* oval cylinder */}
      <rect x="8" y="20" width="64" height="16" rx="0" fill="#BDBDBD" stroke={s} strokeWidth="1.3"/>
      <ellipse cx="8" cy="28" rx="8" ry="11" fill="#D0D0D0" stroke={s} strokeWidth="1.3"/>
      <ellipse cx="72" cy="28" rx="8" ry="11" fill="#C8C8C8" stroke={s} strokeWidth="1.3"/>
      {/* A = length */}
      <line x1="8" y1="44" x2="72" y2="44" stroke="#c00" strokeWidth="1.2"/>
      <text x="40" y="52" fontSize="8" fontWeight="700" fill="#c00" textAnchor="middle">A</text>
      {/* B / C = axes */}
      <line x1="72" y1="17" x2="72" y2="28" stroke="#c00" strokeWidth="1.2"/>
      <text x="74" y="24" fontSize="8" fontWeight="700" fill="#c00">B</text>
      <line x1="64" y1="28" x2="72" y2="28" stroke="#c00" strokeWidth="1.2"/>
      <text x="67" y="37" fontSize="8" fontWeight="700" fill="#c00">C</text>
    </svg>
  );
}

function SphereThumb({ active }: { active: boolean }) {
  const s = active ? MD.primary : MD.textMed;
  return (
    <svg viewBox="0 0 80 56" width="70" height="50">
      <rect width="80" height="56" rx="5" fill={active ? MD.primaryLight : MD.bg}/>
      <circle cx="40" cy="28" r="22" fill="#D8D8D8" stroke={s} strokeWidth="1.3"/>
      <ellipse cx="40" cy="28" rx="22" ry="9" fill="none" stroke={s} strokeWidth="1" strokeDasharray="3 2"/>
      {/* A horizontal */}
      <line x1="18" y1="28" x2="62" y2="28" stroke="#c00" strokeWidth="1.2"/>
      <text x="40" y="24" fontSize="8" fontWeight="700" fill="#c00" textAnchor="middle">A</text>
      {/* B vertical */}
      <line x1="40" y1="6" x2="40" y2="50" stroke="#c00" strokeWidth="1.2" strokeDasharray="2 2"/>
      <text x="43" y="15" fontSize="8" fontWeight="700" fill="#c00">B</text>
      {/* C depth arrow */}
      <line x1="52" y1="34" x2="62" y2="40" stroke="#c00" strokeWidth="1.2"/>
      <text x="63" y="43" fontSize="8" fontWeight="700" fill="#c00">C</text>
    </svg>
  );
}

// ─── Large diagram ────────────────────────────────────────────────────────────
function ShapeDiagram({ shape, a, b, c }: { shape: ShapeType; a: number; b: number; c: number }) {
  return (
    <svg viewBox="0 0 280 170" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="wpbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8E1"/>
          <stop offset="100%" stopColor="#FFE082"/>
        </linearGradient>
      </defs>
      <rect width="280" height="170" rx="8" fill="url(#wpbg)"/>

      {shape === "cubic" && (
        <>
          {/* isometric box */}
          <polygon points="24,60 120,30 220,60 220,120 120,150 24,120" fill="#E8E8E8" stroke="#666" strokeWidth="1.5"/>
          <polygon points="24,60 120,30 120,90 24,120" fill="#D0D0D0" stroke="#666" strokeWidth="1.5"/>
          <polygon points="120,30 220,60 220,120 120,150 120,90" fill="#C0C0C0" stroke="#666" strokeWidth="1.5"/>
          {/* A */}
          <line x1="40" y1="48" x2="200" y2="42" stroke="#c00" strokeWidth="1.5"/>
          <line x1="40" y1="44" x2="40" y2="52" stroke="#c00" strokeWidth="1.5"/>
          <line x1="200" y1="38" x2="200" y2="46" stroke="#c00" strokeWidth="1.5"/>
          <text x="120" y="38" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c00">A{a > 0 ? ` = ${a}мм` : ""}</text>
          {/* B */}
          <line x1="24" y1="120" x2="120" y2="150" stroke="#c00" strokeWidth="1.5"/>
          <text x="56" y="158" fontSize="13" fontWeight="800" fill="#c00">B{b > 0 ? ` = ${b}мм` : ""}</text>
          {/* C */}
          <line x1="228" y1="60" x2="228" y2="120" stroke="#c00" strokeWidth="1.5"/>
          <line x1="224" y1="60" x2="232" y2="60" stroke="#c00" strokeWidth="1.5"/>
          <line x1="224" y1="120" x2="232" y2="120" stroke="#c00" strokeWidth="1.5"/>
          <text x="244" y="95" fontSize="13" fontWeight="800" fill="#c00">C{c > 0 ? `=${c}` : ""}</text>
        </>
      )}

      {shape === "cylinder" && (
        <>
          <rect x="20" y="60" width="200" height="50" fill="#C8C4C0" stroke="#666" strokeWidth="1.5"/>
          <ellipse cx="20"  cy="85" rx="16" ry="28" fill="#D8D4D0" stroke="#666" strokeWidth="1.5"/>
          <ellipse cx="220" cy="85" rx="16" ry="28" fill="#B8B4B0" stroke="#666" strokeWidth="1.5"/>
          {/* A */}
          <line x1="20" y1="120" x2="220" y2="120" stroke="#c00" strokeWidth="1.5"/>
          <line x1="20" y1="116" x2="20" y2="124" stroke="#c00" strokeWidth="1.5"/>
          <line x1="220" y1="116" x2="220" y2="124" stroke="#c00" strokeWidth="1.5"/>
          <text x="120" y="140" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c00">A{a > 0 ? ` = ${a}мм` : ""}</text>
          {/* B */}
          <line x1="220" y1="57" x2="220" y2="85" stroke="#c00" strokeWidth="1.5"/>
          <text x="240" y="73" fontSize="13" fontWeight="800" fill="#c00">B{b > 0 ? `=${b}` : ""}</text>
          {/* C */}
          <line x1="204" y1="85" x2="220" y2="85" stroke="#c00" strokeWidth="1.5"/>
          <text x="240" y="95" fontSize="13" fontWeight="800" fill="#c00">C{c > 0 ? `=${c}` : ""}</text>
        </>
      )}

      {shape === "sphere" && (
        <>
          <circle cx="140" cy="85" r="65" fill="#D8D8D8" stroke="#666" strokeWidth="1.5"/>
          <ellipse cx="140" cy="85" rx="65" ry="22" fill="none" stroke="#666" strokeWidth="1" strokeDasharray="4 3"/>
          {/* A horizontal */}
          <line x1="75" y1="85" x2="205" y2="85" stroke="#c00" strokeWidth="1.5"/>
          <line x1="75" y1="81" x2="75" y2="89" stroke="#c00" strokeWidth="1.5"/>
          <line x1="205" y1="81" x2="205" y2="89" stroke="#c00" strokeWidth="1.5"/>
          <text x="140" y="78" textAnchor="middle" fontSize="13" fontWeight="800" fill="#c00">A{a > 0 ? ` = ${a}мм` : ""}</text>
          {/* B vertical */}
          <line x1="140" y1="20" x2="140" y2="150" stroke="#c00" strokeWidth="1.5" strokeDasharray="4 3"/>
          <text x="147" y="36" fontSize="13" fontWeight="800" fill="#c00">B{b > 0 ? `=${b}` : ""}</text>
          {/* C depth */}
          <line x1="180" y1="100" x2="196" y2="118" stroke="#c00" strokeWidth="1.5"/>
          <text x="200" y="128" fontSize="13" fontWeight="800" fill="#c00">C{c > 0 ? `=${c}` : ""}</text>
        </>
      )}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WeightParamsPage() {
  const router = useRouter();
  const [metal, setMetal]       = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [shape, setShape]       = useState<ShapeType>("cubic");
  const [a, setA] = useState(""); // Length / Length / A-axis
  const [b, setB] = useState(""); // Width  / B-axis / B-axis
  const [c, setC] = useState(""); // Height / C-axis / C-axis
  const [result, setResult] = useState<{ volume: number; weight: number } | null>(null);

  const selectedProbe = (getProbes(metal))[probeIndex] ?? getProbes(metal)[0];

  function handleMetalTab(m: MetalType) { setMetal(m); setProbeIndex(0); setResult(null); }

  function handleCalculate() {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);
    if (isNaN(av) || av <= 0 || isNaN(bv) || bv <= 0 || isNaN(cv) || cv <= 0) return;
    const volume = calcVolume(shape, av, bv, cv);            // mm³
    const weight = +((volume / 1000) * selectedProbe.density).toFixed(3); // g
    setResult({ volume: +volume.toFixed(3), weight });
  }

  function handleClear() { setA(""); setB(""); setC(""); setResult(null); }

  const aVal = parseFloat(a) || 0;
  const bVal = parseFloat(b) || 0;
  const cVal = parseFloat(c) || 0;

  const inputLabels: Record<ShapeType, [string, string, string]> = {
    cubic:    ["Длина\n(A)", "Ширина\n(B)", "Толщина\n(C)"],
    cylinder: ["Длина\n(A)", "Ось B",        "Ось C"        ],
    sphere:   ["Ось A",      "Ось B",        "Ось C"        ],
  };
  const [labelA, labelB, labelC] = inputLabels[shape];

  return (
    <PageShell>
      <AppBar title="Расчёт веса по параметрам" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />
        <ProbeRow metal={metal} probeIndex={probeIndex} onProbeChange={i => { setProbeIndex(i); setResult(null); }} />

        {/* Shape selector */}
        <Card style={{ padding: "12px 10px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {SHAPES.map(s => (
              <button key={s.value} onClick={() => { setShape(s.value); setResult(null); }}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, padding: "6px 4px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${shape === s.value ? MD.primary : MD.divider}`, background: shape === s.value ? MD.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {shape === s.value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}/>}
                </div>
                <span style={{ color: shape === s.value ? MD.primary : MD.textMed, fontSize: 11, fontWeight: shape === s.value ? 700 : 400, whiteSpace: "pre-line", textAlign: "left", lineHeight: 1.3 }}>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Shape thumbnails */}
          <div style={{ display: "flex", gap: 8, justifyContent: "space-around", padding: "4px 0" }}>
            <div onClick={() => { setShape("cubic");    setResult(null); }} style={{ cursor: "pointer" }}><CubicThumb    active={shape === "cubic"}    /></div>
            <div onClick={() => { setShape("cylinder"); setResult(null); }} style={{ cursor: "pointer" }}><CylinderThumb active={shape === "cylinder"} /></div>
            <div onClick={() => { setShape("sphere");   setResult(null); }} style={{ cursor: "pointer" }}><SphereThumb   active={shape === "sphere"}   /></div>
          </div>
        </Card>

        {/* Three inputs in one row card */}
        <Card style={{ padding: "12px 0" }}>
          <div style={{ display: "flex" }}>
            {[
              { label: labelA, value: a, set: setA },
              { label: labelB, value: b, set: setB },
              { label: labelC, value: c, set: setC },
            ].map(({ label, value, set }, idx) => (
              <div key={label} style={{ flex: 1, padding: "0 12px", borderRight: idx < 2 ? `1px solid ${MD.divider}` : "none", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: MD.textLow, fontSize: 10.5, fontWeight: 500, whiteSpace: "pre-line", lineHeight: 1.3 }}>{label}</span>
                <input type="number" inputMode="decimal" value={value}
                  onChange={e => { set(e.target.value); setResult(null); }}
                  placeholder="0.0"
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: value ? MD.textHigh : MD.textLow, fontSize: 17, fontWeight: 600, caretColor: MD.primary }}
                />
                <span style={{ color: MD.textLow, fontSize: 11 }}>мм.</span>
              </div>
            ))}
          </div>
        </Card>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <p style={{ color: MD.textMed, fontStyle: "italic", fontSize: 13, margin: "0 0 8px" }}>Результат</p>
          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow label="Объём" value={`${result.volume} мм³`} />
              <Divider />
              <TotalRow label="Вес металла" value={`${result.weight} г`} />
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, textAlign: "center", padding: "12px 0", margin: 0 }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Diagram card */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Форма</Label>
          <ShapeDiagram shape={shape} a={aVal} b={bVal} c={cVal} />
        </Card>

      </PageContent>
    </PageShell>
  );
}
