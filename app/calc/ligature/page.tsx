"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { type MetalType } from "@/lib/metals";
import {
  PageShell, PageContent, AppBar,
  MetalTabs, ProbeRow,
  Card, Label, Divider, ResRow, TotalRow,
  ActionButtons,
} from "@/components/ui";

// ─── Alloy definitions ────────────────────────────────────────────────────────
// Each fraction must sum to 1 (100%)

interface AlloyComponent {
  metal: string;   // display name, e.g. "Золото (Au)"
  fraction: number; // 0–1
}

interface Alloy {
  label: string;
  components: AlloyComponent[];
}

const GOLD_ALLOYS: Alloy[] = [
  {
    label: "999 Чистое золото",
    components: [{ metal: "Золото (Au)", fraction: 1 }],
  },
  {
    label: "750 Жёлтый (ЗлСрМ 750-125)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.750 },
      { metal: "Серебро (Ag)", fraction: 0.125 },
      { metal: "Медь (Cu)",    fraction: 0.125 },
    ],
  },
  {
    label: "750 Красный (ЗлСрМ 750-50)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.750 },
      { metal: "Серебро (Ag)", fraction: 0.050 },
      { metal: "Медь (Cu)",    fraction: 0.200 },
    ],
  },
  {
    label: "750 Розовый (ЗлСрМ 750-90)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.750 },
      { metal: "Серебро (Ag)", fraction: 0.090 },
      { metal: "Медь (Cu)",    fraction: 0.160 },
    ],
  },
  {
    label: "750 Зелёный (ЗлСрМ 750-150)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.750 },
      { metal: "Серебро (Ag)", fraction: 0.150 },
      { metal: "Медь (Cu)",    fraction: 0.100 },
    ],
  },
  {
    label: "750 Белый (ЗлПд 750)",
    components: [
      { metal: "Золото (Au)",    fraction: 0.750 },
      { metal: "Палладий (Pd)", fraction: 0.250 },
    ],
  },
  {
    label: "750 Белый (ЗлСрПд 750)",
    components: [
      { metal: "Золото (Au)",    fraction: 0.750 },
      { metal: "Серебро (Ag)",  fraction: 0.085 },
      { metal: "Палладий (Pd)", fraction: 0.165 },
    ],
  },
  {
    label: "585 Жёлтый (ЗлСрМ 585-290)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.585 },
      { metal: "Серебро (Ag)", fraction: 0.290 },
      { metal: "Медь (Cu)",    fraction: 0.125 },
    ],
  },
  {
    label: "585 Красный (ЗлСрМ 585-80)",
    components: [
      { metal: "Золото (Au)",  fraction: 0.585 },
      { metal: "Серебро (Ag)", fraction: 0.080 },
      { metal: "Медь (Cu)",    fraction: 0.335 },
    ],
  },
  {
    label: "585 Розовый",
    components: [
      { metal: "Золото (Au)",  fraction: 0.585 },
      { metal: "Серебро (Ag)", fraction: 0.135 },
      { metal: "Медь (Cu)",    fraction: 0.280 },
    ],
  },
  {
    label: "585 Белый (ЗлПд 585)",
    components: [
      { metal: "Золото (Au)",    fraction: 0.585 },
      { metal: "Палладий (Pd)", fraction: 0.415 },
    ],
  },
  {
    label: "375 Жёлтый",
    components: [
      { metal: "Золото (Au)",  fraction: 0.375 },
      { metal: "Серебро (Ag)", fraction: 0.100 },
      { metal: "Медь (Cu)",    fraction: 0.525 },
    ],
  },
];

const SILVER_ALLOYS: Alloy[] = [
  {
    label: "999 Чистое серебро",
    components: [{ metal: "Серебро (Ag)", fraction: 1 }],
  },
  {
    label: "960 (Ag 960)",
    components: [
      { metal: "Серебро (Ag)", fraction: 0.960 },
      { metal: "Медь (Cu)",    fraction: 0.040 },
    ],
  },
  {
    label: "925 Стерлинг",
    components: [
      { metal: "Серебро (Ag)", fraction: 0.925 },
      { metal: "Медь (Cu)",    fraction: 0.075 },
    ],
  },
  {
    label: "875",
    components: [
      { metal: "Серебро (Ag)", fraction: 0.875 },
      { metal: "Медь (Cu)",    fraction: 0.125 },
    ],
  },
  {
    label: "830",
    components: [
      { metal: "Серебро (Ag)", fraction: 0.830 },
      { metal: "Медь (Cu)",    fraction: 0.170 },
    ],
  },
  {
    label: "800",
    components: [
      { metal: "Серебро (Ag)", fraction: 0.800 },
      { metal: "Медь (Cu)",    fraction: 0.200 },
    ],
  },
];

// ─── Tooltip component ────────────────────────────────────────────────────────
function AlloyTooltip({ alloy }: { alloy: Alloy }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => setVisible(v => !v)}
        style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${MD.divider}`, background: MD.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill={MD.textMed}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      </button>
      {visible && (
        <div style={{ position: "absolute", right: 0, top: 32, background: MD.surface, borderRadius: 10, boxShadow: MD.elevation2, padding: "12px 14px", zIndex: 30, minWidth: 200 }}>
          <p style={{ color: MD.textMed, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", margin: "0 0 8px" }}>Состав сплава</p>
          {alloy.components.map(c => (
            <div key={c.metal} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: MD.textHigh, fontSize: 13 }}>{c.metal}</span>
              <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{(c.fraction * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface CalcResult {
  rows: { metal: string; weight: number; fraction: number }[];
  total: number;
}

export default function LigaturePage() {
  const router = useRouter();
  const [metal, setMetal] = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [alloyIndex, setAlloyIndex] = useState(1);   // default: 750 Yellow
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const alloys = metal === "gold" ? GOLD_ALLOYS : SILVER_ALLOYS;
  const selectedAlloy = alloys[alloyIndex] ?? alloys[0];

  function handleMetalTab(m: MetalType) {
    setMetal(m);
    setProbeIndex(0);
    setAlloyIndex(0);
    setResult(null);
  }

  function handleCalculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const rows = selectedAlloy.components.map(c => ({
      metal:    c.metal,
      fraction: c.fraction,
      weight:   +(w * c.fraction).toFixed(2),
    }));
    setResult({ rows, total: +rows.reduce((s, r) => s + r.weight, 0).toFixed(2) });
  }

  function handleClear() { setWeight(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт компонентов лигатуры" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />

        <ProbeRow
          metal={metal}
          probeIndex={probeIndex}
          onProbeChange={(i) => { setProbeIndex(i); setResult(null); }}
        />

        {/* Weight input */}
        <Card>
          <Label>Вес металла гр.</Label>
          <input
            type="number" inputMode="decimal" value={weight}
            onChange={e => { setWeight(e.target.value); setResult(null); }}
            placeholder="0.0"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
          />
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, marginTop: 6, opacity: 0.7 }} />
        </Card>

        {/* Alloy selector */}
        <Card style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <Label>Цвет (Сплав)</Label>
            <AlloyTooltip alloy={selectedAlloy} />
          </div>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: 0, width: "100%" }}
          >
            <span style={{ color: MD.textHigh, fontSize: 16, fontWeight: 500, flex: 1, textAlign: "left" }}>
              {selectedAlloy.label}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d={dropdownOpen ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} fill={MD.textMed}/>
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: MD.surface, borderRadius: "0 0 12px 12px", boxShadow: MD.elevation2, zIndex: 20, maxHeight: 260, overflowY: "auto" }}>
              {alloys.map((alloy, i) => (
                <button key={i}
                  onClick={() => { setAlloyIndex(i); setDropdownOpen(false); setResult(null); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: "none", cursor: "pointer", background: i === alloyIndex ? MD.primaryLight : MD.surface, borderLeft: i === alloyIndex ? `3px solid ${MD.primary}` : "3px solid transparent", transition: "background 0.15s", textAlign: "left" }}
                >
                  {/* Colour swatch dot */}
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: alloyColor(alloy.label), border: `1px solid ${MD.divider}`, flexShrink: 0 }} />
                  <span style={{ color: MD.textHigh, fontSize: 15 }}>{alloy.label}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <Label>Результат</Label>
          {result ? (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <p style={{ color: MD.textMed, fontSize: 13, marginBottom: 10 }}>{selectedAlloy.label}</p>
              {result.rows.map((row, i) => (
                <div key={row.metal}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ color: MD.textHigh, fontSize: 14 }}>{row.metal}</span>
                      <span style={{ color: MD.textLow, fontSize: 12, marginLeft: 6 }}>({(row.fraction * 100).toFixed(1)}%)</span>
                    </div>
                    <span style={{ color: MD.textHigh, fontWeight: 600, fontSize: 15 }}>{row.weight} г</span>
                  </div>
                  {i < result.rows.length - 1 && <Divider />}
                </div>
              ))}
              <Divider />
              <TotalRow label="Итого" value={`${result.total} г`} />
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Alloy composition reference card */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Состав выбранного сплава</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {selectedAlloy.components.map(c => (
              <div key={c.metal}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: MD.textHigh, fontSize: 13 }}>{c.metal}</span>
                  <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{(c.fraction * 100).toFixed(1)}%</span>
                </div>
                {/* Mini progress bar */}
                <div style={{ height: 4, background: MD.divider, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.fraction * 100}%`, background: MD.primary, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </PageContent>
    </PageShell>
  );
}

/** Returns a representative CSS colour for the alloy swatch dot. */
function alloyColor(label: string): string {
  if (label.includes("Белый"))   return "#E8E8E8";
  if (label.includes("Красный")) return "#E8A090";
  if (label.includes("Розовый")) return "#F4C4A0";
  if (label.includes("Зелёный")) return "#A8C890";
  if (label.includes("Жёлтый"))  return "#FFD060";
  if (label.includes("Стерлинг") || label.includes("925") || label.includes("Серебро") || label.includes("Ag")) return "#C8C8C8";
  if (label.includes("Чистое")) return "#FFE566";
  return "#C8B480";
}
