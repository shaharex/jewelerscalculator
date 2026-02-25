"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import {
  PageShell, PageContent, AppBar,
  Card, Label, Divider, ResRow, TotalRow,
  ActionButtons,
} from "@/components/ui";

// ─── Fineness list (combined gold + silver probes) ────────────────────────────
interface ProbeOption { label: string; value: number; }

const PROBES: ProbeOption[] = [
  { label: "999", value: 999 },
  { label: "958 (23k)", value: 958 },
  { label: "916 (22k)", value: 916 },
  { label: "875 (21k)", value: 875 },
  { label: "750 (18k)", value: 750 },
  { label: "585 (14k)", value: 585 },
  { label: "500 (12k)", value: 500 },
  { label: "375 (9k)",  value: 375 },
  { label: "960",       value: 960 },
  { label: "925",       value: 925 },
  { label: "830",       value: 830 },
  { label: "800",       value: 800 },
];

// ─── Probe selector card ──────────────────────────────────────────────────────
function ProbeCard({
  title,
  probeIndex,
  onChange,
}: {
  title: string;
  probeIndex: number;
  onChange: (i: number) => void;
}) {
  const selected = PROBES[probeIndex] ?? PROBES[0];
  return (
    <Card>
      <Label style={{ fontSize: 10, lineHeight: 1.4, textTransform: "none" }}>{title}</Label>
      <p style={{ color: MD.textHigh, fontSize: 26, fontWeight: 700, margin: "6px 0 8px" }}>
        {selected.value}
      </p>
      <div style={{ position: "relative" }}>
        <select
          value={probeIndex}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            appearance: "none", WebkitAppearance: "none",
            width: "100%", background: "transparent", border: "none",
            outline: "none", color: MD.textMed, fontSize: 14,
            fontWeight: 500, cursor: "pointer", paddingRight: 20,
          }}
        >
          {PROBES.map((p, i) => (
            <option key={i} value={i}>{p.label}</option>
          ))}
        </select>
        <svg style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" fill={MD.textMed}/>
        </svg>
      </div>
    </Card>
  );
}

// ─── Calculation ──────────────────────────────────────────────────────────────
/**
 * Mix base metal (P1, W1) with ligature (P2) to reach desired fineness (Pd).
 * W2 = W1 * (Pd - P1) / (P2 - Pd)
 * Positive W2 = add ligature, Negative = needs higher-fineness addition.
 */
function calcMix(p1: number, w1: number, p2: number, pd: number) {
  if (p2 === pd) return null; // division by zero
  const w2    = w1 * (pd - p1) / (p2 - pd);
  const total = w1 + w2;
  const check = (p1 * w1 + p2 * w2) / total;
  return {
    ligatureWeight: +w2.toFixed(3),
    totalWeight:    +total.toFixed(3),
    resultingProbe: +check.toFixed(1),
    feasible: total > 0 && w2 >= 0,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MixPage() {
  const router = useRouter();
  const [baseProbeIdx,    setBaseProbeIdx]    = useState(1); // 958
  const [ligProbeIdx,     setLigProbeIdx]     = useState(8); // 960
  const [desiredProbeIdx, setDesiredProbeIdx] = useState(1); // 958
  const [baseWeight,      setBaseWeight]      = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcMix> | null>(null);

  const p1 = PROBES[baseProbeIdx].value;
  const p2 = PROBES[ligProbeIdx].value;
  const pd = PROBES[desiredProbeIdx].value;

  function handleCalculate() {
    const w1 = parseFloat(baseWeight);
    if (isNaN(w1) || w1 <= 0) return;
    setResult(calcMix(p1, w1, p2, pd));
  }
  function handleClear() { setBaseWeight(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Смешивание двух проб для получения новой пробы" onBack={() => router.back()} />

      <PageContent>
        {/* Row 1 — probe of base metal + weight of base metal */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <ProbeCard
              title="Проба основного металла"
              probeIndex={baseProbeIdx}
              onChange={i => { setBaseProbeIdx(i); setResult(null); }}
            />
          </div>

          <Card style={{ flex: 1 }}>
            <Label style={{ fontSize: 10, textTransform: "none" }}>Вес основного металла гр.</Label>
            <input
              type="number" inputMode="decimal" value={baseWeight}
              onChange={e => { setBaseWeight(e.target.value); setResult(null); }}
              placeholder="0.0"
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 26, fontWeight: 700, caretColor: MD.primary, margin: "10px 0 8px" }}
            />
            <div style={{ height: 2, background: MD.primary, borderRadius: 1, opacity: 0.7 }} />
          </Card>
        </div>

        {/* Row 2 — probe of ligature + desired probe */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <ProbeCard
              title="Проба лигатуры"
              probeIndex={ligProbeIdx}
              onChange={i => { setLigProbeIdx(i); setResult(null); }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <ProbeCard
              title="Желаемая проба"
              probeIndex={desiredProbeIdx}
              onChange={i => { setDesiredProbeIdx(i); setResult(null); }}
            />
          </div>
        </div>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <Label>Результат</Label>
          {result === null ? (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          ) : result === undefined || !result.feasible || result.totalWeight <= 0 ? (
            <div style={{ marginTop: 12, padding: "12px", background: "#FFF3E0", borderRadius: 8, border: "1px solid #FFB74D" }}>
              <p style={{ color: "#E65100", fontWeight: 700, fontSize: 14, margin: 0, textAlign: "center" }}>
                Невозможно получить желаемую пробу {pd} при данном сочетании
              </p>
              <p style={{ color: MD.textMed, fontSize: 12, margin: "8px 0 0", textAlign: "center" }}>
                {p2 === pd
                  ? "Проба лигатуры совпадает с желаемой пробой"
                  : p1 > pd && p2 > pd
                  ? "Обе пробы выше желаемой — добавьте менее чистый металл"
                  : "Проба лигатуры должна отличаться от желаемой пробы"}
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow
                label={`Масса основного металла (${p1})`}
                value={`${parseFloat(baseWeight).toFixed(3)} гр.`}
              />
              <Divider />
              <ResRow
                label={`Масса лигатуры (${p2})`}
                value={`${result.ligatureWeight} гр.`}
              />
              <Divider />
              <ResRow
                label="Итого"
                value={`${result.totalWeight} гр.`}
              />
              <Divider />
              <TotalRow label={`Проба сплава`} value={`${result.resultingProbe}`} />
            </div>
          )}
        </Card>

        {/* Info card */}
        <Card>
          <Label style={{ marginBottom: 10 }}>Справка</Label>
          <p style={{ color: MD.textMed, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Расчёт количества лигатуры, которое нужно добавить к основному металлу, чтобы получить сплав с желаемой пробой.
          </p>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MD.textMed, fontSize: 12 }}>Основной металл (P₁)</span>
              <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{p1} / 1000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MD.textMed, fontSize: 12 }}>Лигатура (P₂)</span>
              <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{p2} / 1000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: MD.textMed, fontSize: 12 }}>Желаемая проба (Pd)</span>
              <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{pd} / 1000</span>
            </div>
          </div>
          <Divider />
          <p style={{ color: MD.textLow, fontSize: 11, margin: 0, fontStyle: "italic" }}>
            Формула: W₂ = W₁ × (Pd − P₁) / (P₂ − Pd)
          </p>
        </Card>

      </PageContent>
    </PageShell>
  );
}
