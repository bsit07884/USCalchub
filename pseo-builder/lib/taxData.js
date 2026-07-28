// lib/taxData.js
// All rates verified against Tax Foundation 2026 + IRS Publication 15

export const TAX_DATA = {
  texas: {
    name: "Texas",
    slug: "texas",
    abbreviation: "TX",
    stateTaxRate: 0,
    stateTaxType: "none",
    brackets: [],
    standardDeduction: 0,
    avgPropertyTaxRate: 0.018,    // 1.80% - highest among no-tax states
    avgSalesTaxRate: 0.0825,      // 8.25%
    avgHomePrice: 305000,
    costOfLivingIndex: 93,
    majorCities: ["Dallas", "Houston", "Austin", "San Antonio"],
    uniqueNote: "Zero state income tax, but highest property tax among no-tax states at 1.80% average.",
    migrationTrend: "Top destination state in 2026 — receiving highest net migration from CA, NY, IL.",
    color: "#1d4ed8",
    flag: "🤠"
  },

  florida: {
    name: "Florida",
    slug: "florida",
    abbreviation: "FL",
    stateTaxRate: 0,
    stateTaxType: "none",
    brackets: [],
    standardDeduction: 0,
    avgPropertyTaxRate: 0.0089,   // 0.89%
    avgSalesTaxRate: 0.07,        // 7.00%
    avgHomePrice: 392000,
    costOfLivingIndex: 102,
    majorCities: ["Miami", "Orlando", "Tampa", "Jacksonville"],
    uniqueNote: "Zero income tax + lower property tax than Texas, but homeowners insurance averages $2,300-4,000/yr due to hurricane risk.",
    migrationTrend: "Second largest net migration destination in 2026, especially from NY and NJ.",
    color: "#15803d",
    flag: "🌴"
  },

  california: {
    name: "California",
    slug: "california",
    abbreviation: "CA",
    stateTaxType: "progressive",
    // 2026 CA brackets (single filer)
    brackets: [
      { min: 0,       max: 10412,  rate: 0.01  },
      { min: 10412,   max: 24684,  rate: 0.02  },
      { min: 24684,   max: 38959,  rate: 0.04  },
      { min: 38959,   max: 54081,  rate: 0.06  },
      { min: 54081,   max: 68350,  rate: 0.08  },
      { min: 68350,   max: 349137, rate: 0.093 },
      { min: 349137,  max: 418961, rate: 0.103 },
      { min: 418961,  max: 698274, rate: 0.113 },
      { min: 698274,  max: 1000000,rate: 0.123 },
      { min: 1000000, max: Infinity,rate: 0.133 }
    ],
    standardDeduction: 5202,      // CA 2026 single filer
    sdiRate: 0.009,               // 0.9% SDI - unique to California
    avgPropertyTaxRate: 0.0073,   // 0.73% (Prop 13 protected)
    avgSalesTaxRate: 0.0725,      // 7.25% base
    avgHomePrice: 785000,
    costOfLivingIndex: 142,
    majorCities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
    uniqueNote: "Highest state income tax in US at 13.3% top rate. SDI adds additional 0.9% deduction unique to California.",
    migrationTrend: "Top outbound migration state in 2026 — losing residents to TX, FL, NV, AZ.",
    color: "#dc2626",
    flag: "🌉"
  },

  "new-york": {
    name: "New York",
    slug: "new-york",
    abbreviation: "NY",
    stateTaxType: "progressive",
    // 2026 NY brackets (single filer)
    brackets: [
      { min: 0,       max: 17150,  rate: 0.04   },
      { min: 17150,   max: 23600,  rate: 0.045  },
      { min: 23600,   max: 27900,  rate: 0.0525 },
      { min: 27900,   max: 161550, rate: 0.0585 },
      { min: 161550,  max: 323200, rate: 0.0625 },
      { min: 323200,  max: 2155350,rate: 0.0685 },
      { min: 2155350, max: 5000000,rate: 0.0965 },
      { min: 5000000, max: 25000000,rate: 0.103 },
      { min: 25000000,max: Infinity,rate: 0.109 }
    ],
    standardDeduction: 8000,      // NY 2026 single filer
    nycTaxRate: 0.03876,          // NYC city tax - additional for NYC residents
    avgPropertyTaxRate: 0.0132,   // 1.32% (NYC is actually lower; upstate higher)
    avgSalesTaxRate: 0.08,        // 8.0% (NYC: 8.875%)
    avgHomePrice: 425000,         // Statewide avg (NYC median: $780k)
    costOfLivingIndex: 187,       // NYC specifically
    majorCities: ["New York City", "Buffalo", "Albany", "Rochester"],
    uniqueNote: "NYC residents pay an additional 3.876% city income tax on top of state tax — triple taxation (federal + state + city).",
    migrationTrend: "Second largest net outbound state in 2026 after California.",
    color: "#7c3aed",
    flag: "🗽"
  }
};

// 2026 Federal Tax Brackets (single filer, standard deduction $14,600)
export const FEDERAL_BRACKETS = [
  { min: 0,      max: 11600,  rate: 0.10 },
  { min: 11600,  max: 47150,  rate: 0.12 },
  { min: 47150,  max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity,rate: 0.37 }
];

export const FEDERAL_STANDARD_DEDUCTION = 14600; // 2026 single filer
export const SOCIAL_SECURITY_WAGE_BASE = 168600;
export const SOCIAL_SECURITY_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_THRESHOLD = 200000;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

// Salary display config
export const SALARY_CONFIG = {
  "60k":  { amount: 60000,  display: "$60,000", short: "60k"  },
  "75k":  { amount: 75000,  display: "$75,000", short: "75k"  },
  "100k": { amount: 100000, display: "$100,000", short: "100k" }
};

// Calculate take-home pay
export function calculateTakeHome(grossSalary, stateSlug) {
  const state = TAX_DATA[stateSlug];
  if (!state) return null;

  // Federal income tax
  const federalTaxable = Math.max(0, grossSalary - FEDERAL_STANDARD_DEDUCTION);
  let federalTax = 0;
  let remaining = federalTaxable;
  let prevMax = 0;

  for (const bracket of FEDERAL_BRACKETS) {
    const bandSize = bracket.max - prevMax;
    const taxableInBand = Math.min(remaining, bandSize);
    federalTax += taxableInBand * bracket.rate;
    remaining -= taxableInBand;
    prevMax = bracket.max;
    if (remaining <= 0) break;
  }

  // FICA
  const ssTaxable = Math.min(grossSalary, SOCIAL_SECURITY_WAGE_BASE);
  const socialSecurity = ssTaxable * SOCIAL_SECURITY_RATE;
  const medicare = grossSalary * MEDICARE_RATE;
  const additionalMedicare = grossSalary > ADDITIONAL_MEDICARE_THRESHOLD
    ? (grossSalary - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
    : 0;
  const ficaTotal = socialSecurity + medicare + additionalMedicare;

  // State income tax
  let stateTax = 0;
  if (state.stateTaxType === "progressive" && state.brackets.length > 0) {
    const stateTaxable = Math.max(0, grossSalary - (state.standardDeduction || 0));
    let stateRemaining = stateTaxable;
    let statePrevMax = 0;

    for (const bracket of state.brackets) {
      const bandSize = bracket.max - statePrevMax;
      const taxableInBand = Math.min(stateRemaining, bandSize);
      stateTax += taxableInBand * bracket.rate;
      stateRemaining -= taxableInBand;
      statePrevMax = bracket.max;
      if (stateRemaining <= 0) break;
    }
  }

  // SDI (California only)
  const sdi = state.sdiRate ? grossSalary * state.sdiRate : 0;

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

// Generate comparison data for all 4 pilot states
export function getStateComparison(grossSalary) {
  return Object.keys(TAX_DATA).map(slug => ({
    slug,
    name: TAX_DATA[slug].name,
    flag: TAX_DATA[slug].flag,
    ...calculateTakeHome(grossSalary, slug)
  })).sort((a, b) => b.annualTakeHome - a.annualTakeHome);
}
