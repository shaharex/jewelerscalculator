"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { getProbes, type MetalType } from "@/lib/metals";
import {
  PageShell, PageContent, AppBar,
  MetalTabs, ProbeRow,
  Card, Label, TotalRow,
  ActionButtons,
} from "@/components/ui";

export default function VolumeWeightPage() {
  const router = useRouter();
  const [metal, setMetal]           = useState<MetalType>("gold");
  const [probeIndex, setProbeIndex] = useState(0);
  const [volume, setVolume]         = useState("");
  const [weight, setWeight]         = useState<number | null>(null);

  const selectedProbe = (getProbes(metal))[probeIndex] ?? getProbes(metal)[0];

  function handleMetalTab(m: MetalType) { setMetal(m); setProbeIndex(0); setWeight(null); }

  function handleCalculate() {
    const v = parseFloat(volume);
    if (isNaN(v) || v <= 0) return;
    setWeight(+(v * selectedProbe.density).toFixed(3));
  }

  function handleClear() { setVolume(""); setWeight(null); }

  return (
    <PageShell>
      <AppBar title="Расчёт веса изделия по его объёму" onBack={() => router.back()} />

      <PageContent>
        <MetalTabs metal={metal} onChange={handleMetalTab} />

        <ProbeRow
          metal={metal}
          probeIndex={probeIndex}
          onProbeChange={i => { setProbeIndex(i); setWeight(null); }}
        />

        {/* Volume input */}
        <Card>
          <Label style={{ textTransform: "none", fontSize: 13, letterSpacing: 0 }}>Объём см3</Label>
          <input
            type="number" inputMode="decimal" value={volume}
            onChange={e => { setVolume(e.target.value); setWeight(null); }}
            placeholder="0.0"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary, marginTop: 8 }}
          />
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, marginTop: 6, opacity: 0.7 }} />
        </Card>

        <ActionButtons onClear={handleClear} onCalculate={handleCalculate} />

        {/* Result */}
        <Card>
          <p style={{ color: MD.textMed, fontStyle: "italic", fontSize: 13, margin: "0 0 8px" }}>Результат</p>
          {weight !== null ? (
            <TotalRow label="Масса металла" value={`${weight} г`} />
          ) : (
            <p style={{ color: MD.textLow, fontSize: 13, textAlign: "center", padding: "12px 0", margin: 0 }}>
              Введите данные и нажмите «Рассчитать»
            </p>
          )}
        </Card>
      </PageContent>
    </PageShell>
  );
}
