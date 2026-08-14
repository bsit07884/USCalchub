/**
 * lib/taxData.js
 * USCalcHub — Master 50-State Tax Data for Salary Calculator pSEO
 *
 * SOURCES (verify before each annual refresh — these change every Jan 1):
 *  - Income tax rates/brackets/standard deductions: Tax Foundation,
 *    "State Individual Income Tax Rates and Brackets, 2026" (as of Jan 1, 2026)
 *    https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/
 *  - Property tax effective rates: Tax Foundation, "Property Taxes by State
 *    and County, 2026" (2024 ACS-based, owner-occupied housing)
 *  - Sales tax rates: Tax Foundation, "State and Local Sales Tax Rates,
 *    Midyear 2026" (as of July 1, 2026)
 *  - FICA: IRS Pub 926 / SSA 2026 wage base announcement
 *
 * LAST UPDATED: August 2026 (2026 tax year figures)
 * NEXT REFRESH DUE: January 2027 (states re-set brackets every Jan 1 —
 * some 2027 brackets won't be published until Feb 2027, so plan a
 * "TBD — using prior year" fallback in the UI for early January)
 *
 * IMPORTANT CAVEATS BAKED INTO THIS DATA:
 *  1. "topRate" for progressive states is the marginal rate on the HIGHEST
 *     bracket — NOT the effective rate a $60k/$75k/$100k earner actually
 *     pays. Your calculator must compute effective rate by walking the
 *     bracket array, or the numbers will be wrong and misleading.
 *  2. Some states (CT, IL, IN, MA, MI, NJ, OH, PA, WV) use a personal
 *     exemption instead of / in addition to a standard deduction — see
 *     the `personalExemption` field. Do not silently drop this or the
 *     take-home pay number will be off.
 *  3. `localIncomeTax` flags states where COUNTY/CITY income tax can
 *     apply on top of the state rate (MD, NY, OH, PA, and others have
 *     meaningful local income taxes — e.g. NYC residents pay both NY
 *     state AND NYC city income tax). This is currently a boolean flag;
 *     Phase 2 should add city-level rates for at least NYC and Philadelphia
 *     since those cities appear disproportionately in search queries.
 *  4. Washington and New Hampshire tax investment/capital gains income
 *     only (not wages) — both are flagged noWageIncomeTax: true so the
 *     salary calculator correctly shows $0 state income tax on W-2 wages.
 *  5. South Carolina's top rate is scheduled to revert to 6.2% on
 *     July 1, 2026 (from a temporary 6.0%) — flagged in `notes`.
 */

// ---------------------------------------------------------------------------
// FEDERAL CONSTANTS — 2026 TAX YEAR (apply to every state page)
// ---------------------------------------------------------------------------
export const FEDERAL_2026 = {
  standardDeduction: { single: 16100, marriedJointly: 32200 },
  fica: {
    socialSecurity: {
      rate: 0.062,           // employee share
      wageBase: 184500,      // 2026 SS wage base cap
      maxTax: 11439,         // 6.2% x 184,500
    },
    medicare: {
      rate: 0.0145,          // employee share, no wage cap
      additionalRate: 0.009, // Additional Medicare Tax
      additionalThreshold: { single: 200000, marriedJointly: 250000, marriedSeparately: 125000 },
    },
  },
  // Simplified 2026 federal brackets (single filer) — for reference only.
  // Your calculator should already have a federal engine; this is a fallback.
  federalBracketsSingle2026: [
    { rate: 0.10, over: 0 },
    { rate: 0.12, over: 12400 },
    { rate: 0.22, over: 50400 },
    { rate: 0.24, over: 105475 },
    { rate: 0.32, over: 201775 },
    { rate: 0.35, over: 256225 },
    { rate: 0.37, over: 640600 },
  ],
};

// ---------------------------------------------------------------------------
// SALARY BRACKETS — pSEO child page generation
// Existing (Phase pilot): 60k, 75k, 100k × 4 states = 12 pages (live)
// Phase 1 expansion brackets — see Deliverable 1 for rollout sequencing
// ---------------------------------------------------------------------------
export const SALARY_BRACKETS = [50000, 60000, 75000, 85000, 100000, 120000, 150000];

// ---------------------------------------------------------------------------
// STATE DATA — all 50 states + DC
// ---------------------------------------------------------------------------
export const STATES = [
  {
    slug: "alabama", name: "Alabama", abbr: "AL",
    incomeTax: { type: "progressive", topRate: 0.05, brackets: [{rate:0.02,over:0},{rate:0.04,over:500},{rate:0.05,over:3000}] },
    standardDeduction: { single: 3000, marriedJointly: 8500 },
    personalExemption: { single: 1500, marriedJointly: 3000 },
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.07% effective (some municipalities)",
    propertyTaxEffectiveRate: 0.0037,
    salesTax: { state: 0.0400, avgLocal: 0.0546, combined: 0.0946 },
    migrationTier: 3, notes: "Lowest property tax in the nation.",
  },
  {
    slug: "alaska", name: "Alaska", abbr: "AK",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0094,
    salesTax: { state: 0.0000, avgLocal: 0.0182, combined: 0.0182 },
    migrationTier: 3, notes: "No state income tax; only state that allows local sales tax with no statewide rate.",
  },
  {
    slug: "arizona", name: "Arizona", abbr: "AZ",
    incomeTax: { type: "flat", rate: 0.025 },
    standardDeduction: { single: 8350, marriedJointly: 16700 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0048,
    salesTax: { state: 0.0560, avgLocal: 0.0294, combined: 0.0854 },
    migrationTier: 1, notes: "High inbound migration state — 2.5% is tied for lowest top marginal rate nationally.",
  },
  {
    slug: "arkansas", name: "Arkansas", abbr: "AR",
    incomeTax: { type: "progressive", topRate: 0.039, brackets: [{rate:0.02,over:0},{rate:0.039,over:4600}] },
    standardDeduction: { single: 2470, marriedJointly: 4940 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0056,
    salesTax: { state: 0.0650, avgLocal: 0.0298, combined: 0.0948 },
    migrationTier: 3,
  },
  {
    slug: "california", name: "California", abbr: "CA",
    incomeTax: { type: "progressive", topRate: 0.133, topRateAllIn: 0.144,
      brackets: [{rate:0.01,over:0},{rate:0.02,over:11079},{rate:0.04,over:26264},{rate:0.06,over:41452},{rate:0.08,over:57542},{rate:0.093,over:72724},{rate:0.103,over:371479},{rate:0.113,over:445771},{rate:0.123,over:742953},{rate:0.133,over:1000000}] },
    standardDeduction: { single: 5540, marriedJointly: 11080 },
    personalExemption: { single: 153, marriedJointly: 306, note: "credit, not deduction" },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0070,
    salesTax: { state: 0.0725, avgLocal: 0.0178, combined: 0.0903 },
    migrationTier: 0, notes: "High-outbound origin state (source, not target) — already covered by existing pilot pages.",
  },
  {
    slug: "colorado", name: "Colorado", abbr: "CO",
    incomeTax: { type: "flat", rate: 0.044 },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0050,
    salesTax: { state: 0.0290, avgLocal: 0.0499, combined: 0.0789 },
    migrationTier: 2, notes: "Lowest state-level sales tax rate of any state that levies one (2.9%), but high local add-ons.",
  },
  {
    slug: "connecticut", name: "Connecticut", abbr: "CT",
    incomeTax: { type: "progressive", topRate: 0.0699, brackets: [{rate:0.02,over:0},{rate:0.045,over:10000},{rate:0.055,over:50000},{rate:0.06,over:100000},{rate:0.065,over:200000},{rate:0.069,over:250000},{rate:0.0699,over:500000}] },
    standardDeduction: null,
    personalExemption: { single: 15000, marriedJointly: 24000, note: "phases out; has 'tax benefit recapture' — high earners pay top rate on ALL income" },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0154,
    salesTax: { state: 0.0635, avgLocal: 0.0000, combined: 0.0635 },
    migrationTier: 3, notes: "High-outbound origin state candidate (NYC commuter belt).",
  },
  {
    slug: "delaware", name: "Delaware", abbr: "DE",
    incomeTax: { type: "progressive", topRate: 0.066, brackets: [{rate:0.022,over:2000},{rate:0.039,over:5000},{rate:0.048,over:10000},{rate:0.052,over:20000},{rate:0.0555,over:25000},{rate:0.066,over:60000}] },
    standardDeduction: { single: 3250, marriedJointly: 6500 },
    personalExemption: { single: 110, marriedJointly: 220, note: "credit" },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0054,
    salesTax: { state: 0.0000, avgLocal: 0.0000, combined: 0.0000 },
    migrationTier: 3, notes: "No sales tax at all — strong 'no sales tax' angle for content.",
  },
  {
    slug: "florida", name: "Florida", abbr: "FL",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0078,
    salesTax: { state: 0.0600, avgLocal: 0.0098, combined: 0.0698 },
    migrationTier: 0, notes: "Already fully built (top performer — CA/NY/IL to FL pages live).",
  },
  {
    slug: "georgia", name: "Georgia", abbr: "GA",
    incomeTax: { type: "flat", rate: 0.0519 },
    standardDeduction: { single: 12000, marriedJointly: 24000 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0079,
    salesTax: { state: 0.0400, avgLocal: 0.0356, combined: 0.0756 },
    migrationTier: 1, notes: "High inbound migration (Atlanta metro); recently cut rate from 5.39% to 5.19%.",
  },
  {
    slug: "hawaii", name: "Hawaii", abbr: "HI",
    incomeTax: { type: "progressive", topRate: 0.11, brackets: [{rate:0.014,over:0},{rate:0.032,over:9600},{rate:0.055,over:14400},{rate:0.064,over:19200},{rate:0.068,over:24000},{rate:0.072,over:36000},{rate:0.076,over:48000},{rate:0.079,over:125000},{rate:0.0825,over:175000},{rate:0.09,over:225000},{rate:0.10,over:275000},{rate:0.11,over:325000}] },
    standardDeduction: { single: 4400, marriedJointly: 8800 },
    personalExemption: { single: 1144, marriedJointly: 2288 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0029,
    salesTax: { state: 0.0400, avgLocal: 0.0050, combined: 0.0450 },
    migrationTier: 3, notes: "Lowest property tax rate in the nation, but broadest sales-tax base (taxes many services).",
  },
  {
    slug: "idaho", name: "Idaho", abbr: "ID",
    incomeTax: { type: "flat", rate: 0.053 },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0050,
    salesTax: { state: 0.0600, avgLocal: 0.0003, combined: 0.0603 },
    migrationTier: 1, notes: "High inbound migration state.",
  },
  {
    slug: "illinois", name: "Illinois", abbr: "IL",
    incomeTax: { type: "flat", rate: 0.0495 },
    standardDeduction: null,
    personalExemption: { single: 2925, marriedJointly: 5850 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0188,
    salesTax: { state: 0.0625, avgLocal: 0.0273, combined: 0.0898 },
    migrationTier: 0, notes: "Already fully built (top outbound-origin state — IL to FL/TX pages live).",
  },
  {
    slug: "indiana", name: "Indiana", abbr: "IN",
    incomeTax: { type: "flat", rate: 0.0295 },
    standardDeduction: null,
    personalExemption: { single: 1000, marriedJointly: 2000, dependentNote: "$1,500-$3,000 per dependent depending on conditions" },
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.35% effective county income tax",
    propertyTaxEffectiveRate: 0.0076,
    salesTax: { state: 0.0700, avgLocal: 0.0000, combined: 0.0700 },
    migrationTier: 2, notes: "Rate dropped from 3.0% to 2.95% Jan 1 2026; further cuts scheduled through 2030.",
  },
  {
    slug: "iowa", name: "Iowa", abbr: "IA",
    incomeTax: { type: "flat", rate: 0.038 },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.08% effective",
    propertyTaxEffectiveRate: 0.0133,
    salesTax: { state: 0.0600, avgLocal: 0.0094, combined: 0.0694 },
    migrationTier: 2,
  },
  {
    slug: "kansas", name: "Kansas", abbr: "KS",
    incomeTax: { type: "progressive", topRate: 0.0558, brackets: [{rate:0.052,over:0},{rate:0.0558,over:23000}] },
    standardDeduction: { single: 3605, marriedJointly: 8240 },
    personalExemption: { single: 9160, marriedJointly: 18320 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0121,
    salesTax: { state: 0.0650, avgLocal: 0.0221, combined: 0.0871 },
    migrationTier: 3,
  },
  {
    slug: "kentucky", name: "Kentucky", abbr: "KY",
    incomeTax: { type: "flat", rate: 0.035 },
    standardDeduction: { single: 3360, marriedJointly: 3360, note: "NOT doubled for MFJ" },
    personalExemption: null,
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.93% effective — meaningfully high",
    propertyTaxEffectiveRate: 0.0074,
    salesTax: { state: 0.0600, avgLocal: 0.0000, combined: 0.0600 },
    migrationTier: 2, notes: "Rate dropped from 4% to 3.5% Jan 1 2026.",
  },
  {
    slug: "louisiana", name: "Louisiana", abbr: "LA",
    incomeTax: { type: "flat", rate: 0.03 },
    standardDeduction: { single: 12875, marriedJointly: 25750 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0055,
    salesTax: { state: 0.0500, avgLocal: 0.0513, combined: 0.1013 },
    migrationTier: 3, notes: "Highest combined sales tax rate in the nation (10.13%).",
  },
  {
    slug: "maine", name: "Maine", abbr: "ME",
    incomeTax: { type: "progressive", topRate: 0.0715, brackets: [{rate:0.058,over:0},{rate:0.0675,over:27399},{rate:0.0715,over:64849}] },
    standardDeduction: { single: 8350, marriedJointly: 16700 },
    personalExemption: { single: 5300, marriedJointly: 10600 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0098,
    salesTax: { state: 0.0550, avgLocal: 0.0000, combined: 0.0550 },
    migrationTier: 3,
  },
  {
    slug: "maryland", name: "Maryland", abbr: "MD",
    incomeTax: { type: "progressive", topRate: 0.065, brackets: [{rate:0.02,over:0},{rate:0.03,over:1000},{rate:0.04,over:2000},{rate:0.0475,over:3000},{rate:0.05,over:100000},{rate:0.0525,over:125000},{rate:0.055,over:150000},{rate:0.0575,over:250000},{rate:0.0625,over:500000},{rate:0.065,over:1000000}] },
    standardDeduction: { single: 3350, marriedJointly: 6700 },
    personalExemption: { single: 3200, marriedJointly: 6400, note: "phases out above $100k/$150k AGI" },
    localIncomeTax: true, localIncomeTaxNote: "avg ~2.4% effective — HIGHEST local income tax burden of any state; every MD county levies one",
    propertyTaxEffectiveRate: 0.0092,
    salesTax: { state: 0.0600, avgLocal: 0.0000, combined: 0.0600 },
    migrationTier: 0, notes: "Source state — already covered as outbound-origin, not an inbound target.",
  },
  {
    slug: "massachusetts", name: "Massachusetts", abbr: "MA",
    incomeTax: { type: "progressive", topRate: 0.09, brackets: [{rate:0.05,over:0},{rate:0.09,over:1083150}] },
    standardDeduction: null,
    personalExemption: { single: 4400, marriedJointly: 8800 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0100,
    salesTax: { state: 0.0625, avgLocal: 0.0000, combined: 0.0625 },
    migrationTier: 0, notes: "Source state — Aug 2026 roadmap already includes MA→FL article.",
  },
  {
    slug: "michigan", name: "Michigan", abbr: "MI",
    incomeTax: { type: "flat", rate: 0.0425 },
    standardDeduction: null,
    personalExemption: { single: 5900, marriedJointly: 11800 },
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.16% effective (Detroit and other cities levy local income tax)",
    propertyTaxEffectiveRate: 0.0119,
    salesTax: { state: 0.0600, avgLocal: 0.0000, combined: 0.0600 },
    migrationTier: 0, notes: "Source state — Aug 2026 roadmap already includes MI→FL article.",
  },
  {
    slug: "minnesota", name: "Minnesota", abbr: "MN",
    incomeTax: { type: "progressive", topRate: 0.0985, brackets: [{rate:0.0535,over:0},{rate:0.068,over:33310},{rate:0.0785,over:109430},{rate:0.0985,over:203150}] },
    standardDeduction: { single: 15300, marriedJointly: 30600 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0100,
    salesTax: { state: 0.0688, avgLocal: 0.0126, combined: 0.0814 },
    migrationTier: 0, notes: "Source state — high-outbound migration origin per project priority list.",
  },
  {
    slug: "mississippi", name: "Mississippi", abbr: "MS",
    incomeTax: { type: "flat", rate: 0.04, note: "0% below $10,000" },
    standardDeduction: { single: 2300, marriedJointly: 4600 },
    personalExemption: { single: 6000, marriedJointly: 12000 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0058,
    salesTax: { state: 0.0700, avgLocal: 0.0006, combined: 0.0706 },
    migrationTier: 3, notes: "Rate cut from 4.4% to 4.0% Jan 1 2026; scheduled to phase down to 3.0% by 2030.",
  },
  {
    slug: "missouri", name: "Missouri", abbr: "MO",
    incomeTax: { type: "progressive", topRate: 0.047, brackets: [{rate:0.02,over:1348},{rate:0.025,over:2696},{rate:0.03,over:4044},{rate:0.035,over:5392},{rate:0.04,over:6740},{rate:0.045,over:8088},{rate:0.047,over:9436}] },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.18% effective (Kansas City, St. Louis levy local earnings tax)",
    propertyTaxEffectiveRate: 0.0089,
    salesTax: { state: 0.0423, avgLocal: 0.0422, combined: 0.0844 },
    migrationTier: 2,
  },
  {
    slug: "montana", name: "Montana", abbr: "MT",
    incomeTax: { type: "progressive", topRate: 0.0565, brackets: [{rate:0.047,over:0},{rate:0.0565,over:47500}] },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0061,
    salesTax: { state: 0.0000, avgLocal: 0.0000, combined: 0.0000 },
    migrationTier: 1, notes: "No sales tax; top rate cut from 5.9% to 5.65% for 2026, dropping to 5.4% in 2027.",
  },
  {
    slug: "nebraska", name: "Nebraska", abbr: "NE",
    incomeTax: { type: "progressive", topRate: 0.0455, brackets: [{rate:0.0246,over:0},{rate:0.0351,over:4130},{rate:0.0455,over:24760}] },
    standardDeduction: { single: 8850, marriedJointly: 17700 },
    personalExemption: { single: 176, marriedJointly: 352, note: "credit" },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0144,
    salesTax: { state: 0.0550, avgLocal: 0.0148, combined: 0.0698 },
    migrationTier: 3, notes: "Top rate cut sharply from 5.2% to 4.55% for 2026 — good 'tax cut' content angle.",
  },
  {
    slug: "nevada", name: "Nevada", abbr: "NV",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0050,
    salesTax: { state: 0.0685, avgLocal: 0.0139, combined: 0.0824 },
    migrationTier: 0, notes: "Already fully built — CA-to-NV top performer page live.",
  },
  {
    slug: "new-hampshire", name: "New Hampshire", abbr: "NH",
    incomeTax: { type: "none", noWageIncomeTax: true, note: "Repealed interest & dividends tax as of 2025 — now zero income tax of any kind." },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0150,
    salesTax: { state: 0.0000, avgLocal: 0.0000, combined: 0.0000 },
    migrationTier: 1, notes: "No income OR sales tax, but 5th-highest property tax rate — strong 'hidden cost' angle for content.",
  },
  {
    slug: "new-jersey", name: "New Jersey", abbr: "NJ",
    incomeTax: { type: "progressive", topRate: 0.1075, brackets: [{rate:0.014,over:0},{rate:0.0175,over:20000},{rate:0.0245,over:50000},{rate:0.035,over:70000},{rate:0.0553,over:80000},{rate:0.0637,over:150000},{rate:0.0897,over:500000},{rate:0.1075,over:1000000}], note: "single-filer brackets differ — see source table" },
    standardDeduction: null,
    personalExemption: { single: 1000, marriedJointly: 2000 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0188,
    salesTax: { state: 0.0663, avgLocal: -0.0002, combined: 0.0660 },
    migrationTier: 0, notes: "Highest property tax + progressive income tax — top source state, already covered as origin.",
  },
  {
    slug: "new-mexico", name: "New Mexico", abbr: "NM",
    incomeTax: { type: "progressive", topRate: 0.059, brackets: [{rate:0.015,over:0},{rate:0.032,over:5500},{rate:0.043,over:16500},{rate:0.047,over:33500},{rate:0.049,over:66500},{rate:0.059,over:210000}] },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0063,
    salesTax: { state: 0.0488, avgLocal: 0.0280, combined: 0.0768, note: "gross receipts tax structure, broad base" },
    migrationTier: 1,
  },
  {
    slug: "new-york", name: "New York", abbr: "NY",
    incomeTax: { type: "progressive", topRate: 0.109, brackets: [{rate:0.039,over:0},{rate:0.044,over:8500},{rate:0.0515,over:11700},{rate:0.054,over:13900},{rate:0.059,over:80650},{rate:0.0685,over:215400},{rate:0.0965,over:1077550},{rate:0.103,over:5000000},{rate:0.109,over:25000000}] },
    standardDeduction: { single: 8000, marriedJointly: 16050 },
    personalExemption: null,
    localIncomeTax: true, localIncomeTaxNote: "avg ~1.60% effective statewide — NYC residents pay a SEPARATE city income tax up to 3.876% on top of state rate; consider a dedicated NYC data point in Phase 2",
    propertyTaxEffectiveRate: 0.0130,
    salesTax: { state: 0.0400, avgLocal: 0.0454, combined: 0.0854 },
    migrationTier: 0, notes: "Already fully built — top-performer NY-to-FL page live (position 9).",
  },
  {
    slug: "north-carolina", name: "North Carolina", abbr: "NC",
    incomeTax: { type: "flat", rate: 0.0399 },
    standardDeduction: { single: 12750, marriedJointly: 25500 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0066,
    salesTax: { state: 0.0475, avgLocal: 0.0235, combined: 0.0710 },
    migrationTier: 1, notes: "Completed phase-down to flat 3.99% Jan 1 2026 (from 4.25%) — high inbound migration state.",
  },
  {
    slug: "north-dakota", name: "North Dakota", abbr: "ND",
    incomeTax: { type: "progressive", topRate: 0.025, brackets: [{rate:0.0195,over:48475},{rate:0.025,over:244825}], note: "0% below $48,475 single" },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0092,
    salesTax: { state: 0.0500, avgLocal: 0.0209, combined: 0.0709 },
    migrationTier: 3, notes: "Tied for lowest top marginal rate in the nation (2.5%, along with Arizona).",
  },
  {
    slug: "ohio", name: "Ohio", abbr: "OH",
    incomeTax: { type: "flat", rate: 0.0275, note: "0% below $26,050; moved to single flat rate Jan 1 2026" },
    standardDeduction: null,
    personalExemption: { single: 2400, marriedJointly: 4800, note: "phases down above $40k AGI, unavailable above $500k MAGI" },
    localIncomeTax: true, localIncomeTaxNote: "avg ~1.2% effective — most OH municipalities levy a local income tax (Columbus, Cleveland, Cincinnati all do)",
    propertyTaxEffectiveRate: 0.0136,
    salesTax: { state: 0.0575, avgLocal: 0.0154, combined: 0.0729 },
    migrationTier: 2, notes: "Aug 2026 roadmap already includes OH→TX article; new flat-tax structure is a fresh content angle.",
  },
  {
    slug: "oklahoma", name: "Oklahoma", abbr: "OK",
    incomeTax: { type: "progressive", topRate: 0.045, brackets: [{rate:0.025,over:3750},{rate:0.035,over:4900},{rate:0.045,over:7200}] },
    standardDeduction: { single: 6350, marriedJointly: 12700 },
    personalExemption: { single: 1000, marriedJointly: 2000 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0079,
    salesTax: { state: 0.0450, avgLocal: 0.0456, combined: 0.0906 },
    migrationTier: 2, notes: "Collapsed 6 brackets into 3 for 2026, cut top rate 4.75%→4.5%; has automatic phase-out trigger toward $0.",
  },
  {
    slug: "oregon", name: "Oregon", abbr: "OR",
    incomeTax: { type: "progressive", topRate: 0.099, brackets: [{rate:0.0475,over:0},{rate:0.0675,over:4550},{rate:0.0875,over:11400},{rate:0.099,over:125000}] },
    standardDeduction: { single: 2910, marriedJointly: 5820 },
    personalExemption: { single: 256, marriedJointly: 512, note: "credit, phases out above $100k/$200k" },
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.18% effective (Portland-area transit/local taxes)",
    propertyTaxEffectiveRate: 0.0081,
    salesTax: { state: 0.0000, avgLocal: 0.0000, combined: 0.0000 },
    migrationTier: 1, notes: "No sales tax at all — great 'no sales tax' state pair content vs high-income-tax reality.",
  },
  {
    slug: "pennsylvania", name: "Pennsylvania", abbr: "PA",
    incomeTax: { type: "flat", rate: 0.0307 },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: true, localIncomeTaxNote: "avg ~0.99% effective — Philadelphia has one of the highest local wage tax rates in the US (~3.75% resident rate)",
    propertyTaxEffectiveRate: 0.0126,
    salesTax: { state: 0.0600, avgLocal: 0.0034, combined: 0.0634 },
    migrationTier: 2, notes: "Very low flat rate (3.07%) but Philadelphia local wage tax materially changes the real number — flag this prominently in Philly-specific content.",
  },
  {
    slug: "rhode-island", name: "Rhode Island", abbr: "RI",
    incomeTax: { type: "progressive", topRate: 0.0599, brackets: [{rate:0.0375,over:0},{rate:0.0475,over:82050},{rate:0.0599,over:186450}] },
    standardDeduction: { single: 11200, marriedJointly: 22400 },
    personalExemption: { single: 5250, marriedJointly: 10500 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0112,
    salesTax: { state: 0.0700, avgLocal: 0.0000, combined: 0.0700 },
    migrationTier: 3,
  },
  {
    slug: "south-carolina", name: "South Carolina", abbr: "SC",
    incomeTax: { type: "progressive", topRate: 0.06, brackets: [{rate:0.00,over:0},{rate:0.03,over:3640},{rate:0.06,over:18230}], note: "Top rate scheduled to revert 6.0%→6.2% on July 1, 2026 per Act 110/H.4216 — verify current rate before each content refresh" },
    standardDeduction: { single: 8350, marriedJointly: 16700 },
    personalExemption: { single: null, marriedJointly: null, dependent: 4930 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0049,
    salesTax: { state: 0.0600, avgLocal: 0.0149, combined: 0.0749 },
    migrationTier: 1, notes: "High inbound migration state; low property tax on owner-occupied (investor property assessed at higher 6% ratio — worth a callout).",
  },
  {
    slug: "south-dakota", name: "South Dakota", abbr: "SD",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0100,
    salesTax: { state: 0.0420, avgLocal: 0.0191, combined: 0.0611 },
    migrationTier: 2,
  },
  {
    slug: "tennessee", name: "Tennessee", abbr: "TN",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0052,
    salesTax: { state: 0.0700, avgLocal: 0.0261, combined: 0.0961 },
    migrationTier: 1, notes: "High inbound migration state; no income tax but 2nd-highest combined sales tax (9.61%) — good 'hidden cost' article angle.",
  },
  {
    slug: "texas", name: "Texas", abbr: "TX",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0140,
    salesTax: { state: 0.0625, avgLocal: 0.0195, combined: 0.0820 },
    migrationTier: 0, notes: "Already fully built (top target across the whole site).",
  },
  {
    slug: "utah", name: "Utah", abbr: "UT",
    incomeTax: { type: "flat", rate: 0.045 },
    standardDeduction: { single: null, marriedJointly: null, note: "structured as 6% nonrefundable credit on federal std/itemized deduction, phases out above ~$18,213 single AGI" },
    personalExemption: { dependent: 2111 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0048,
    salesTax: { state: 0.0610, avgLocal: 0.0132, combined: 0.0742 },
    migrationTier: 1, notes: "High inbound migration state; low property tax.",
  },
  {
    slug: "vermont", name: "Vermont", abbr: "VT",
    incomeTax: { type: "progressive", topRate: 0.0875, brackets: [{rate:0.0335,over:0},{rate:0.066,over:49400},{rate:0.076,over:119700},{rate:0.0875,over:249700}] },
    standardDeduction: { single: 7650, marriedJointly: 15300 },
    personalExemption: { single: 5300, marriedJointly: 10600 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0151,
    salesTax: { state: 0.0600, avgLocal: 0.0043, combined: 0.0643 },
    migrationTier: 3,
  },
  {
    slug: "virginia", name: "Virginia", abbr: "VA",
    incomeTax: { type: "progressive", topRate: 0.0575, brackets: [{rate:0.02,over:0},{rate:0.03,over:3000},{rate:0.05,over:5000},{rate:0.0575,over:17000}] },
    standardDeduction: { single: 8750, marriedJointly: 17500 },
    personalExemption: { single: 930, marriedJointly: 1860 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0078,
    salesTax: { state: 0.0530, avgLocal: 0.0047, combined: 0.0577 },
    migrationTier: 2, notes: "Top bracket kicks in at just $17,000 — nearly a flat tax in practice for most earners; useful nuance for content.",
  },
  {
    slug: "washington", name: "Washington", abbr: "WA",
    incomeTax: { type: "none", noWageIncomeTax: true, note: "Capital gains tax only (7% over $1M threshold, 9% above — 2025 law change); wages are NOT taxed." },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0075,
    salesTax: { state: 0.0650, avgLocal: 0.0307, combined: 0.0957 },
    migrationTier: 1, notes: "No wage income tax but 3rd-highest combined sales tax nationally (9.57%) — strong 'hidden cost' angle; also has a separate 0.58% payroll tax for WA Cares long-term-care program not reflected in sales/income figures.",
  },
  {
    slug: "west-virginia", name: "West Virginia", abbr: "WV",
    incomeTax: { type: "progressive", topRate: 0.0482, brackets: [{rate:0.0222,over:0},{rate:0.0296,over:10000},{rate:0.0333,over:25000},{rate:0.0444,over:40000},{rate:0.0482,over:60000}] },
    standardDeduction: null,
    personalExemption: { single: 2000, marriedJointly: 4000 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0051,
    salesTax: { state: 0.0600, avgLocal: 0.0060, combined: 0.0660 },
    migrationTier: 3,
  },
  {
    slug: "wisconsin", name: "Wisconsin", abbr: "WI",
    incomeTax: { type: "progressive", topRate: 0.0765, brackets: [{rate:0.035,over:0},{rate:0.044,over:15110},{rate:0.053,over:51950},{rate:0.0765,over:332720}] },
    standardDeduction: { single: 13960, marriedJointly: 25840, note: "phases out above ~$20,119/$29,039, hits zero at $136,453/$159,690" },
    personalExemption: { single: 700, marriedJointly: 1400 },
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0132,
    salesTax: { state: 0.0500, avgLocal: 0.0072, combined: 0.0572 },
    migrationTier: 2,
  },
  {
    slug: "wyoming", name: "Wyoming", abbr: "WY",
    incomeTax: { type: "none" },
    standardDeduction: null, personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0053,
    salesTax: { state: 0.0400, avgLocal: 0.0139, combined: 0.0539 },
    migrationTier: 2,
  },
  {
    slug: "washington-dc", name: "Washington DC", abbr: "DC",
    incomeTax: { type: "progressive", topRate: 0.1075, brackets: [{rate:0.04,over:0},{rate:0.06,over:10000},{rate:0.065,over:40000},{rate:0.085,over:60000},{rate:0.0925,over:250000},{rate:0.0975,over:500000},{rate:0.1075,over:1000000}] },
    standardDeduction: { single: 16100, marriedJointly: 32200 },
    personalExemption: null,
    localIncomeTax: false,
    propertyTaxEffectiveRate: 0.0056,
    salesTax: { state: 0.0600, avgLocal: 0.0000, combined: 0.0600 },
    migrationTier: 3, notes: "Not a state, but commonly searched as one — include if targeting DC-metro searchers (VA/MD commuter content).",
  },
];

export const SALARY_CONFIG = {
  "50k":  { amount: 50000,  display: "$50,000", short: "50k"  },
  "60k":  { amount: 60000,  display: "$60,000", short: "60k"  },
  "75k":  { amount: 75000,  display: "$75,000", short: "75k"  },
  "85k":  { amount: 85000,  display: "$85,000", short: "85k"  },
  "100k": { amount: 100000, display: "$100,000", short: "100k" },
  "120k": { amount: 120000, display: "$120,000", short: "120k" },
  "150k": { amount: 150000, display: "$150,000", short: "150k" }
};

export function calculateTakeHome(grossSalary, stateSlug) {
  const state = STATES.find((s) => s.slug === stateSlug);
  if (!state) return null;

  // 1. Federal Tax
  const federalStandardDeduction = FEDERAL_2026.standardDeduction.single;
  const federalTaxable = Math.max(0, grossSalary - federalStandardDeduction);
  let federalTax = 0;
  const fedBrackets = FEDERAL_2026.federalBracketsSingle2026;
  for (let i = 0; i < fedBrackets.length; i++) {
    const min = fedBrackets[i].over;
    const max = (i + 1 < fedBrackets.length) ? fedBrackets[i + 1].over : Infinity;
    if (federalTaxable > min) {
      const taxableInBand = Math.min(federalTaxable, max) - min;
      federalTax += taxableInBand * fedBrackets[i].rate;
    }
  }

  // 2. FICA (Social Security + Medicare)
  const ssTaxable = Math.min(grossSalary, FEDERAL_2026.fica.socialSecurity.wageBase);
  const socialSecurity = ssTaxable * FEDERAL_2026.fica.socialSecurity.rate;
  const medicare = grossSalary * FEDERAL_2026.fica.medicare.rate;
  const additionalMedicareThreshold = FEDERAL_2026.fica.medicare.additionalThreshold.single;
  const additionalMedicare = grossSalary > additionalMedicareThreshold
    ? (grossSalary - additionalMedicareThreshold) * FEDERAL_2026.fica.medicare.additionalRate
    : 0;
  const ficaTotal = socialSecurity + medicare + additionalMedicare;

  // 3. State Tax
  let stateTax = 0;
  let sdi = 0;

  // CA legacy compat (SDI) - optional since missing in new data
  if (stateSlug === 'california') {
    sdi = grossSalary * 0.009;
  }

  let stateExemptionDeduction = 0;
  let stateTaxCredit = 0;
  
  if (state.personalExemption?.single) {
     if (state.personalExemption.note && state.personalExemption.note.includes("credit")) {
         stateTaxCredit = state.personalExemption.single;
     } else {
         stateExemptionDeduction = state.personalExemption.single;
     }
  }

  const stateStdDeduction = state.standardDeduction?.single || 0;
  const stateTaxable = Math.max(0, grossSalary - stateStdDeduction - stateExemptionDeduction);

  if (state.incomeTax.type === "progressive" && state.incomeTax.brackets) {
    const stateBrackets = state.incomeTax.brackets;
    for (let i = 0; i < stateBrackets.length; i++) {
      const min = stateBrackets[i].over;
      const max = (i + 1 < stateBrackets.length) ? stateBrackets[i + 1].over : Infinity;
      if (stateTaxable > min) {
        const taxableInBand = Math.min(stateTaxable, max) - min;
        stateTax += taxableInBand * stateBrackets[i].rate;
      }
    }
  } else if (state.incomeTax.type === "flat") {
    stateTax = stateTaxable * state.incomeTax.rate;
  } else if (state.incomeTax.type === "none") {
    stateTax = 0;
  }

  stateTax = Math.max(0, stateTax - stateTaxCredit);

  const totalDeductions = federalTax + ficaTotal + stateTax + sdi;
  const annualTakeHome = grossSalary - totalDeductions;

  return {
    gross: grossSalary,
    federalTax: Math.round(federalTax),
    socialSecurity: Math.round(socialSecurity),
    medicare: Math.round(medicare + additionalMedicare),
    ficaTotal: Math.round(ficaTotal),
    stateTax: Math.round(stateTax),
    sdi: Math.round(sdi),
    totalDeductions: Math.round(totalDeductions),
    annualTakeHome: Math.round(annualTakeHome),
    monthlyTakeHome: Math.round(annualTakeHome / 12),
    biweeklyTakeHome: Math.round(annualTakeHome / 26),
    weeklyTakeHome: Math.round(annualTakeHome / 52),
    effectiveFederalRate: ((federalTax / grossSalary) * 100).toFixed(1),
    effectiveStateRate: ((stateTax / grossSalary) * 100).toFixed(1),
    effectiveTotalRate: ((totalDeductions / grossSalary) * 100).toFixed(1),
    stateInfo: state
  };
}

export function getStateComparison(grossSalary) {
  return STATES.map(s => ({
    slug: s.slug,
    name: s.name,
    flag: s.flag || "🇺🇸",
    ...calculateTakeHome(grossSalary, s.slug)
  })).sort((a, b) => b.annualTakeHome - a.annualTakeHome);
}

// ---------------------------------------------------------------------------
// ROLLOUT SCOPE — Defines exactly which pages are live.
// Anything not in these groups will 404 (fallback: false in getStaticPaths)
// ---------------------------------------------------------------------------
const LIVE_GROUP_A_STATES = ["texas", "florida", "california", "new-york"];
const LIVE_GROUP_A_BRACKETS = ["60k", "75k", "100k"];

const LIVE_GROUP_B_STATES = ["nevada", "tennessee", "arizona", "north-carolina", "georgia", "idaho", "utah", "south-carolina", "oregon", "montana"];
const LIVE_GROUP_B_BRACKETS = ["50k", "75k", "85k"];

export function isLiveScope(stateSlug, bracketShort) {
  if (LIVE_GROUP_A_STATES.includes(stateSlug) && LIVE_GROUP_A_BRACKETS.includes(bracketShort)) {
    return true;
  }
  if (LIVE_GROUP_B_STATES.includes(stateSlug) && LIVE_GROUP_B_BRACKETS.includes(bracketShort)) {
    return true;
  }
  return false;
}

export function getAllChildPagePaths() {
  const paths = [];
  for (const state of STATES) {
    for (const shortAmount of Object.keys(SALARY_CONFIG)) {
      if (isLiveScope(state.slug, shortAmount)) {
        paths.push({ params: { state: state.slug, amount: shortAmount } });
      }
    }
  }
  return paths;
}

export function getStateBySlug(slug) {
  return STATES.find((s) => s.slug === slug) || null;
}

export function getLiveStates() {
  return STATES.filter(s => LIVE_GROUP_A_STATES.includes(s.slug) || LIVE_GROUP_B_STATES.includes(s.slug));
}

export default STATES;
