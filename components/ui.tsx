/**
 * Shared primitive UI components used across all calculator pages.
 *
 * These are the building-blocks that every page composes — keeping layouts
 * consistent without repeating the same JSX + inline-style blocks.
 */

"use client";

import React from "react";
import { MD } from "@/lib/theme";
import { type MetalType, type Probe, getProbes } from "@/lib/metals";

// ─────────────────────────────────────────────────────────────────────────────
// Layout primitives
// ─────────────────────────────────────────────────────────────────────────────

/** White elevated card — wraps any calculator section. */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: MD.surface,
        borderRadius: 12,
        padding: "16px 16px",
        boxShadow: MD.elevation1,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** UPPERCASE grey label — used as a card title / field label. */
export function Label({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        color: MD.textLow,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Thin horizontal rule between result rows. */
export function Divider() {
  return <div style={{ height: 1, background: MD.divider, margin: "8px 0" }} />;
}

/** A single key-value result row (label on left, value on right). */
export function ResRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: MD.textMed, fontSize: 14 }}>{label}</span>
      <span style={{ color: MD.textHigh, fontWeight: 600, fontSize: 15 }}>{value}</span>
    </div>
  );
}

/** The big amber "total" row shown at the bottom of a result card. */
export function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
      <span style={{ color: MD.textHigh, fontWeight: 700, fontSize: 15 }}>{label}</span>
      <span style={{ color: MD.primary, fontWeight: 800, fontSize: 26 }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App bar
// ─────────────────────────────────────────────────────────────────────────────

/** Amber sticky app bar with a back-arrow button and a title. */
export function AppBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header
      style={{
        background: MD.primary,
        padding: "0 8px",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 4,
        boxShadow: MD.elevation2,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <button
        onClick={onBack}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill="#fff"
          />
        </svg>
      </button>
      <h1
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: 500,
          margin: 0,
          letterSpacing: 0.15,
        }}
      >
        {title}
      </h1>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Metal selector (tabs + probe dropdown + density display)
// ─────────────────────────────────────────────────────────────────────────────

/** Gold / Silver tab switcher. */
export function MetalTabs({
  metal,
  onChange,
}: {
  metal: MetalType;
  onChange: (m: MetalType) => void;
}) {
  return (
    <div
      style={{
        background: MD.surface,
        borderRadius: 12,
        boxShadow: MD.elevation1,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {(["gold", "silver"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            flex: 1,
            padding: "13px 0",
            border: "none",
            borderBottom:
              metal === m ? `3px solid ${MD.primary}` : "3px solid transparent",
            background: metal === m ? MD.primaryLight : "transparent",
            color: metal === m ? MD.primary : MD.textMed,
            fontWeight: metal === m ? 700 : 400,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.18s",
            letterSpacing: 0.4,
          }}
        >
          {m === "gold" ? "Золото" : "Серебро"}
        </button>
      ))}
    </div>
  );
}

/** Probe dropdown + density side-card, rendered as a row. */
export function ProbeRow({
  metal,
  probeIndex,
  onProbeChange,
}: {
  metal: MetalType;
  probeIndex: number;
  onProbeChange: (index: number) => void;
}) {
  const probes: Probe[] = getProbes(metal);
  const selected = probes[probeIndex] ?? probes[0];

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {/* Probe selector */}
      <Card style={{ flex: 1 }}>
        <Label>Проба металла:</Label>
        <div style={{ position: "relative", marginTop: 4 }}>
          <select
            value={probeIndex}
            onChange={(e) => onProbeChange(Number(e.target.value))}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: MD.textHigh,
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              paddingRight: 22,
            }}
          >
            {probes.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </select>
          <svg
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" fill={MD.textMed} />
          </svg>
        </div>
      </Card>

      {/* Density display */}
      <Card style={{ minWidth: 120, alignItems: "center" }}>
        <Label style={{ textAlign: "center" }}>Плотность гр/см3</Label>
        <p
          style={{
            color: MD.textHigh,
            fontSize: 22,
            fontWeight: 700,
            margin: "6px 0 0",
          }}
        >
          {selected.density}
        </p>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Action buttons
// ─────────────────────────────────────────────────────────────────────────────

/** ОЧИСТИТЬ + РАССЧИТАТЬ button pair. */
export function ActionButtons({
  onClear,
  onCalculate,
}: {
  onClear: () => void;
  onCalculate: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button
        onClick={onClear}
        style={{
          flex: 1,
          padding: "14px 0",
          borderRadius: 10,
          border: `1.5px solid ${MD.divider}`,
          background: MD.surface,
          color: MD.textMed,
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          letterSpacing: 0.5,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill={MD.textMed}>
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
        ОЧИСТИТЬ
      </button>
      <button
        onClick={onCalculate}
        style={{
          flex: 1.6,
          padding: "14px 0",
          borderRadius: 10,
          border: "none",
          background: MD.primary,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          letterSpacing: 0.8,
          boxShadow: MD.elevation2,
        }}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="#fff">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        РАССЧИТАТЬ
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Numeric input with amber underline
// ─────────────────────────────────────────────────────────────────────────────

/** A labelled numeric input field inside a Card, with an amber bottom border. */
export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  unit,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  unit?: string;
}) {
  return (
    <Card>
      <Label>{label}</Label>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0.0"}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: MD.textHigh,
            fontSize: 28,
            fontWeight: 700,
            caretColor: MD.primary,
          }}
        />
        {unit && (
          <span style={{ color: MD.textMed, fontWeight: 500, fontSize: 15 }}>
            {unit}
          </span>
        )}
      </div>
      <div
        style={{
          height: 2,
          background: MD.primary,
          borderRadius: 1,
          marginTop: 6,
          opacity: 0.7,
        }}
      />
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step stepper button (±)
// ─────────────────────────────────────────────────────────────────────────────

/** Small +/− stepper button used in coefficient fields. */
export function StepBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: MD.primaryLight,
        border: "1.5px solid #FFE082",
        color: "#F57F17",
        fontSize: 22,
        fontWeight: 400,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard page shell: grey background + centred max-width column.
 * Wrap the entire page content with this.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: MD.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Scrollable main content area with standard vertical padding/gap.
 */
export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        flex: 1,
        padding: "16px 16px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflowY: "auto",
      }}
    >
      {children}
    </main>
  );
}
