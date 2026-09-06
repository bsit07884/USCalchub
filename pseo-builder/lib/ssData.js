/**
 * lib/ssData.js
 * USCalcHub — Social Security State Taxation Data (pSEO Phase 1)
 *
 * SOURCES: Cross-verified against Bankrate, Kiplinger-cited aggregators, and
 * state-specific guidance (Colorado Dept. of Revenue, Bogleheads community
 * verification of CO SB25-136) as of Sept 2026. See `sourceConfidence` and
 * `note` fields per state — a few dollar thresholds (Rhode Island, Utah,
 * Vermont) vary slightly across sources because they are inflation-indexed
 * and adjust every January. DO NOT treat any dollar figure here as
 * permanently fixed — the `disclaimer` string must render on every page
 * that uses this data.
 *
 * LAST VERIFIED: September 2026
 * NEXT REFRESH DUE: January 2027 (thresholds re-index annually)
 *
 * IMPORTANT: Kansas is NOT included — it eliminated its Social Security
 * tax in 2024. If you see Kansas in an older draft/source, that source is
 * stale; do not resurrect it.
 */

export const DISCLAIMER =
  "Income thresholds shown adjust annually for inflation. Figures reflect " +
  "the most recently available data — always confirm the current-year " +
  "threshold with your state's Department of Revenue before filing.";

// ---------------------------------------------------------------------------
// THE 8 STATES THAT TAX SOCIAL SECURITY (Phase 1 — build these first, full
// unique content per state, real differentiation — this is the valuable,
// genuinely differentiated content)
// ---------------------------------------------------------------------------
export const SS_TAXING_STATES = [
  {
    slug: "colorado", name: "Colorado", abbr: "CO",
    taxesSS: true,
    ruleType: "age-based",
    summary: "Fully exempt at age 65+. Ages 55-64 fully exempt if AGI is at or below the threshold; above it, only a partial deduction applies. Under 55, no special SS exemption.",
    thresholds: {
      age65Plus: { exempt: "full", cap: null },
      age55to64: { exemptIfAGIBelow: { single: 75000, joint: 95000 }, capIfAbove: 20000 },
      under55: { exempt: false },
    },
    topRate: 0.044,
    sourceConfidence: "high",
    note: "SB25-136 (effective Jan 1, 2026) also removed caps on the separate pension/annuity subtraction — mention this as a 2026-specific update.",
  },
  {
    slug: "connecticut", name: "Connecticut", abbr: "CT",
    taxesSS: true,
    ruleType: "agi-cutoff",
    summary: "Fully exempt if AGI is at or below the threshold. Above it, no more than 25% of federally taxable benefits become subject to Connecticut tax.",
    thresholds: { exemptIfAGIBelow: { single: 75000, joint: 100000 }, maxTaxablePctAboveThreshold: 0.25 },
    topRate: 0.0699,
    sourceConfidence: "high",
  },
  {
    slug: "minnesota", name: "Minnesota", abbr: "MN",
    taxesSS: true,
    ruleType: "agi-phaseout",
    summary: "Fully exempt below the threshold; the exemption phases out gradually (10% reduction per $4,000 of income above the threshold) rather than disappearing all at once.",
    thresholds: { exemptIfAGIBelow: { single: 84490, joint: 108320 }, phaseoutRate: "10% per $4,000 over threshold" },
    topRate: 0.0985,
    sourceConfidence: "medium-high",
    note: "2025 figures cited across sources; confirm 2026 inflation-adjusted numbers before publishing.",
  },
  {
    slug: "montana", name: "Montana", abbr: "MT",
    taxesSS: true,
    ruleType: "federal-method",
    summary: "Does not use a simple income cutoff like the other seven states. Montana starts from the federally taxable portion of Social Security, then allows a $5,500 (single) / $11,000 (joint) deduction for filers 65+. Most Montana retirees owe some state tax on their benefits.",
    thresholds: { deduction: { single: 5500, joint: 11000, ageRequirement: 65 } },
    topRate: 0.059,
    sourceConfidence: "medium",
    note: "This state needs its own distinct explanation in content — do not force it into the same 'exempt below $X' template as the other states, it's a materially different mechanism.",
  },
  {
    slug: "new-mexico", name: "New Mexico", abbr: "NM",
    taxesSS: true,
    ruleType: "agi-cutoff",
    summary: "Fully exempt if AGI is at or below the threshold — the most generous flat cutoff of the eight states, so most retirees pay nothing.",
    thresholds: { exemptIfAGIBelow: { single: 100000, joint: 150000 } },
    topRate: 0.059,
    sourceConfidence: "high",
  },
  {
    slug: "rhode-island", name: "Rhode Island", abbr: "RI",
    taxesSS: true,
    ruleType: "age-and-agi",
    summary: "Fully exempt only if the filer has reached full retirement age AND AGI is at or below the threshold. Filers below full retirement age do not qualify for the exemption regardless of income.",
    thresholds: { exemptIfAGIBelowAndAtFRA: { single: 107000, joint: 133750 } },
    topRate: 0.0599,
    sourceConfidence: "medium",
    note: "Sources show figures ranging $101K-$107K (single) depending on publish date (annual inflation indexing) — verify the exact current-year number before publishing.",
  },
  {
    slug: "utah", name: "Utah", abbr: "UT",
    taxesSS: true,
    ruleType: "tax-credit",
    summary: "Utah does not exempt Social Security outright — instead it offers a nonrefundable tax credit that offsets the tax owed. Below the income limit, the credit effectively zeroes out SS tax; above it, the credit phases out.",
    thresholds: { creditPhaseoutAboveMAGI: { single: 54000, joint: 90000 } },
    topRate: 0.0455,
    sourceConfidence: "medium",
    note: "Frame this as a credit, not an exemption, in all content — the mechanism matters for accuracy even though the practical effect is similar for lower earners.",
  },
  {
    slug: "vermont", name: "Vermont", abbr: "VT",
    taxesSS: true,
    ruleType: "agi-cutoff-phaseout",
    summary: "Fully exempt below the threshold; a partial exemption phases out at higher incomes rather than disappearing all at once.",
    thresholds: { exemptIfAGIBelow: { single: 50000, joint: 65000 }, phaseoutAbove: true },
    topRate: 0.0875,
    sourceConfidence: "medium",
    note: "Some sources cite $55K/$70K or $65K/$85K instead — variance likely reflects different tax years. Confirm current figure before publishing.",
  },
];

// ---------------------------------------------------------------------------
// TOP NON-TAXING STATES (Phase 2 — comparative angle: "Is Social Security
// taxed in [State]? No — here's why that matters." Do NOT build all 42;
// these 10 cover the highest-population / highest-search-volume states.
// Content here should lean on genuinely different context per state
// (cost of living, other retirement-relevant taxes) rather than repeating
// "not taxed" 10 times with no differentiation.
// ---------------------------------------------------------------------------
export const SS_NON_TAXING_STATES_PHASE2 = [
  "florida", "texas", "california", "new-york", "pennsylvania",
  "ohio", "illinois", "georgia", "north-carolina", "arizona",
];

export function getStateSSInfo(slug) {
  return SS_TAXING_STATES.find((s) => s.slug === slug) || null;
}
