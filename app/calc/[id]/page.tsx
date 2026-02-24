"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const calculatorLabels: Record<string, string> = {
  "wax-casting": "Расчёт восковки",
  lock: "Расчёт замка (коробка)",
  wire: "Расчёт ригеля и проволоки",
  ring: "Расчёт обручальных колец",
  ligature: "Расчёт лигатуры",
  solder: "Расчёт припоя",
  tube: "Расчёт трубки",
  density: "Расчёт плотности или массы",
  tip: "Расчёт концевика",
  mix: "Смешивание проб",
  alloy: "Изменение состава сплава",
  formmass: "Расчёт формомассы",
  hemisphere: "Расчёт полусферы",
  "weight-params": "Расчёт веса по параметрам",
  congo: "Расчёт серьги Конго",
  "volume-weight": "Расчёт веса по объёму",
  "measure-ring": "Измерение кольца",
};

export default function CalcPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");

  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  const result = numA + numB;

  const label = calculatorLabels[id] ?? id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8860b] via-[#8B6914] to-[#5a4008] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#6b4f00] to-[#3d2b00] shadow-lg px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] flex items-center justify-center shadow-md active:scale-95 transition-transform"
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#3d2b00"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-[#ffd700] font-bold text-lg leading-tight tracking-wide">
            {label}
          </h1>
          <p className="text-[#d4a843] text-xs">Ювелирный Калькулятор</p>
        </div>
      </header>

      {/* Calculator */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-6"
          style={{
            background: "linear-gradient(145deg, #ffe580, #f0c040, #c89820)",
            boxShadow:
              "6px 6px 16px rgba(0,0,0,0.4), -3px -3px 10px rgba(255,240,160,0.5)",
          }}
        >
          <h2
            className="text-center font-bold text-[#3d2b00] text-lg"
            style={{ letterSpacing: "0.02em" }}
          >
            Сложение
          </h2>

          {/* Input A */}
          <div className="flex flex-col gap-1">
            <label className="text-[#5a3a00] text-sm font-semibold">
              Первое значение
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl px-4 py-3 text-[#3d2b00] text-lg font-bold outline-none border-2 border-[#b8860b] focus:border-[#3d2b00] transition-colors"
              style={{
                background: "rgba(255,255,220,0.7)",
              }}
            />
          </div>

          {/* Plus sign */}
          <div className="flex items-center justify-center">
            <span className="text-[#3d2b00] text-3xl font-bold select-none">+</span>
          </div>

          {/* Input B */}
          <div className="flex flex-col gap-1">
            <label className="text-[#5a3a00] text-sm font-semibold">
              Второе значение
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl px-4 py-3 text-[#3d2b00] text-lg font-bold outline-none border-2 border-[#b8860b] focus:border-[#3d2b00] transition-colors"
              style={{
                background: "rgba(255,255,220,0.7)",
              }}
            />
          </div>

          {/* Result */}
          <div
            className="rounded-2xl px-4 py-4 flex flex-col items-center gap-1"
            style={{
              background: "linear-gradient(135deg, #3d2b00, #6b4f00)",
              boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            <span className="text-[#d4a843] text-sm font-semibold tracking-wide">
              Результат
            </span>
            <span className="text-[#ffd700] text-4xl font-bold">
              {a === "" && b === "" ? "—" : result}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
