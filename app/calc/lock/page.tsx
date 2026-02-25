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

interface CalcResult {
  L: number;
  A: number;
  B: number;
  U: number;
  S: number;
  t: number;
  weight: number;
}

function calcLock(width: number, thickness: number, density: number): CalcResult {
  const A = width;
  const S = Math.max(0.3, width * 0.06);
  const L = A + S * 4;
  const B = thickness + S * 2;
  const U = +(L * 0.75).toFixed(2);
  const t = +(thickness * 0.25).toFixed(2);
  const outerVol  = L * B * width * 2;
  const innerVol  = (L - S * 2) * (B - S * 2) * (width - S * 2) * 2;
  const netVol    = Math.max(0, outerVol - innerVol);
  const tongueVol = L * t * width;
  const totalVol  = (netVol + tongueVol) * 0.60;
  const weight    = +((totalVol / 1000) * density).toFixed(2);
  return { L: +L.toFixed(2), A: +A.toFixed(2), B: +B.toFixed(2), U, S: +S.toFixed(2), t, weight };
}

export default function LockPage() {
  const router = useRouter();
  const [metal, setMetal] = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const selectedProbe = (getProbes(metal))[probeIndex] ?? getProbes(metal)[0];

  function handleMetalTab(m: MetalType) { setMetal(m); setProbeIndex(0); setResult(null); }
  function handleCalculate() {
    const w = parseFloat(width), t = parseFloat(thickness);
    if (isNaN(w) || w <= 0 || isNaN(t) || t <= 0) return;
    setResult(calcLock(w, t, selectedProbe.density));
  }
  function handleClear() { setWidth(""); setThickness(""); setResult(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт параметров замка‑коробки" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />
        <ProbeRow metal={metal} probeIndex={probeIndex} onProbeChange={(i) => { setProbeIndex(i); setResult(null); }} />

        {/* Inputs */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Ширина мм.", value: width, set: setWidth },
            { label: "Толщина мм.", value: thickness, set: setThickness },
          ].map(({ label, value, set }) => (
            <Card key={label} style={{ flex: 1 }}>
              <Label>{label}</Label>
              <input
                type="number" inputMode="decimal" value={value}
                onChange={e => { set(e.target.value); setResult(null); }}
                placeholder="0.0"
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 22, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
              />
              <div style={{ height: 2, background: MD.divider, borderRadius: 1, marginTop: 6 }} />
            </Card>
          ))}
        </div>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <Label>Результат</Label>
          {result ? (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow label="Длина замка (L)"            value={`${result.L} мм`} />
              <Divider />
              <ResRow label="Внутренняя ширина (A)"      value={`${result.A} мм`} />
              <Divider />
              <ResRow label="Высота (B)"                 value={`${result.B} мм`} />
              <Divider />
              <ResRow label="Длина коробочки (U = ¾L)"  value={`${result.U} мм`} />
              <Divider />
              <ResRow label="Толщина стенки (S)"         value={`${result.S} мм`} />
              <Divider />
              <ResRow label="Толщина язычка (t = ¼)"    value={`${result.t} мм`} />
              <Divider />
              <TotalRow label="Масса металла" value={`${result.weight} г`} />
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "16px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>

        {/* Diagram */}
        <Card>
          <Label style={{ marginBottom: 12 }}>Замок</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <DiagramPanel><TopLeftSvg /></DiagramPanel>
            <DiagramPanel><TopRightSvg /></DiagramPanel>
            <DiagramPanel><BottomLeftSvg /></DiagramPanel>
            <DiagramPanel><BottomRightSvg /></DiagramPanel>
          </div>
        </Card>
      </PageContent>
    </PageShell>
  );
}

function DiagramPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: MD.primaryLight, borderRadius: 8, border: `1px solid #FFE082`, padding: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 90 }}>
      {children}
    </div>
  );
}

function TopLeftSvg() {
  return (
    <svg viewBox="0 0 120 80" width="100%" style={{ display: "block" }}>
      <rect x="20" y="44" width="80" height="20" rx="2" fill="#e8e0d0" stroke="#888" strokeWidth="1"/>
      <rect x="28" y="44" width="64" height="10" rx="1" fill="#d0c8b8" stroke="#999" strokeWidth="0.5"/>
      <rect x="20" y="24" width="60" height="20" rx="2" fill="#f0e8d8" stroke="#888" strokeWidth="1"/>
      <rect x="80" y="30" width="18" height="8" rx="1" fill="#e0d8c8" stroke="#999" strokeWidth="0.8"/>
      <line x1="20" y1="72" x2="80" y2="72" stroke="#c00" strokeWidth="1"/>
      <line x1="20" y1="69" x2="20" y2="75" stroke="#c00" strokeWidth="1"/>
      <line x1="80" y1="69" x2="80" y2="75" stroke="#c00" strokeWidth="1"/>
      <text x="50" y="71" textAnchor="middle" fontSize="7" fill="#c00">3/4</text>
      <line x1="80" y1="72" x2="100" y2="72" stroke="#c00" strokeWidth="1"/>
      <line x1="100" y1="69" x2="100" y2="75" stroke="#c00" strokeWidth="1"/>
      <text x="90" y="71" textAnchor="middle" fontSize="7" fill="#c00">1/4</text>
    </svg>
  );
}

function TopRightSvg() {
  return (
    <svg viewBox="0 0 120 80" width="100%" style={{ display: "block" }}>
      <rect x="14" y="20" width="92" height="40" rx="3" fill="#f0e8d8" stroke="#888" strokeWidth="1.2"/>
      <rect x="24" y="28" width="72" height="24" rx="1" fill="#ddd8cc" stroke="#aaa" strokeWidth="0.8"/>
      <line x1="14" y1="14" x2="106" y2="14" stroke="#c00" strokeWidth="1"/>
      <line x1="14" y1="11" x2="14" y2="17" stroke="#c00" strokeWidth="1"/>
      <line x1="106" y1="11" x2="106" y2="17" stroke="#c00" strokeWidth="1"/>
      <text x="60" y="12" textAnchor="middle" fontSize="8" fill="#c00" fontWeight="bold">L</text>
      <line x1="24" y1="23" x2="96" y2="23" stroke="#c00" strokeWidth="1"/>
      <line x1="24" y1="20" x2="24" y2="26" stroke="#c00" strokeWidth="1"/>
      <line x1="96" y1="20" x2="96" y2="26" stroke="#c00" strokeWidth="1"/>
      <text x="60" y="21" textAnchor="middle" fontSize="8" fill="#c00" fontWeight="bold">A</text>
    </svg>
  );
}

function BottomLeftSvg() {
  return (
    <svg viewBox="0 0 120 80" width="100%" style={{ display: "block" }}>
      <rect x="20" y="18" width="70" height="36" rx="2" fill="#f0e8d8" stroke="#888" strokeWidth="1.2"/>
      <rect x="28" y="24" width="54" height="24" rx="1" fill="#ddd8cc" stroke="#aaa" strokeWidth="0.8"/>
      <rect x="90" y="28" width="10" height="12" rx="1" fill="#e0d8c8" stroke="#999" strokeWidth="0.8"/>
      <line x1="8" y1="18" x2="8" y2="54" stroke="#c00" strokeWidth="1"/>
      <line x1="5" y1="18" x2="11" y2="18" stroke="#c00" strokeWidth="1"/>
      <line x1="5" y1="54" x2="11" y2="54" stroke="#c00" strokeWidth="1"/>
      <text x="5" y="38" textAnchor="middle" fontSize="8" fill="#c00" fontWeight="bold">B</text>
      <line x1="100" y1="62" x2="20" y2="62" stroke="#c00" strokeWidth="1"/>
      <line x1="20" y1="59" x2="20" y2="65" stroke="#c00" strokeWidth="1"/>
      <line x1="100" y1="59" x2="100" y2="65" stroke="#c00" strokeWidth="1"/>
      <text x="60" y="72" textAnchor="middle" fontSize="8" fill="#c00" fontWeight="bold">t</text>
    </svg>
  );
}

function BottomRightSvg() {
  return (
    <svg viewBox="0 0 120 80" width="100%" style={{ display: "block" }}>
      <rect x="14" y="22" width="72" height="36" rx="2" fill="#f0e8d8" stroke="#888" strokeWidth="1.2"/>
      <rect x="22" y="30" width="56" height="20" rx="1" fill="#ddd8cc" stroke="#aaa" strokeWidth="0.8"/>
      <rect x="86" y="33" width="18" height="8" rx="1" fill="#e0d8c8" stroke="#999" strokeWidth="0.8"/>
      <line x1="14" y1="66" x2="86" y2="66" stroke="#c00" strokeWidth="1"/>
      <line x1="14" y1="63" x2="14" y2="69" stroke="#c00" strokeWidth="1"/>
      <line x1="86" y1="63" x2="86" y2="69" stroke="#c00" strokeWidth="1"/>
      <text x="50" y="76" textAnchor="middle" fontSize="8" fill="#c00" fontWeight="bold">U</text>
      <line x1="110" y1="22" x2="110" y2="30" stroke="#c00" strokeWidth="1"/>
      <line x1="107" y1="22" x2="113" y2="22" stroke="#c00" strokeWidth="1"/>
      <line x1="107" y1="30" x2="113" y2="30" stroke="#c00" strokeWidth="1"/>
      <text x="116" y="27" fontSize="8" fill="#c00" fontWeight="bold">S</text>
    </svg>
  );
}
