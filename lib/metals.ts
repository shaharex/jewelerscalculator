/** A single probe entry with its display label and density in g/cm³. */
export interface Probe {
    label: string;
    density: number;
}

export const GOLD_PROBES: Probe[] = [
    { label: "999 (24k)", density: 19.3 },
    { label: "958 (23k)", density: 18.5 },
    { label: "916 (22k)", density: 17.8 },
    { label: "875 (21k)", density: 17.3 },
    { label: "750 (18k)", density: 15.5 },
    { label: "585 (14k)", density: 13.5 },
    { label: "500 (12k)", density: 12.0 },
    { label: "375 (9k)", density: 11.5 },
];

export const SILVER_PROBES: Probe[] = [
    { label: "999", density: 10.49 },
    { label: "960", density: 10.4 },
    { label: "925", density: 10.36 },
    { label: "875", density: 10.2 },
    { label: "830", density: 10.0 },
    { label: "800", density: 9.8 },
];

export type MetalType = "gold" | "silver";

export function getProbes(metal: MetalType): Probe[] {
    return metal === "gold" ? GOLD_PROBES : SILVER_PROBES;
}
