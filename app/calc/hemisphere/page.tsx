"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import {
  PageShell, PageContent, AppBar,
  Card, Label, ActionButtons,
} from "@/components/ui";

/**
 * Blank diameter needed to stamp/press into a hemisphere:
 *  D_blank = D_sphere × √2
 */
function calcHemisphere(sphereDiam: number) {
  const blank = +(sphereDiam * Math.SQRT2).toFixed(2);
  const radius = +(sphereDiam / 2).toFixed(3);
  const surfaceArea = +(2 * Math.PI * radius * radius).toFixed(3); // half-sphere surface
  const volume = +((2 / 3) * Math.PI * Math.pow(radius, 3)).toFixed(3);
  return { blank, surfaceArea, volume };
}

// ─── SVG diagram ────────────────────────────────────────────────────────────
function HemisphereDiagram({ diam, blank }: { diam: number; blank: number }) {
  return (
    <svg viewBox="0 0 280 160" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="hbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8E1"/>
          <stop offset="100%" stopColor="#FFE082"/>
        </linearGradient>
        <linearGradient id="hsphere" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0E0E0"/>
          <stop offset="100%" stopColor="#9E9E9E"/>
        </linearGradient>
      </defs>
      <rect width="280" height="160" rx="8" fill="url(#hbg)"/>

      {/* ── Left side: hemisphere ─────────────────────────── */}
      {/* dome arc */}
      <path d="M 30 110 A 50 50 0 0 1 130 110" fill="url(#hsphere)" stroke="#888" strokeWidth="1.5"/>
      {/* flat base */}
      <ellipse cx="80" cy="110" rx="50" ry="8" fill="#BDBDBD" stroke="#888" strokeWidth="1"/>
      {/* center dashed vertical radius */}
      <line x1="80" y1="60" x2="80" y2="110" stroke="#c00" strokeWidth="1" strokeDasharray="3 2"/>
      {/* radius label */}
      <text x="84" y="88" fontSize="10" fill="#c00" fontWeight="700">r</text>
      {/* diameter arrow */}
      <line x1="30" y1="125" x2="130" y2="125" stroke="#c00" strokeWidth="1.5"/>
      <line x1="30" y1="121" x2="30" y2="129"  stroke="#c00" strokeWidth="1.5"/>
      <line x1="130" y1="121" x2="130" y2="129" stroke="#c00" strokeWidth="1.5"/>
      <text x="80" y="140" textAnchor="middle" fontSize="10" fill="#c00" fontWeight="700">
        {diam > 0 ? `D = ${diam} мм` : "D сферы"}
      </text>

      {/* ── Right side: flat blank circle ───────────────────── */}
      <circle cx="210" cy="90" r="42" fill="#E8E8E8" stroke="#888" strokeWidth="1.5"/>
      {/* diameter arrow */}
      <line x1="168" y1="108" x2="252" y2="108" stroke="#c00" strokeWidth="1.5"/>
      <line x1="168" y1="104" x2="168" y2="112" stroke="#c00" strokeWidth="1.5"/>
      <line x1="252" y1="104" x2="252" y2="112" stroke="#c00" strokeWidth="1.5"/>
      <text x="210" y="127" textAnchor="middle" fontSize="10" fill="#c00" fontWeight="700">
        {blank > 0 ? `⌀ ${blank} мм` : "⌀ заготовки"}
      </text>
      {/* arrow label */}
      <text x="210" y="55" textAnchor="middle" fontSize="9" fill={MD.textMed}>Заготовка (D×√2)</text>

      {/* ── Arrow in middle ───────────────────────────────── */}
      <text x="152" y="88" textAnchor="middle" fontSize="16" fill={MD.primary}>→</text>
    </svg>
  );
}

export default function HemispherePage() {
  const router = useRouter();
  const [diam, setDiam]     = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcHemisphere> | null>(null);

  const diamNum = parseFloat(diam) || 0;

  function handleCalculate() {
    const d = parseFloat(diam);
    if (isNaN(d) || d <= 0) return;
    setResult(calcHemisphere(d));
  }
  function handleClear() { setDiam(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт заготовки для изготовления полусферы" onBack={() => router.back()} />

      <PageContent>
        {/* Input */}
        <Card>
          <Label style={{ textTransform: "none", fontSize: 13, letterSpacing: 0 }}>Диаметр сферы мм.</Label>
          <input
            type="number" inputMode="decimal" value={diam}
            onChange={e => { setDiam(e.target.value); setResult(null); }}
            placeholder="0.0"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
          />
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, marginTop: 6, opacity: 0.7 }} />
        </Card>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <p style={{ color: MD.textMed, fontStyle: "italic", fontSize: 13, margin: "0 0 12px" }}>Результат</p>
          {result ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: MD.textHigh, fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>
                Диаметр заготовки
              </p>
              <p style={{ color: MD.primary, fontWeight: 800, fontSize: 36, margin: 0 }}>
                {result.blank} мм.
              </p>
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, textAlign: "center", padding: "16px 0", margin: 0 }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Diagram */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Схема</Label>
          <HemisphereDiagram diam={diamNum} blank={result?.blank ?? 0} />
          <p style={{ color: MD.textLow, fontSize: 11, textAlign: "center", margin: "10px 0 0", fontStyle: "italic" }}>
            D_заготовки = D_сферы × √2 ≈ D × 1.4142
          </p>
        </Card>
      </PageContent>
    </PageShell>
  );
}
