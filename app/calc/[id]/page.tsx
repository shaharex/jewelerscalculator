"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MD } from "@/lib/theme";
import { PageShell, AppBar, PageContent, Card, Label, Divider } from "@/components/ui";

const calculatorLabels: Record<string, string> = {
  "wax-casting":  "Расчёт восковки",
  lock:           "Расчёт замка (коробка)",
  wire:           "Расчёт ригеля и проволоки",
  ring:           "Расчёт обручальных колец",
  ligature:       "Расчёт лигатуры",
  solder:         "Расчёт припоя",
  tube:           "Расчёт трубки",
  density:        "Расчёт плотности или массы",
  tip:            "Расчёт концевика",
  mix:            "Смешивание проб",
  alloy:          "Изменение состава сплава",
  formmass:       "Расчёт формомассы",
  hemisphere:     "Расчёт полусферы",
  "weight-params":"Расчёт веса по параметрам",
  congo:          "Расчёт серьги Конго",
  "volume-weight":"Расчёт веса по объёму",
  "measure-ring": "Измерение кольца",
};

export default function CalcPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");

  const numA   = parseFloat(a) || 0;
  const numB   = parseFloat(b) || 0;
  const result = numA + numB;
  const label  = calculatorLabels[id] ?? id;

  return (
    <PageShell>
      <AppBar title={label} onBack={() => router.back()} />

      <PageContent>
        <Card>
          <Label>Сложение</Label>

          <p style={{ color: MD.textMed, fontSize: 12, fontWeight: 500, marginTop: 16, marginBottom: 4 }}>Первое значение</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="0.0"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary }}
            />
            <span style={{ color: MD.textMed, fontWeight: 500, fontSize: 15 }}>гр.</span>
          </div>
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, opacity: 0.7, marginBottom: 16 }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ color: MD.textLow, fontSize: 28, fontWeight: 300, lineHeight: 1 }}>+</span>
          </div>

          <p style={{ color: MD.textMed, fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Второе значение</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="0.0"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: MD.textHigh, fontSize: 28, fontWeight: 700, caretColor: MD.primary }}
            />
            <span style={{ color: MD.textMed, fontWeight: 500, fontSize: 15 }}>гр.</span>
          </div>
          <div style={{ height: 2, background: MD.primary, borderRadius: 1, opacity: 0.7 }} />
        </Card>

        <Card>
          <Label>Результат</Label>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: MD.textHigh, fontWeight: 700, fontSize: 15 }}>Итого</span>
            <span style={{ color: MD.primary, fontWeight: 800, fontSize: 26 }}>
              {a === "" && b === "" ? "—" : `${result} гр.`}
            </span>
          </div>
        </Card>
      </PageContent>
    </PageShell>
  );
}
