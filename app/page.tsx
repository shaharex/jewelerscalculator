"use client";

import { useRouter } from "next/navigation";
import { MD } from "@/lib/theme";
import { PageShell, AppBar, PageContent } from "@/components/ui";

const READY_IDS = new Set([
  "wax-casting", "lock", "ring", "ligature", "solder",
  "tube", "mix", "hemisphere", "weight-params", "volume-weight",
]);

const calculators = [
  {
    id: "wax-casting",
    label: "Расчёт восковки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="10" y="4" width="20" height="32" rx="3" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <rect x="16" y="2" width="8" height="4" rx="1.5" stroke={MD.primary} strokeWidth="2" fill="none"/>
        <line x1="14" y1="14" x2="26" y2="14" stroke={MD.primary} strokeWidth="2"/>
        <line x1="14" y1="20" x2="26" y2="20" stroke={MD.primary} strokeWidth="2"/>
        <line x1="14" y1="26" x2="22" y2="26" stroke={MD.primary} strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "lock",
    label: "Расчёт замка (коробка)",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="8" y="18" width="24" height="18" rx="2" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <path d="M14 18v-5a6 6 0 0112 0v5" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="27" r="2.5" stroke={MD.primary} strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "wire",
    label: "Расчёт ригеля и проволоки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <ellipse cx="20" cy="20" rx="16" ry="8" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <ellipse cx="20" cy="20" rx="10" ry="4" stroke={MD.primary} strokeWidth="1.5" fill="none"/>
        <line x1="4" y1="20" x2="36" y2="20" stroke={MD.primary} strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "ring",
    label: "Расчёт обручальных колец",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="20" r="13" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <circle cx="20" cy="20" r="8" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "ligature",
    label: "Расчёт лигатуры",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
        <rect x="21" y="5" width="14" height="14" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
        <rect x="5" y="21" width="14" height="14" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
        <rect x="21" y="21" width="14" height="14" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "solder",
    label: "Расчёт припоя",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M10 30 Q15 10 20 20 Q25 30 30 10" stroke={MD.primary} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="10" r="3" stroke={MD.primary} strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "tube",
    label: "Расчёт трубки",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="4" y="14" width="32" height="12" rx="2" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <ellipse cx="4" cy="20" rx="3" ry="6" stroke={MD.primary} strokeWidth="1.5" fill="none"/>
        <ellipse cx="36" cy="20" rx="3" ry="6" stroke={MD.primary} strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    id: "density",
    label: "Расчёт плотности или массы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <line x1="20" y1="8" x2="20" y2="32" stroke={MD.primary} strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="8" y1="20" x2="32" y2="20" stroke={MD.primary} strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M14 14l12 12M26 14L14 26" stroke={MD.primary} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "tip",
    label: "Расчёт концевика",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="6" y="16" width="28" height="8" rx="2" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <rect x="6" y="12" width="6" height="16" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
        <rect x="28" y="12" width="6" height="16" rx="2" stroke={MD.primary} strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "mix",
    label: "Смешивание проб",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M8 16l8-8 8 8M8 24l8 8 8-8" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="24" y1="20" x2="36" y2="20" stroke={MD.primary} strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="30" y1="14" x2="36" y2="20" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
        <line x1="30" y1="26" x2="36" y2="20" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "alloy",
    label: "Изменение состава сплава",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M14 6h12v6l4 6-4 6v6H14v-6l-4-6 4-6V6z" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinejoin="round"/>
        <circle cx="20" cy="22" r="3" stroke={MD.primary} strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    id: "formmass",
    label: "Расчёт формомассы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M20 6 C10 6 6 14 6 20 C6 26 10 34 20 34" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M20 6 C30 6 34 14 34 20 C34 26 30 34 20 34" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M12 26 Q16 30 20 28 Q24 26 28 30" stroke={MD.primary} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "hemisphere",
    label: "Расчёт полусферы",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M6 22 A14 14 0 0 1 34 22" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <line x1="6" y1="22" x2="34" y2="22" stroke={MD.primary} strokeWidth="2.2" strokeLinecap="round"/>
        <ellipse cx="20" cy="22" rx="14" ry="4" stroke={MD.primary} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="8" r="2" fill={MD.primary}/>
        <line x1="20" y1="8" x2="20" y2="22" stroke={MD.primary} strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: "weight-params",
    label: "Расчёт веса по параметрам",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M20 4 L24 12 H32 L26 18 L28 26 L20 22 L12 26 L14 18 L8 12 H16 Z" stroke={MD.primary} strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <circle cx="20" cy="16" r="2" fill={MD.primary}/>
      </svg>
    ),
  },
  {
    id: "congo",
    label: "Расчёт серьги Конго",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="22" r="12" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <path d="M16 10 Q20 4 24 10" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="22" r="5" stroke={MD.primary} strokeWidth="1.8" fill="none"/>
      </svg>
    ),
  },
  {
    id: "volume-weight",
    label: "Расчёт веса по объёму",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="8" y="10" width="24" height="22" rx="3" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <path d="M14 10V8a2 2 0 014 0v2M22 10V8a2 2 0 014 0v2" stroke={MD.primary} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M15 19l5 8 5-8" stroke={MD.primary} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "measure-ring",
    label: "Измерение кольца",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="20" r="13" stroke={MD.primary} strokeWidth="2.2" fill="none"/>
        <line x1="20" y1="7" x2="20" y2="12" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
        <line x1="20" y1="28" x2="20" y2="33" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="20" x2="12" y2="20" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="20" x2="33" y2="20" stroke={MD.primary} strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 13a7 7 0 100 14 7 7 0 000-14z" stroke={MD.primary} strokeWidth="1.4" fill="none" strokeDasharray="2 2"/>
        <line x1="20" y1="20" x2="26" y2="14" stroke={MD.primary} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <PageShell>
      {/* Home uses a custom header (no back button) */}
      <header style={{
        background: MD.primary,
        padding: "0 16px",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="#fff"/>
          </svg>
        </div>
        <div>
          <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: 0.15 }}>Ювелирный Калькулятор</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: 0 }}>Профессиональные расчёты</p>
        </div>
      </header>

      <PageContent>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {calculators.map((calc) => {
            const ready = READY_IDS.has(calc.id);
            return (
              <button
                key={calc.id}
                type="button"
                disabled={!ready}
                onClick={() => ready && router.push(`/calc/${calc.id}`)}
                style={{
                  background: MD.surface,
                  borderRadius: 12,
                  border: "none",
                  padding: "16px 8px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 8,
                  cursor: ready ? "pointer" : "default",
                  boxShadow: ready ? MD.elevation1 : "none",
                  transition: "box-shadow 0.18s, transform 0.18s",
                  aspectRatio: "1 / 1",
                  minWidth: 0,
                  opacity: ready ? 1 : 0.4,
                  pointerEvents: ready ? "auto" : "none",
                }}
                onMouseEnter={e => { if (ready) { (e.currentTarget as HTMLButtonElement).style.boxShadow = MD.elevation2; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; } }}
                onMouseLeave={e => { if (ready) { (e.currentTarget as HTMLButtonElement).style.boxShadow = MD.elevation1; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; } }}
                onMouseDown={e  => { if (ready) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px) scale(0.97)"; }}
                onMouseUp={e    => { if (ready) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: MD.primaryLight }}>
                  {calc.icon}
                </div>
                <span style={{ color: MD.textHigh, fontSize: 10.5, fontWeight: 500, textAlign: "center", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", width: "100%" }}>
                  {calc.label}
                </span>
              </button>
            );
          })}
        </div>
      </PageContent>
    </PageShell>
  );
}
