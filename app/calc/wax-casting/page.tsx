"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { getProbes, type MetalType } from "@/lib/metals";
import {
  PageShell, PageContent, AppBar,
  MetalTabs, ProbeRow,
  Card, Label, Divider, ResRow, TotalRow,
  NumberInput, StepBtn, ActionButtons,
} from "@/components/ui";

export default function WaxCastingPage() {
  const router = useRouter();
  const [metal, setMetal] = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [waxWeight, setWaxWeight] = useState("");
  const [coefficient, setCoefficient] = useState(1);
  const [result, setResult] = useState<null | { metal: number; sprue: number; total: number }>(null);

  const probes = getProbes(metal);
  const selectedProbe = probes[probeIndex] ?? probes[0];

  function handleMetalTab(m: MetalType) {
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
    <PageShell>
      <AppBar title="Расчёт восковки" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />

        <ProbeRow
          metal={metal}
          probeIndex={probeIndex}
          onProbeChange={(i) => { setProbeIndex(i); setResult(null); }}
        />

        {/* Wax weight */}
        <NumberInput
          label="Вес восковки"
          value={waxWeight}
          onChange={(v) => { setWaxWeight(v); setResult(null); }}
          unit="гр."
        />

        {/* Coefficient stepper */}
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

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <Label>Результат</Label>
          {result ? (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
              <ResRow label="Масса металла"  value={`${result.metal} г`} />
              <Divider />
              <ResRow label="Литник (≈ 10%)" value={`${result.sprue} г`} />
              <Divider />
              <TotalRow label="Итого" value={`${result.total} г`} />
            </div>
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, marginTop: 10, textAlign: "center", padding: "12px 0" }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>
      </PageContent>
    </PageShell>
  );
}
