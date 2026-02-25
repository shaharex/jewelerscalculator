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

type SectionType = "semi" | "rect" | "tri" | "circle";

const SECTIONS: { value: SectionType; label: string }[] = [
  { value: "semi",   label: "Полукруглое"   },
  { value: "rect",   label: "Прямоугольное" },
  { value: "tri",    label: "Треугольное"   },
  { value: "circle", label: "Круглое"       },
];

function sectionArea(type: SectionType, width: number, thickness: number): number {
  switch (type) {
    case "rect":   return width * thickness;
    case "semi":   return (Math.PI * width * thickness) / 4;
    case "tri":    return (width * thickness) / 2;
    case "circle": return Math.PI * Math.pow(Math.min(width, thickness) / 2, 2);
  }
}

function SectionIcon({ type, size = 20 }: { type: string; size?: number }) {
  switch (type) {
    case "semi":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 16 A8 8 0 0 1 20 16" stroke={MD.textHigh} strokeWidth="1.8" fill={MD.textLow} fillOpacity="0.15"/>
          <line x1="4" y1="16" x2="20" y2="16" stroke={MD.textHigh} strokeWidth="1.8"/>
        </svg>
      );
    case "rect":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="8" rx="1" stroke={MD.textHigh} strokeWidth="1.8" fill={MD.textLow} fillOpacity="0.15"/>
        </svg>
      );
    case "tri":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 5L22 19H2L12 5Z" stroke={MD.textHigh} strokeWidth="1.8" fill={MD.textLow} fillOpacity="0.15" strokeLinejoin="round"/>
        </svg>
      );
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke={MD.textHigh} strokeWidth="1.8" fill={MD.textLow} fillOpacity="0.15"/>
        </svg>
      );
    default: return null;
  }
}

function SectionSvg({ type, active }: { type: SectionType; active: boolean }) {
  const color = active ? MD.primary : MD.textLow;
  const fill  = active ? "rgba(255,160,0,0.15)" : "rgba(158,158,158,0.1)";
  switch (type) {
    case "semi":
      return (
        <svg width="60" height="40" viewBox="0 0 60 40">
          <path d="M5 32 A25 25 0 0 1 55 32" stroke={color} strokeWidth="2" fill={fill}/>
          <line x1="5" y1="32" x2="55" y2="32" stroke={color} strokeWidth="2"/>
          <line x1="30" y1="32" x2="30" y2="7" stroke={color} strokeWidth="1.2" strokeDasharray="3 2"/>
          <line x1="5" y1="38" x2="55" y2="38" stroke="#c00" strokeWidth="1"/>
          <text x="30" y="37" textAnchor="middle" fontSize="7" fill="#c00">ширина</text>
          <line x1="56" y1="7" x2="56" y2="32" stroke="#c00" strokeWidth="1"/>
          <text x="56" y="22" textAnchor="start" fontSize="7" fill="#c00" dx="2">т</text>
        </svg>
      );
    case "rect":
      return (
        <svg width="60" height="40" viewBox="0 0 60 40">
          <rect x="5" y="10" width="50" height="20" rx="1" stroke={color} strokeWidth="2" fill={fill}/>
          <line x1="5" y1="36" x2="55" y2="36" stroke="#c00" strokeWidth="1"/>
          <text x="30" y="35" textAnchor="middle" fontSize="7" fill="#c00">ширина</text>
          <line x1="58" y1="10" x2="58" y2="30" stroke="#c00" strokeWidth="1"/>
          <text x="58" y="22" textAnchor="start" fontSize="7" fill="#c00" dx="2">т</text>
        </svg>
      );
    case "tri":
      return (
        <svg width="60" height="40" viewBox="0 0 60 40">
          <path d="M30 5L55 35H5L30 5Z" stroke={color} strokeWidth="2" fill={fill} strokeLinejoin="round"/>
          <line x1="5" y1="38" x2="55" y2="38" stroke="#c00" strokeWidth="1"/>
          <text x="30" y="37" textAnchor="middle" fontSize="7" fill="#c00">ширина</text>
          <line x1="30" y1="5" x2="30" y2="35" stroke="#c00" strokeWidth="1" strokeDasharray="2 2"/>
          <text x="33" y="18" fontSize="7" fill="#c00">т</text>
        </svg>
      );
    case "circle":
      return (
        <svg width="60" height="40" viewBox="0 0 60 40">
          <circle cx="30" cy="20" r="16" stroke={color} strokeWidth="2" fill={fill}/>
          <line x1="30" y1="20" x2="46" y2="20" stroke="#c00" strokeWidth="1"/>
          <text x="38" y="18" fontSize="7" fill="#c00">r</text>
          <line x1="14" y1="37" x2="46" y2="37" stroke="#c00" strokeWidth="1"/>
          <text x="30" y="36" textAnchor="middle" fontSize="7" fill="#c00">диаметр</text>
        </svg>
      );
  }
}

interface CalcResult {
  circumference: number;
  area: number;
  volume: number;
  weight: number;
  cost: number | null;
}

function calculate(section: SectionType, innerDiam: number, width: number, thickness: number, density: number, pricePerGram: number | null): CalcResult {
  const midCircumference = Math.PI * (innerDiam + thickness);
  const area   = sectionArea(section, width, thickness);
  const volume = midCircumference * area;
  const weight = +((volume / 1000) * density).toFixed(2);
  const cost   = pricePerGram !== null ? +(weight * pricePerGram).toFixed(2) : null;
  return { circumference: +midCircumference.toFixed(3), area: +area.toFixed(3), volume: +volume.toFixed(2), weight, cost };
}

export default function RingPage() {
  const router = useRouter();
  const [metal, setMetal] = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [section, setSection] = useState<SectionType>("semi");
  const [innerDiam, setInnerDiam]   = useState("");
  const [width, setWidth]           = useState("");
  const [thickness, setThickness]   = useState("");
  const [price, setPrice]           = useState("");
  const [result, setResult]         = useState<CalcResult | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedProbe = getProbes(metal)[probeIndex] ?? getProbes(metal)[0];
  const selectedSection = SECTIONS.find(s => s.value === section)!;

  function handleMetalTab(m: MetalType) { setMetal(m); setProbeIndex(0); setResult(null); }

  function handleCalculate() {
    const id = parseFloat(innerDiam), w = parseFloat(width), t = parseFloat(thickness);
    if (isNaN(id) || id <= 0 || isNaN(w) || w <= 0 || isNaN(t) || t <= 0) return;
    const p = parseFloat(price);
    setResult(calculate(section, id, w, t, selectedProbe.density, isNaN(p) ? null : p));
  }

  function handleClear() { setInnerDiam(""); setWidth(""); setThickness(""); setPrice(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт шинки для обручального кольца" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />
        <ProbeRow metal={metal} probeIndex={probeIndex} onProbeChange={(i) => { setProbeIndex(i); setResult(null); }} />

        {/* Cross-section dropdown */}
        <Card style={{ position: "relative" }}>
          <Label>Сечение:</Label>
          <button onClick={() => setDropdownOpen(v => !v)} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", padding: 0, width: "100%" }}>
            <SectionIcon type={selectedSection.value} size={22} />
            <span style={{ color: MD.textHigh, fontSize: 16, fontWeight: 500, flex: 1, textAlign: "left" }}>{selectedSection.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d={dropdownOpen ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} fill={MD.textMed}/>
            </svg>
          </button>
          {dropdownOpen && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: MD.surface, borderRadius: "0 0 12px 12px", boxShadow: MD.elevation2, zIndex: 20, overflow: "hidden" }}>
              {SECTIONS.map(sec => (
                <button key={sec.value} onClick={() => { setSection(sec.value); setDropdownOpen(false); setResult(null); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "none", cursor: "pointer", background: sec.value === section ? MD.primaryLight : MD.surface, borderLeft: sec.value === section ? `3px solid ${MD.primary}` : "3px solid transparent", transition: "background 0.15s" }}>
                  <SectionIcon type={sec.value} size={24} />
                  <span style={{ color: MD.textHigh, fontSize: 15, fontStyle: "italic" }}>{sec.label}</span>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Three measure inputs */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Внутренний диаметр мм.", value: innerDiam, set: setInnerDiam },
            { label: "Ширина мм.",             value: width,     set: setWidth     },
            { label: "Толщина мм.",            value: thickness,  set: setThickness },
          ].map(({ label, value, set }) => (
            <Card key={label} style={{ flex: 1, minWidth: 0 }}>
              <Label style={{ fontSize: 11 }}>{label}</Label>
              <input type="number" inputMode="decimal" value={value} onChange={e => { set(e.target.value); setResult(null); }} placeholder="0.0"
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 22, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
              />
              <div style={{ height: 2, background: MD.divider, borderRadius: 1, marginTop: 6 }} />
            </Card>
          ))}
        </div>

        {/* Price input */}
        <Card>
          <Label>Цена за 1гр. металла руб.</Label>
          <input type="number" inputMode="decimal" value={price} onChange={e => { setPrice(e.target.value); setResult(null); }} placeholder="0.0"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 26, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
          />
          <div style={{ height: 2, background: MD.divider, borderRadius: 1, marginTop: 6 }} />
        </Card>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <Label>Результат</Label>
          {result ? (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow label="Длина шинки (длина окружности)"                    value={`${result.circumference} мм`} />
              <Divider />
              <ResRow label={`Площадь сечения (${selectedSection.label.toLowerCase()})`} value={`${result.area} мм²`} />
              <Divider />
              <ResRow label="Объём металла"  value={`${result.volume} мм³`} />
              <Divider />
              <TotalRow label="Масса металла" value={`${result.weight} г`} />
              {result.cost !== null && (
                <>
                  <Divider />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: MD.textHigh, fontWeight: 700, fontSize: 15 }}>Стоимость</span>
                    <span style={{ color: MD.primary, fontWeight: 800, fontSize: 22 }}>{result.cost} руб.</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Diagram */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Сечения шинки</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SECTIONS.map(sec => (
              <div key={sec.value} onClick={() => { setSection(sec.value); setResult(null); }} style={{ background: section === sec.value ? MD.primaryLight : MD.bg, border: `1.5px solid ${section === sec.value ? MD.primary : MD.divider}`, borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 0.18s" }}>
                <SectionSvg type={sec.value} active={section === sec.value} />
                <span style={{ fontSize: 11, color: section === sec.value ? MD.primary : MD.textMed, fontWeight: 500, textAlign: "center" }}>{sec.label}</span>
              </div>
            ))}
          </div>
        </Card>

      </PageContent>
    </PageShell>
  );
}
