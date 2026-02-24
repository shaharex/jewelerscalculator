"use client";

import { useRouter } from "next/navigation";

const calculators = [
  {
    id: "wax-casting",
    label: "Расчёт восковки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="10" y="4" width="20" height="32" rx="3" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <rect x="16" y="2" width="8" height="4" rx="1.5" stroke="#3d2b00" strokeWidth="2" fill="none"/>
        <line x1="14" y1="14" x2="26" y2="14" stroke="#3d2b00" strokeWidth="2"/>
        <line x1="14" y1="20" x2="26" y2="20" stroke="#3d2b00" strokeWidth="2"/>
        <line x1="14" y1="26" x2="22" y2="26" stroke="#3d2b00" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "lock",
    label: "Расчёт замка (коробка)",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="8" y="18" width="24" height="18" rx="3" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <path d="M14 18v-5a6 6 0 0112 0v5" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="27" r="2.5" stroke="#3d2b00" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "wire",
    label: "Расчёт ригеля и проволоки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <ellipse cx="20" cy="20" rx="16" ry="8" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <ellipse cx="20" cy="20" rx="10" ry="4" stroke="#3d2b00" strokeWidth="1.5" fill="none"/>
        <line x1="4" y1="20" x2="36" y2="20" stroke="#3d2b00" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "ring",
    label: "Расчёт обручальных колец",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="20" cy="20" r="13" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <circle cx="20" cy="20" r="8" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "ligature",
    label: "Расчёт лигатуры",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
        <rect x="21" y="5" width="14" height="14" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
        <rect x="5" y="21" width="14" height="14" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
        <rect x="21" y="21" width="14" height="14" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "solder",
    label: "Расчёт припоя",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M10 30 Q15 10 20 20 Q25 30 30 10" stroke="#3d2b00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="10" r="3" stroke="#3d2b00" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "tube",
    label: "Расчёт трубки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="4" y="14" width="32" height="12" rx="2" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <ellipse cx="4" cy="20" rx="3" ry="6" stroke="#3d2b00" strokeWidth="1.5" fill="none"/>
        <ellipse cx="36" cy="20" rx="3" ry="6" stroke="#3d2b00" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    id: "density",
    label: "Расчёт плотности или массы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <line x1="20" y1="8" x2="20" y2="32" stroke="#3d2b00" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="8" y1="20" x2="32" y2="20" stroke="#3d2b00" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M14 14l12 12M26 14L14 26" stroke="#3d2b00" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "tip",
    label: "Расчёт концевика",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="6" y="16" width="28" height="8" rx="2" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <rect x="6" y="12" width="6" height="16" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
        <rect x="28" y="12" width="6" height="16" rx="2" stroke="#3d2b00" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "mix",
    label: "Смешивание проб",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M8 16l8-8 8 8M8 24l8 8 8-8" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="24" y1="20" x2="36" y2="20" stroke="#3d2b00" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="30" y1="14" x2="36" y2="20" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
        <line x1="30" y1="26" x2="36" y2="20" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "alloy",
    label: "Изменение состава сплава",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M14 6h12v6l4 6-4 6v6H14v-6l-4-6 4-6V6z" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <circle cx="20" cy="22" r="3" stroke="#3d2b00" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "formmass",
    label: "Расчёт формомассы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M20 6 C10 6 6 14 6 20 C6 26 10 34 20 34" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M20 6 C30 6 34 14 34 20 C34 26 30 34 20 34" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M12 26 Q16 30 20 28 Q24 26 28 30" stroke="#3d2b00" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "hemisphere",
    label: "Расчёт полусферы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M6 22 A14 14 0 0 1 34 22" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <line x1="6" y1="22" x2="34" y2="22" stroke="#3d2b00" strokeWidth="2.2" strokeLinecap="round"/>
        <ellipse cx="20" cy="22" rx="14" ry="4" stroke="#3d2b00" strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="8" r="2" fill="#3d2b00"/>
        <line x1="20" y1="8" x2="20" y2="22" stroke="#3d2b00" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: "weight-params",
    label: "Расчёт веса по параметрам",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M20 4 L24 12 H32 L26 18 L28 26 L20 22 L12 26 L14 18 L8 12 H16 Z" stroke="#3d2b00" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <circle cx="20" cy="16" r="2" fill="#3d2b00"/>
      </svg>
    ),
  },
  {
    id: "congo",
    label: "Расчёт серьги Конго",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="20" cy="22" r="12" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <path d="M16 10 Q20 4 24 10" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="22" r="5" stroke="#3d2b00" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
  },
  {
    id: "volume-weight",
    label: "Расчёт веса по объёму",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="8" y="10" width="24" height="22" rx="3" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <path d="M14 10V8a2 2 0 014 0v2M22 10V8a2 2 0 014 0v2" stroke="#3d2b00" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* V shape drawn as a path instead of <text> */}
        <path d="M15 19l5 8 5-8" stroke="#3d2b00" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "measure-ring",
    label: "Измерение кольца",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="20" cy="20" r="13" stroke="#3d2b00" strokeWidth="2.2" fill="none"/>
        <line x1="20" y1="7" x2="20" y2="12" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
        <line x1="20" y1="28" x2="20" y2="33" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="20" x2="12" y2="20" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="20" x2="33" y2="20" stroke="#3d2b00" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 13a7 7 0 100 14 7 7 0 000-14z" stroke="#3d2b00" strokeWidth="1.4" fill="none" strokeDasharray="2 2"/>
        <line x1="20" y1="20" x2="26" y2="14" stroke="#3d2b00" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8860b] via-[#8B6914] to-[#5a4008] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#6b4f00] to-[#3d2b00] shadow-lg px-4 py-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffd700] to-[#b8860b] flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="#3d2b00"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[#ffd700] font-bold text-lg leading-tight tracking-wide">
              Ювелирный Калькулятор
            </h1>
            <p className="text-[#d4a843] text-xs">Профессиональные расчёты</p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-1 overflow-y-auto py-4 px-3 flex justify-center">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {calculators.map((calc) => (
            <button
              key={calc.id}
              type="button"
              onClick={() => router.push(`/calc/${calc.id}`)}
              className="calc-tile group flex flex-col items-center justify-center gap-2 rounded-2xl text-center cursor-pointer select-none"
              style={{
                background: "linear-gradient(145deg, #ffe580, #f0c040, #c89820)",
                boxShadow:
                  "4px 4px 10px rgba(0,0,0,0.35), -2px -2px 6px rgba(255,240,160,0.5), inset 1px 1px 2px rgba(255,255,220,0.6)",
                width: "calc(33.333% - 7px)",
                minWidth: "100px",
                aspectRatio: "1 / 1",
                padding: "10px 6px",
              }}
            >
              <div className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95 flex items-center justify-center">
                {calc.icon}
              </div>
              <span
                className="text-[#3d2b00] font-semibold leading-tight w-full text-center"
                style={{ fontSize: "11px" }}
              >
                {calc.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}


