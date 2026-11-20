// pseo-builder/lib/overtimeData.js
export const OVERTIME_CALCULATOR_DATA = {
  meta: {
    title: "Overtime Pay & Tax Calculator 2026: Time and a Half Tax Breakdown",
    metaDescription: "Calculate exact time-and-a-half (1.5x) and double-time (2.0x) overtime pay for 2026. Discover why payroll withholds 22% supplemental tax and calculate true net take-home.",
    h1: "2026 Overtime Pay & Supplemental Tax Calculator",
    canonicalUrl: "https://uscalchub.com/overtime-calculator/"
  },

  // 45-55 Word Direct Answer Block (Google AI Overview & Perplexity Extraction)
  aeoDirectAnswer: "Overtime pay is not taxed permanently higher than regular wages under IRS rules. While payroll systems often withhold taxes at a higher upfront rate—either through the 22% flat supplemental wage withholding method or an elevated annualized withholding bracket—your true liability reconciles strictly according to standard federal marginal tax brackets (10% to 37%) upon filing your annual return, generating a tax refund if over-withheld.",

  // Statutory Calculation Engine Parameters (IRS Pub 15-T & FLSA 2026)
  engineParameters: {
    flsaStandardThresholdHours: 40,
    timeAndAHalfMultiplier: 1.5,
    doubleTimeMultiplier: 2.0,
    irsSupplementalFlatRatePct: 22.0,
    ficaSocialSecurityRatePct: 6.2,
    ficaMedicareRatePct: 1.45,
    ficaWageBaseCap2026: 176100,
    additionalMedicareThresholdSingle: 200000,
    additionalMedicareRatePct: 0.9
  },

  // Comprehensive Statutory Editorial Sections (1,000+ Words Total)
  editorialSections: {
    flsaFrameworkHtml: `
      <h2>Fair Labor Standards Act (FLSA) Statutory Overtime Architecture</h2>
      <p>
        In the United States, overtime compensation is governed by the <strong>Fair Labor Standards Act (FLSA)</strong>, codified under 29 U.S.C. § 207. Under federal statute, non-exempt covered employees must receive compensation for all hours worked in excess of <strong>40 regular hours during a standard seven-day workweek</strong> at a statutory rate not less than <strong>one and one-half times (1.5x)</strong> their regular base hourly rate of pay.
      </p>
      <p>
        The regular hourly rate is not merely base salary; under Department of Labor (DOL) regulations, it must incorporate non-discretionary bonuses, performance shift differentials, and hazardous duty stipends. Furthermore, while federal statute does not mandate <strong>double-time (2.0x)</strong> compensation, union collective bargaining agreements (CBA) and specific state statutes (such as California Labor Code § 510, which mandates double-time for work surpassing 12 hours in a single workday or 8 hours on the seventh consecutive day of a workweek) require secondary computational tiers.
      </p>
    `,

    supplementalTaxMythBusterHtml: `
      <h2>The 22% Supplemental Tax Myth-Buster: Why Overtime Checks Seem Over-Taxed</h2>
      <p>
        The most persistent myth among American wage earners is that <em>"working overtime pushes you into a higher tax bracket where you lose money."</em> This misconception stems from how automated employer payroll software (such as ADP, Paycheque, and Gusto) processes intermittent supplemental wages under <strong>IRS Publication 15-T (Federal Income Tax Withholding Methods)</strong>.
      </p>
      <p>
        Employers typically deploy one of two IRS-sanctioned withholding methods on overtime pay:
      </p>
      <ol>
        <li>
          <strong>The Aggregate Withholding Method:</strong> If overtime hours are bundled directly into your normal paycheck, the payroll software multiplies that single period's inflated gross pay by the total number of pay periods in the year (e.g., 26 biweekly periods). The algorithm falsely presumes you earn that elevated amount every single paycheck of the year, artificially subjecting those overtime dollars to an elevated marginal withholding bracket (e.g., withholding at 22% or 24% rather than your true 12% baseline).
        </li>
        <li>
          <strong>The Flat 22% Supplemental Rate:</strong> When employers pay overtime or quarterly bonuses via separate checks, Treasury Regulation § 31.3402(g)-1 permits a mandatory flat withholding rate of <strong>22.0%</strong> for supplemental wages under $1 million ($37.0% for supplemental wages exceeding $1 million). If your effective federal income tax bracket is normally 10% or 12%, withholding at 22% creates an immediate cash flow reduction.
        </li>
      </ol>
      <p>
        <strong>The Year-End Reality:</strong> Withholding is merely a preliminary escrow payment toward your tax bill, not your actual tax rate. At tax time, all earnings (regular wages, overtime, shift premiums) combine into a single gross figure on Line 1z of IRS Form 1040. If your employer withheld at 22% but your final top marginal tax bracket was only 12%, <strong>the entire 10% excess withholding is returned to you dollar-for-dollar as an IRS tax refund</strong>.
      </p>
    `,

    mathematicalFormulaHtml: `
      <h2>Mathematical Overtime Formulas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-white font-bold text-sm mb-2">Time-and-a-Half (1.5x)</h4>
          <code class="text-emerald-400 text-xs block">Overtime Pay = Base Rate × 1.5 × Overtime Hours</code>
          <p class="text-xs text-slate-400 mt-2">Applies to all hours worked beyond 40 hours in a 7-day period under federal FLSA mandates.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-white font-bold text-sm mb-2">Double-Time (2.0x)</h4>
          <code class="text-emerald-400 text-xs block">Double Pay = Base Rate × 2.0 × Double Hours</code>
          <p class="text-xs text-slate-400 mt-2">Applies to holiday shifts, weekend union contracts, or California shifts exceeding 12 hours/day.</p>
        </div>
      </div>
    `
  },

  // 4 Landmark Benchmark Scenarios (Weekly: 40 Regular Hours + 10 OT Hours at 1.5x)
  benchmarks: [
    {
      hourlyRate: 20,
      hourlyRateDisplay: "$20.00/hr",
      overtimeRateDisplay: "$30.00/hr",
      regularHours: 40,
      regularGross: 800.00,
      overtimeHours: 10,
      overtimeGross: 300.00,
      totalGross: 1100.00,
      ficaTax: 84.15, // 7.65%
      estimatedFederalWithholding: 86.40, // 2026 single standard allowance
      estimatedNetTakeHome: 929.45,
      effectiveTakeHomeRate: "84.5%"
    },
    {
      hourlyRate: 25,
      hourlyRateDisplay: "$25.00/hr",
      overtimeRateDisplay: "$37.50/hr",
      regularHours: 40,
      regularGross: 1000.00,
      overtimeHours: 10,
      overtimeGross: 375.00,
      totalGross: 1375.00,
      ficaTax: 105.19, // 7.65%
      estimatedFederalWithholding: 119.40,
      estimatedNetTakeHome: 1150.41,
      effectiveTakeHomeRate: "83.7%"
    },
    {
      hourlyRate: 35,
      hourlyRateDisplay: "$35.00/hr",
      overtimeRateDisplay: "$52.50/hr",
      regularHours: 40,
      regularGross: 1400.00,
      overtimeHours: 10,
      overtimeGross: 525.00,
      totalGross: 1925.00,
      ficaTax: 147.26, // 7.65%
      estimatedFederalWithholding: 228.60,
      estimatedNetTakeHome: 1549.14,
      effectiveTakeHomeRate: "80.5%"
    },
    {
      hourlyRate: 50,
      hourlyRateDisplay: "$50.00/hr",
      overtimeRateDisplay: "$75.00/hr",
      regularHours: 40,
      regularGross: 2000.00,
      overtimeHours: 10,
      overtimeGross: 750.00,
      totalGross: 2750.00,
      ficaTax: 210.38, // 7.65%
      estimatedFederalWithholding: 410.10,
      estimatedNetTakeHome: 2129.52,
      effectiveTakeHomeRate: "77.4%"
    }
  ],

  // Schema.org FAQPage Microdata
  faqs: [
    {
      q: "Is overtime taxed higher than regular hours in 2026?",
      a: "No. Overtime pay is not taxed at a permanently higher rate. It is combined with regular wages into your total taxable income. While payroll systems often withhold more taxes upfront due to the 22% supplemental withholding rule or annualizing algorithms, any excess tax withheld is refunded when you file your IRS tax return."
    },
    {
      q: "Can working overtime push me into a higher tax bracket and reduce my net pay?",
      a: "No. The United States uses progressive marginal tax brackets. Entering a higher bracket (e.g., from 12% to 22%) only taxes the specific dollars earned above that threshold at the higher percentage, never your entire income. Every hour of overtime worked will always increase your net take-home pay."
    },
    {
      q: "What is the flat 22% supplemental tax withholding rule?",
      a: "Under IRS Publication 15-T, employers may withhold a flat 22% for supplemental wages (including overtime paid on a separate check, bonuses, and commissions) under $1 million. This simplifies employer payroll accounting but can result in over-withholding for employees whose true effective tax rate is lower."
    }
  ]
};


// ============================================================================
// PART 2: 1099 VS. W-2 SELF-EMPLOYMENT COMPARATIVE ENGINE
// File: src/data/tenNinetyNineData.js
// Target Route: /1099-vs-w2-calculator/
// Target Queries: "1099 vs w2 calculator 2026", "self employment tax on 100k", 
//                 "1099 to w2 equivalent", "how much 1099 to equal w2"
// ============================================================================
