"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { type MetalType } from "@/lib/metals";
import {
  PageShell, PageContent, AppBar,
  MetalTabs,
  Card, Label, Divider,
  ActionButtons,
} from "@/components/ui";

// ─── Types ───────────────────────────────────────────────────────────────────
interface SolderComponent { metal: string; fraction: number; }
interface Solder { label: string; temp: number; components: SolderComponent[]; }

const METAL_FULL: Record<string, string> = {
  Au: "Золото (Au)",
  Ag: "Серебро (Ag)",
  Cu: "Медь (Cu)",
  Cd: "Кадмий (Cd)",
  Ni: "Никель (Ni)",
  Zn: "Цинк (Zn)",
  Pd: "Палладий (Pd)",
};

// All fractions in each solder must sum to 1.0
const GOLD_SOLDERS: Solder[] = [
  { label: "750 Белый",         temp: 800, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.160 }, { metal: "Cu", fraction: 0.090 }] },
  { label: "750 Белый",         temp: 840, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.080 }, { metal: "Cu", fraction: 0.170 }] },
  { label: "750 Белый",         temp: 780, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.200 }, { metal: "Cu", fraction: 0.050 }] },
  { label: "750 Жёлтый",        temp: 880, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.050 }, { metal: "Cu", fraction: 0.200 }] },
  { label: "750 Жёлтый",        temp: 810, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.125 }, { metal: "Cu", fraction: 0.125 }] },
  { label: "750 Зеленоватый",   temp: 740, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.132 }, { metal: "Cu", fraction: 0.060 }, { metal: "Cd", fraction: 0.058 }] },
  { label: "750 Темно-жёлтый",  temp: 822, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.070 }, { metal: "Cu", fraction: 0.130 }, { metal: "Cd", fraction: 0.050 }] },
  { label: "750 Жёлтый",        temp: 804, components: [{ metal: "Au", fraction: 0.750 }, { metal: "Ag", fraction: 0.022 }, { metal: "Cu", fraction: 0.128 }, { metal: "Cd", fraction: 0.082 }, { metal: "Ni", fraction: 0.000 }, { metal: "Zn", fraction: 0.018 }] },
  { label: "585 Светло-жёлтый", temp: 776, components: [{ metal: "Au", fraction: 0.585 }, { metal: "Ag", fraction: 0.165 }, { metal: "Cu", fraction: 0.095 }, { metal: "Cd", fraction: 0.100 }, { metal: "Zn", fraction: 0.055 }] },
  { label: "585 Бледно-жёлтый", temp: 780, components: [{ metal: "Au", fraction: 0.585 }, { metal: "Ag", fraction: 0.145 }, { metal: "Cu", fraction: 0.100 }, { metal: "Cd", fraction: 0.120 }, { metal: "Zn", fraction: 0.050 }] },
  { label: "585 Жёлтый",        temp: 800, components: [{ metal: "Au", fraction: 0.585 }, { metal: "Ag", fraction: 0.120 }, { metal: "Cu", fraction: 0.180 }, { metal: "Cd", fraction: 0.060 }, { metal: "Zn", fraction: 0.055 }] },
  { label: "585 Красный",        temp: 820, components: [{ metal: "Au", fraction: 0.585 }, { metal: "Ag", fraction: 0.070 }, { metal: "Cu", fraction: 0.290 }, { metal: "Cd", fraction: 0.035 }, { metal: "Zn", fraction: 0.020 }] },
  { label: "375 Жёлтый",        temp: 720, components: [{ metal: "Au", fraction: 0.375 }, { metal: "Ag", fraction: 0.100 }, { metal: "Cu", fraction: 0.400 }, { metal: "Cd", fraction: 0.075 }, { metal: "Zn", fraction: 0.050 }] },
];

const SILVER_SOLDERS: Solder[] = [
  { label: "925 Стерлинг", temp: 780, components: [{ metal: "Ag", fraction: 0.925 }, { metal: "Cu", fraction: 0.075 }] },
  { label: "900",           temp: 740, components: [{ metal: "Ag", fraction: 0.900 }, { metal: "Cu", fraction: 0.100 }] },
  { label: "875",           temp: 800, components: [{ metal: "Ag", fraction: 0.875 }, { metal: "Cu", fraction: 0.075 }, { metal: "Zn", fraction: 0.050 }] },
  { label: "800",           temp: 760, components: [{ metal: "Ag", fraction: 0.800 }, { metal: "Cu", fraction: 0.150 }, { metal: "Zn", fraction: 0.050 }] },
  { label: "720",           temp: 720, components: [{ metal: "Ag", fraction: 0.720 }, { metal: "Cu", fraction: 0.200 }, { metal: "Zn", fraction: 0.080 }] },
  { label: "650",           temp: 695, components: [{ metal: "Ag", fraction: 0.650 }, { metal: "Cu", fraction: 0.280 }, { metal: "Cd", fraction: 0.040 }, { metal: "Zn", fraction: 0.030 }] },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
interface ResultRow { metal: string; weight: number; fraction: number; }

export default function SolderPage() {
  const router = useRouter();
  const [metal, setMetal]           = useState<MetalType>("gold");
  const [solderIndex, setSolderIndex] = useState(0);
  const [weight, setWeight]         = useState("");
  const [result, setResult]         = useState<{ rows: ResultRow[]; total: number } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const solders  = metal === "gold" ? GOLD_SOLDERS : SILVER_SOLDERS;
  const selected = solders[solderIndex] ?? solders[0];

  function handleMetalTab(m: MetalType) { setMetal(m); setSolderIndex(0); setResult(null); }

  function handleCalculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const rows: ResultRow[] = selected.components.map(c => ({
      metal:    c.metal,
      fraction: c.fraction,
      weight:   +(w * c.fraction).toFixed(3),
    }));
    setResult({ rows, total: +rows.reduce((s, r) => s + r.weight, 0).toFixed(2) });
  }

  function handleClear() { setWeight(""); setResult(null); }

  const pureMetalLabel = metal === "gold" ? "Золото 999 (24k)" : "Серебро 999";

  return (
    <PageShell>
      <AppBar title="Расчёт компонентов припоя" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />

        {/* Weight input */}
        <Card>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <Label>Вес припоя гр.</Label>
            <span style={{ color: MD.textLow, fontSize: 12, fontStyle: "italic" }}>(Требуется)</span>
          </div>
          <input
            type="number" inputMode="decimal" value={weight}
            onChange={e => { setWeight(e.target.value); setResult(null); }}
            placeholder="0.0"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
          />
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, marginTop: 6, opacity: 0.7 }} />
        </Card>

        {/* Solder dropdown */}
        <Card style={{ position: "relative" }}>
          <Label style={{ marginBottom: 8 }}>Припой</Label>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: 0, width: "100%" }}
          >
            <div style={{ flex: 1, textAlign: "left" }}>
              <span style={{ color: MD.textHigh, fontSize: 16, fontWeight: 500 }}>{selected.label}</span>
              <span style={{ color: MD.textLow, fontSize: 13, marginLeft: 8 }}>(t {selected.temp}°C)</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d={dropdownOpen ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} fill={MD.textMed}/>
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: MD.surface, borderRadius: "0 0 12px 12px", boxShadow: MD.elevation2, zIndex: 20, maxHeight: 280, overflowY: "auto" }}>
              {solders.map((s, i) => (
                <button key={i}
                  onClick={() => { setSolderIndex(i); setDropdownOpen(false); setResult(null); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", border: "none", cursor: "pointer", background: i === solderIndex ? MD.primaryLight : MD.surface, borderLeft: i === solderIndex ? `3px solid ${MD.primary}` : "3px solid transparent", transition: "background 0.15s" }}
                >
                  <span style={{ color: MD.textHigh, fontSize: 15 }}>{s.label}</span>
                  <span style={{ color: MD.textLow, fontSize: 13 }}>t {s.temp}°C</span>
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
            <div style={{ marginTop: 12 }}>
              {/* "Компоненты:" header */}
              <p style={{ color: MD.textHigh, fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Компоненты:</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {result.rows.map((row, i) => (
                  <div key={row.metal}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: MD.textHigh, fontSize: 14, fontWeight: 500 }}>
                        {METAL_FULL[row.metal] ?? row.metal}:
                      </span>
                      <span style={{ color: row.fraction === 0 ? MD.textLow : MD.textHigh, fontWeight: 600, fontSize: 14 }}>
                        {row.weight} гр. ({(row.fraction * 100).toFixed(1)} %)
                      </span>
                    </div>
                    {i < result.rows.length - 1 && <Divider />}
                  </div>
                ))}
              </div>

              <Divider />

              {/* Total */}
              <div style={{ textAlign: "center", margin: "8px 0" }}>
                <span style={{ color: MD.textHigh, fontWeight: 700, fontSize: 15 }}>
                  Итого вес: {result.total} гр. (100.0 %)
                </span>
              </div>

              {/* Warning note */}
              <div style={{ marginTop: 10, padding: "10px 12px", background: "#FFF8E1", borderRadius: 8, border: `1px solid #FFE082` }}>
                <p style={{ color: "#E65100", fontWeight: 700, fontSize: 13, margin: 0, textAlign: "center", lineHeight: 1.5 }}>
                  Внимание!! В расчете используется {pureMetalLabel}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Composition reference */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Состав выбранного припоя</Label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: MD.textMed, fontSize: 13 }}>{selected.label}</span>
            <span style={{ background: MD.primaryLight, color: MD.primary, fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>
              t {selected.temp}°C
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.components.filter(c => c.fraction > 0).map(c => (
              <div key={c.metal}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: MD.textHigh, fontSize: 13 }}>{METAL_FULL[c.metal] ?? c.metal}</span>
                  <span style={{ color: MD.primary, fontWeight: 700, fontSize: 13 }}>{(c.fraction * 100).toFixed(1)}%</span>
                </div>
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
