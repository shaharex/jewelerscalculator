export const MD = {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    bg: "#F5F5F5",   // page background (MD grey-100)
    surface: "#FFFFFF",   // card surface

    // ── Brand colour ─────────────────────────────────────────────────────────
    primary: "#FFA000",              // amber-700 – buttons, tabs, accents
    primaryLight: "#FFF8E1",            // amber-50  – icon backgrounds, active tabs

    // ── Text hierarchy ────────────────────────────────────────────────────────
    textHigh: "#212121",  // primary text
    textMed: "#616161",  // secondary text / labels
    textLow: "#9E9E9E",  // placeholder / disabled

    // ── Dividers ─────────────────────────────────────────────────────────────
    divider: "#E0E0E0",

    // ── Elevation shadows (z1–z3) ─────────────────────────────────────────────
    elevation1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    elevation2: "0 3px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
    elevation3: "0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.1)",
} as const;
