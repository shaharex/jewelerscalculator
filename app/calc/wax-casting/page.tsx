"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const GOLD_PROBES = [
  { label: "999 (24k)", density: 19.3 },
  { label: "958 (23k)", density: 18.5 },
  { label: "916 (22k)", density: 17.8 },
  { label: "875 (21k)", density: 17.3 },
  { label: "750 (18k)", density: 15.5 },
  { label: "585 (14k)", density: 13.5 },
  { label: "500 (12k)", density: 12.0 },
  { label: "375 (9k)",  density: 11.5 },
];

const SILVER_PROBES = [
  { label: "999",  density: 10.49 },
  { label: "960",  density: 10.4  },
  { label: "925",  density: 10.36 },
  { label: "875",  density: 10.2  },
  { label: "830",  density: 10.0  },
  { label: "800",  density: 9.8   },
];

// ─── Material colour tokens ────────────────────────────────────────────────
const MD = {
  bg:       "#F5F5F5",   // MD grey-100
  surface:  "#FFFFFF",
  primary:  "#FFA000",   // MD amber-700
  onPrimary:"#FFFFFF",
  primary2: "#FFB300",   // amber-600 – lighter accent
  textHigh: "#212121",
  textMed:  "#616161",
  textLow:  "#9E9E9E",
  divider:  "#E0E0E0",
  elevation1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
  elevation2: "0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
  elevation3: "0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.1)",
};

export default function WaxCastingPage() {
  const router = useRouter();
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [waxWeight, setWaxWeight] = useState("");
  const [coefficient, setCoefficient] = useState(1);
  const [result, setResult] = useState<null | { metal: number; sprue: number; total: number }>(null);

  const probes = metal === "gold" ? GOLD_PROBES : SILVER_PROBES;
  const selectedProbe = probes[probeIndex] ?? probes[0];

  function handleMetalTab(m: "gold" | "silver") {
    setMetal(m);
    setProbeIndex(0);
    setResult(null);
  }

  function handleCalculate() {
    const w = parseFloat(waxWeight);
    if (isNaN(w) || w <= 0) return;
    const metalWeight = +(w * selectedProbe.density * (1 + coefficient / 100)).toFixed(2);
    const sprue       = +(metalWeight * 0.1).toFixed(2);
    setResult({ metal: metalWeight, sprue, total: +(metalWeight + sprue).toFixed(2) });
  }

  function handleClear() {
    setWaxWeight("");
    setCoefficient(1);
    setResult(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: MD.bg, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── App bar ── */}
        <header style={{
          background: MD.primary,
          padding: "0 8px",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 4,
          boxShadow: MD.elevation2,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#fff"/>
            </svg>
          </button>
          <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: 0.15 }}>
            Расчёт восковки
          </h1>
        </header>

        {/* ── Scrollable body ── */}
        <main style={{ flex: 1, padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>

          {/* Tabs */}
          <div style={{
            background: MD.surface,
            borderRadius: 12,
            boxShadow: MD.elevation1,
            display: "flex",
            overflow: "hidden",
          }}>
            {(["gold", "silver"] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleMetalTab(m)}
                style={{
                  flex: 1,
                  padding: "13px 0",
                  border: "none",
                  borderBottom: metal === m ? `3px solid ${MD.primary}` : "3px solid transparent",
                  background: "transparent",
                  color: metal === m ? MD.primary : MD.textMed,
                  fontWeight: metal === m ? 700 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  letterSpacing: 0.4,
                }}
              >
                {m === "gold" ? "Золото" : "Серебро"}
              </button>
            ))}
          </div>

          {/* Probe + Density */}
          <div style={{ display: "flex", gap: 12 }}>
            <Card style={{ flex: 1 }}>
              <Label>Проба металла</Label>
              <div style={{ position: "relative", marginTop: 4 }}>
                <select
                  value={probeIndex}
                  onChange={(e) => { setProbeIndex(Number(e.target.value)); setResult(null); }}
                  style={{
                    appearance: "none", WebkitAppearance: "none",
                    width: "100%", background: "transparent",
                    border: "none", outline: "none",
                    color: MD.textHigh, fontSize: 18,
                    fontWeight: 600, cursor: "pointer",
                    paddingRight: 22,
                  }}
                >
                  {probes.map((p, i) => (
                    <option key={i} value={i}>{p.label}</option>
                  ))}
                </select>
                <svg style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" fill={MD.textMed}/>
                </svg>
              </div>
            </Card>

            <Card style={{ minWidth: 110, alignItems: "center" }}>
              <Label style={{ textAlign: "center" }}>Плотность</Label>
              <p style={{ color: MD.textHigh, fontSize: 20, fontWeight: 700, margin: "6px 0 0" }}>
                {selectedProbe.density}
              </p>
              <p style={{ color: MD.textLow, fontSize: 12, margin: "2px 0 0" }}>г/см³</p>
            </Card>
          </div>

          {/* Wax weight */}
          <Card>
            <Label>Вес восковки</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <input
                type="number"
                inputMode="decimal"
                value={waxWeight}
                onChange={(e) => { setWaxWeight(e.target.value); setResult(null); }}
                placeholder="0.0"
                style={{
                  flex: 1, background: "transparent",
                  border: "none", outline: "none",
                  color: MD.textHigh, fontSize: 28, fontWeight: 700,
                  caretColor: MD.primary,
                }}
              />
              <span style={{ color: MD.textMed, fontWeight: 500, fontSize: 15 }}>гр.</span>
            </div>
            <div style={{ height: 2, background: MD.primary, borderRadius: 1, marginTop: 6, opacity: 0.7 }} />
          </Card>

          {/* Coefficient */}
          <Card>
            <Label>Добавить коэффициент</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <StepBtn label="−" onClick={() => { setCoefficient(c => Math.max(0, c - 1)); setResult(null); }} />
              <div style={{
                flex: 1, textAlign: "center", padding: "8px 0",
                background: MD.bg, borderRadius: 8,
                color: MD.textHigh, fontSize: 17, fontWeight: 600,
              }}>
                {coefficient}%
              </div>
              <StepBtn label="+" onClick={() => { setCoefficient(c => Math.min(50, c + 1)); setResult(null); }} />
            </div>
          </Card>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={handleClear}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 10,
                border: `1.5px solid ${MD.divider}`,
                background: MD.surface,
                color: MD.textMed, fontWeight: 600, fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 7, letterSpacing: 0.5,
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill={MD.textMed}>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              ОЧИСТИТЬ
            </button>
            <button
              onClick={handleCalculate}
              style={{
                flex: 1.6, padding: "14px 0", borderRadius: 10,
                border: "none",
                background: MD.primary,
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, letterSpacing: 0.8,
                boxShadow: MD.elevation2,
              }}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="#fff">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              РАССЧИТАТЬ
            </button>
          </div>

          {/* Result card */}
          <Card style={{ gap: 0 }}>
            <Label>Результат</Label>
            {result ? (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
                <ResRow label="Масса металла" value={`${result.metal} г`} />
                <div style={{ height: 1, background: MD.divider, margin: "8px 0" }} />
                <ResRow label="Литник (≈ 10%)" value={`${result.sprue} г`} />
                <div style={{ height: 1, background: MD.divider, margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span style={{ color: MD.textHigh, fontWeight: 700, fontSize: 15 }}>Итого</span>
                  <span style={{ color: MD.primary, fontWeight: 800, fontSize: 26 }}>{result.total} г</span>
                </div>
              </div>
            ) : (
              <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "12px 0" }}>
                Введите данные и нажмите «Рассчитать»
              </p>
            )}
          </Card>

        </main>
      </div>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "16px 16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      color: "#9E9E9E", fontSize: 12, fontWeight: 500,
      letterSpacing: "0.04em", textTransform: "uppercase", margin: 0,
      ...style,
    }}>
      {children}
    </p>
  );
}

function StepBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 44, height: 44, borderRadius: 10,
        background: "#FFF8E1",
        border: "1.5px solid #FFE082",
        color: "#F57F17", fontSize: 22, fontWeight: 400,
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

function ResRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#616161", fontSize: 14 }}>{label}</span>
      <span style={{ color: "#212121", fontWeight: 600, fontSize: 15 }}>{value}</span>
    </div>
  );
}
