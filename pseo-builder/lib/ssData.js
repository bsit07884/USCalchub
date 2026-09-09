/**
 * lib/ssData.js
 * USCalcHub — Social Security State Taxation Data (Phase 1 & Phase 2)
 *
 * SOURCES:
 * - Group A (8 Taxing States): Cross-verified against state Dept. of Revenue
 *   statutes (e.g. CO SB25-136, MN Dept of Revenue, CT DRS, UT STC) as of Sept 2026.
 * - Group B (10 Non-Taxing States Phase 2): Verified against official state
 *   Departments of Revenue:
 *   - Florida: FL Constitution Art. VII, § 5 (no state income tax).
 *   - Texas: TX Constitution Art. VIII, § 24-a (no state income tax).
 *   - California: CA Franchise Tax Board Form 540 / Schedule CA (540).
 *   - New York: NY Dept. of Taxation and Finance, Pub 36 & Form IT-201-I,
 *     NY Tax Law § 612(c)(3-a) ($20,000 pension/annuity exclusion for age 59½+).
 *   - Pennsylvania: PA Dept. of Revenue Brochure REV-612 & PA PIT Guide,
 *     72 P.S. § 7301(d)(iii) and 61 Pa. Code § 101.6(c)(8) (exemption of eligible
 *     retirement distributions from 401(k), IRA, and pensions for age 60+).
 *   - Ohio: Ohio Dept. of Taxation, IT 1040 Schedule of Adjustments & R.C. 5747.01.
 *   - Illinois: Illinois Dept. of Revenue, 35 ILCS 5/203 & Schedule M.
 *   - Georgia: Georgia Dept. of Revenue Form 500 Instructions &
 *     O.C.G.A. § 48-7-27(a)(5) ($35k exclusion ages 62-64, $65k exclusion age 65+).
 *   - North Carolina: NC Dept. of Revenue, Form D-400 Schedule S & G.S. 105-153.5.
 *   - Arizona: Arizona Dept. of Revenue, Form 140 & A.R.S. § 43-1022.
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
// GROUP B: TOP 10 NON-TAXING STATES (Phase 2)
// Differentiated by overall retirement tax picture (income tax & property tax)
// ---------------------------------------------------------------------------
export const SS_NON_TAXING_STATES = [
  {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    taxesSS: false,
    ruleType: "no-income-tax",
    topRate: 0.0,
    incomeTaxType: "none",
    incomeTaxDesc: "0.00% — No state personal income tax on any income",
    propertyTaxEffectiveRate: 0.0078,
    propertyTaxPct: "0.78%",
    propertyTaxNote: "Moderate (0.78% effective rate — below national median)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/florida/",
    story: "The cleanest 'no state tax anywhere' story. Florida levies zero personal income tax on Social Security, pensions, 401(k)/IRA distributions, or wages. Coupled with a moderate 0.78% effective property tax rate, retirees keep more of their fixed income.",
    summary: "Florida does not tax Social Security benefits at the state level. In fact, Florida has no personal income tax at all under Article VII, Section 5 of the Florida Constitution. Retirement income from all sources—including traditional 401(k) and IRA withdrawals, private pensions, government pensions, and investment earnings—is completely free from state income tax. Homeowners face a moderate effective property tax rate of 0.78%, and permanent residents can shield up to $50,000 of home value through Florida's Homestead Exemption.",
    aeoDirectAnswer: "Social Security retirement benefits are 100% tax-free at the state level in Florida. Florida has no state personal income tax on any retirement income, pensions, or withdrawals, paired with a moderate 0.78% effective property tax rate.",
    otherRetirementTaxDesc: "0% on pensions, 401(k), IRA distributions, and investment income.",
    propertyTaxDesc: "0.78% effective rate — moderate, with up to $50k Homestead Exemption for primary residents.",
    takeaway: "Cleanest no-state-tax environment: 0% income tax across all retirement streams.",
    faqs: [
      {
        q: "Is Social Security taxed in Florida?",
        a: "No. Florida does not tax Social Security benefits. Florida has no state personal income tax, so all Social Security payments are 100% exempt from state taxes."
      },
      {
        q: "Are pensions and 401(k) withdrawals taxed in Florida?",
        a: "No. Florida levies zero state income tax on private pensions, public pensions, 401(k) withdrawals, traditional IRA distributions, or capital gains."
      },
      {
        q: "How high are property taxes for retirees in Florida?",
        a: "Florida's statewide effective property tax rate is approximately 0.78%, which is below the national average. Florida also offers a Homestead Exemption shielding up to $50,000 of assessed home value for permanent primary residents."
      }
    ]
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    taxesSS: false,
    ruleType: "no-income-tax",
    topRate: 0.0,
    incomeTaxType: "none",
    incomeTaxDesc: "0.00% — No state personal income tax on any income",
    propertyTaxEffectiveRate: 0.0140,
    propertyTaxPct: "1.40%",
    propertyTaxNote: "High (1.40% effective rate — one of the higher rates in the nation)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/texas/",
    story: "No state income tax on Social Security or retirement withdrawals, but property tax is 1.40% (one of the higher rates in the country). 'No SS tax, but don't assume zero property tax' — retirees who own homes face higher local property tax bills.",
    summary: "Texas does not tax Social Security benefits at the state level. Under the Texas Constitution (Article VIII, Section 24-a), the state bans personal income tax, meaning Social Security, pensions, 401(k) distributions, and IRAs are 100% state income tax-free. However, Texas funds public services largely through property taxes, resulting in an effective rate of 1.40%—among the higher rates in the US. Texas offers significant property tax relief for seniors, including an over-65 school tax ceiling (freeze) and additional residence homestead exemptions.",
    aeoDirectAnswer: "Social Security retirement benefits are 100% exempt from Texas state income tax. Texas has zero state personal income tax on all retirement income, though homeowners pay an effective property tax rate of 1.40% (offset by senior homestead exemptions).",
    otherRetirementTaxDesc: "0% on pensions, 401(k) withdrawals, IRAs, and investment income.",
    propertyTaxDesc: "1.40% effective rate — higher than average, but Texas provides an over-65 school tax freeze.",
    takeaway: "Zero income tax on benefits, but factor in higher property taxes when planning retirement housing.",
    faqs: [
      {
        q: "Is Social Security taxed in Texas?",
        a: "No. Texas does not tax Social Security benefits. Under the Texas Constitution, the state imposes zero personal income tax on Social Security or any other income."
      },
      {
        q: "Does Texas tax other retirement income like 401(k) or pensions?",
        a: "No. All forms of retirement income—including 401(k) withdrawals, traditional IRA distributions, private pensions, and government annuities—are free from Texas state income tax."
      },
      {
        q: "Do seniors get property tax relief in Texas?",
        a: "Yes. Texas homeowners aged 65 and older receive an additional $10,000 homestead exemption on school district taxes and can 'freeze' their school property tax amount so it never increases above the ceiling established in their 65th year."
      }
    ]
  },
  {
    slug: "california",
    name: "California",
    abbr: "CA",
    taxesSS: false,
    ruleType: "exempt-ss-progressive-other",
    topRate: 0.133,
    incomeTaxType: "progressive",
    incomeTaxDesc: "Progressive up to 13.3% on other retirement income (401k, pensions, investments)",
    propertyTaxEffectiveRate: 0.0070,
    propertyTaxPct: "0.70%",
    propertyTaxNote: "Moderate (0.70% effective rate under Proposition 13)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/california/",
    story: "California does NOT tax Social Security specifically, but has a progressive income tax up to 13.3% on OTHER retirement income (pensions, 401(k) withdrawals, investment gains) — a crucial nuance retirees must know.",
    summary: "California does not tax Social Security benefits at the state level—benefits are fully deductible on California Form 540 (Schedule CA 540). However, California maintains the highest top marginal income tax rate in the country (up to 13.3%, or 14.4% including Mental Health Services tax on income over $1M) on OTHER retirement income. Traditional 401(k) distributions, traditional IRA withdrawals, corporate pensions, and capital gains are fully taxed as ordinary income at progressive state rates. On the real estate front, Proposition 13 limits base property tax increases to 2% annually, keeping the statewide effective property tax rate at 0.70%.",
    aeoDirectAnswer: "Social Security benefits are completely exempt from California state income tax. However, California taxes other retirement income—including 401(k) withdrawals, pensions, and investments—at progressive state rates reaching up to 13.3%, while property tax averages 0.70% under Prop 13.",
    otherRetirementTaxDesc: "Taxed as ordinary income at progressive rates from 1% up to 13.3%.",
    propertyTaxDesc: "0.70% effective rate — protected by Prop 13, which caps annual assessed value increases at 2%.",
    takeaway: "SS is 100% safe, but diversified retirement portfolios face top-tier state income tax brackets.",
    faqs: [
      {
        q: "Is Social Security taxed in California?",
        a: "No. California completely exempts Social Security retirement, disability, and survivor benefits from state income tax. You subtract federal taxable benefits on California Schedule CA (540)."
      },
      {
        q: "Does California tax 401(k) and pension income?",
        a: "Yes. While Social Security is exempt, California taxes distributions from traditional 401(k)s, traditional IRAs, and private pensions as regular taxable income at rates from 1% up to 13.3%."
      },
      {
        q: "How does California Proposition 13 help retirees with property taxes?",
        a: "Proposition 13 caps property tax at 1% of assessed value at purchase and limits annual inflation increases to a maximum of 2% per year. This keeps long-time homeowner property tax bills modest (averaging 0.70% effective rate statewide)."
      }
    ]
  },
  {
    slug: "new-york",
    name: "New York",
    abbr: "NY",
    taxesSS: false,
    ruleType: "exempt-ss-progressive-other",
    topRate: 0.109,
    incomeTaxType: "progressive",
    incomeTaxDesc: "Progressive up to 10.9% on other income (with $20,000 pension exclusion for ages 59½+)",
    propertyTaxEffectiveRate: 0.0130,
    propertyTaxPct: "1.30%",
    propertyTaxNote: "Higher than average (1.30% effective rate, plus local city taxes if in NYC)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/new-york/",
    story: "Social Security itself is completely exempt from NY state tax, but a progressive tax up to 10.9% applies to other retirement income (with a $20,000 pension/annuity exclusion for filers 59½+ under NY Tax Law § 612(c)(3-a)); property tax is 1.30%.",
    summary: "New York State completely exempts Social Security benefits from state and local income tax (deducted on Form IT-201). However, other retirement income is subject to New York's progressive tax brackets ranging from 4% to 10.9% (plus up to 3.876% in New York City local tax). Under official New York Tax Law § 612(c)(3-a) and Dept. of Taxation and Finance Publication 36, qualifying filers aged 59½ and older can exclude up to $20,000 per year of pension and annuity distributions from traditional retirement plans. New York property taxes average an effective 1.30%, though the School Tax Relief (STAR) program provides partial school property tax relief.",
    aeoDirectAnswer: "Social Security is 100% exempt from New York State income tax. Other retirement income is taxed at progressive rates up to 10.9%, though retirees age 59½+ can exclude up to $20,000 in qualifying pension/annuity income under NY Tax Law § 612(c)(3-a). Property tax averages 1.30%.",
    otherRetirementTaxDesc: "Progressive rates up to 10.9%, with an official $20,000 exclusion for qualifying pensions at 59½+.",
    propertyTaxDesc: "1.30% effective rate — mitigated by New York's Basic and Enhanced STAR property tax relief.",
    takeaway: "SS is exempt, and $20k pension subtraction cushions middle earners, but overall tax burden remains high.",
    faqs: [
      {
        q: "Is Social Security taxed in New York State?",
        a: "No. New York State and New York City do not tax Social Security retirement benefits. You subtract federal taxable Social Security benefits on Form IT-201 Line 27."
      },
      {
        q: "What is New York's $20,000 pension exclusion for retirees?",
        a: "Under official NY Tax Law § 612(c)(3-a) and NY Dept. of Taxation & Finance Publication 36, individuals aged 59½ or older can exclude up to $20,000 of qualifying pension and annuity income (including 401(k) and IRA distributions) from state taxable income each year."
      },
      {
        q: "Do New York City residents pay local tax on Social Security?",
        a: "No. New York City adheres to New York State's tax treatment of Social Security, meaning NYC residents pay $0 city income tax on their Social Security benefits."
      }
    ]
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbr: "PA",
    taxesSS: false,
    ruleType: "exempt-ss-pension-flat-other",
    topRate: 0.0307,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 3.07% on earned wages; Social Security & eligible retirement plans are fully exempt",
    propertyTaxEffectiveRate: 0.0126,
    propertyTaxPct: "1.26%",
    propertyTaxNote: "Moderate (1.26% effective rate statewide)",
    hasSalaryPage: false,
    salaryPageUrl: null,
    story: "Flat 3.07% on earned income (one of the lowest flat rates), but Pennsylvania completely exempts Social Security, pensions, and 401(k) distributions for eligible retirees (ages 60+) under 72 P.S. § 7301(d)(iii). Note Philadelphia local wage taxes if working part-time.",
    summary: "Pennsylvania is one of the most tax-lenient states for retirees. Pennsylvania does not tax Social Security benefits. Furthermore, under official Pennsylvania Department of Revenue guidance (Brochure REV-612 and 72 P.S. § 7301(d)(iii)), payments from eligible retirement benefit plans—including employer pensions, 401(k)s, and traditional IRAs—are 100% exempt from state income tax when received after reaching retirement age (age 60 or older). If a retiree continues to earn W-2 wages, Pennsylvania taxes that earned income at a flat 3.07%. Working retirees in Philadelphia should also account for the city's local wage tax (~3.75%). Property tax averages 1.26% statewide.",
    aeoDirectAnswer: "Social Security benefits are 100% exempt from Pennsylvania state income tax. Pennsylvania also exempts qualifying employer pensions and 401(k) distributions for retirees age 60+, while any non-exempt earned wages are taxed at a low flat 3.07%. Property tax averages 1.26%.",
    otherRetirementTaxDesc: "0% on qualifying 401(k), IRA, and pension payouts for filers 60+; flat 3.07% on earned wages.",
    propertyTaxDesc: "1.26% effective rate — with senior property tax rebate programs available for lower-income seniors.",
    takeaway: "One of the best retirement tax shelters in the nation for pensions and 401(k)s, despite local wage taxes.",
    faqs: [
      {
        q: "Is Social Security taxed in Pennsylvania?",
        a: "No. Pennsylvania does not tax Social Security retirement, disability, or survivor benefits. Benefits are completely excluded from Pennsylvania personal income tax."
      },
      {
        q: "Does Pennsylvania tax pensions and 401(k) distributions?",
        a: "No, in most cases. Under PA Department of Revenue REV-612 and 72 P.S. § 7301(d)(iii), distributions from qualified employer retirement plans, 401(k)s, and IRAs are 100% tax-exempt once you reach retirement age (age 60 or employer plan age)."
      },
      {
        q: "What taxes do retirees in Pennsylvania still have to pay?",
        a: "Retirees still pay property taxes (averaging 1.26%), sales tax on non-exempt purchases (6% statewide, 7% in Allegheny County, 8% in Philadelphia), and flat 3.07% income tax on any part-time earned wages or non-retirement investment income."
      }
    ]
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbr: "OH",
    taxesSS: false,
    ruleType: "exempt-ss-flat-other",
    topRate: 0.0275,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 2.75% on other taxable income above $26,050 (0% below $26,050)",
    propertyTaxEffectiveRate: 0.0136,
    propertyTaxPct: "1.36%",
    propertyTaxNote: "Moderate-high (1.36% effective rate statewide)",
    hasSalaryPage: false,
    salaryPageUrl: null,
    story: "Ohio does not tax Social Security. It taxes other retirement income at rates up to 2.75% (0% below $26,050), alongside an effective property tax rate of 1.36%. Ohio offers retirement income credits up to $200 and a senior citizen credit.",
    summary: "Ohio does not tax Social Security benefits at the state level (deducted on Ohio Schedule of Adjustments). Beginning in 2026, Ohio simplified its income tax structure to a flat 2.75% rate on taxable income exceeding $26,050, with a 0% rate on income below that threshold. Ohio offers qualifying retirees a Retirement Income Credit of up to $200 (for modified AGI under $100,000) and a $50 Senior Citizen Credit. However, retirees should note that many Ohio municipalities and school districts levy local income taxes (averaging ~1.2%), and property taxes average 1.36% statewide.",
    aeoDirectAnswer: "Social Security is 100% exempt from Ohio state income tax. Ohio taxes other retirement income at a flat 2.75% on income over $26,050 (0% below), offers small retirement credits, and carries an effective property tax rate of 1.36% plus municipal add-ons.",
    otherRetirementTaxDesc: "Flat 2.75% on income over $26,050; retirement income credits up to $200 available.",
    propertyTaxDesc: "1.36% effective rate — Ohio provides a Homestead Exemption for low-to-moderate-income seniors.",
    takeaway: "Low 2.75% flat rate and $0 SS tax, but watch out for local municipal income taxes (RITA) and property levies.",
    faqs: [
      {
        q: "Is Social Security taxed in Ohio?",
        a: "No. Ohio state law completely exempts Social Security benefits from state income tax. You deduct federal taxable Social Security on the Ohio Schedule of Adjustments."
      },
      {
        q: "What state income tax rate applies to 401(k) and pensions in Ohio?",
        a: "Ohio taxes taxable retirement distributions at 0% on the first $26,050 of income and a flat 2.75% on income above that threshold. Filers with income under $100,000 may also claim Ohio's retirement income credit."
      },
      {
        q: "Do Ohio municipalities tax Social Security or pensions?",
        a: "No. Ohio municipal income taxes (including RITA) apply only to earned wages and business profits, not to Social Security benefits or qualifying pension and 401(k) distributions."
      }
    ]
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbr: "IL",
    taxesSS: false,
    ruleType: "exempt-ss-pension-high-property",
    topRate: 0.0495,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 4.95% on earned income, but SS, qualified pensions & 401(k)s are exempt",
    propertyTaxEffectiveRate: 0.0188,
    propertyTaxPct: "1.88%",
    propertyTaxNote: "Highest in this group (1.88% effective rate — 2nd highest in the entire nation)",
    hasSalaryPage: false,
    salaryPageUrl: null,
    story: "Flat 4.95% on other income (SS and qualified pensions are exempt), but Illinois has the highest property tax of this group at 1.88% (second-highest in the nation). 'SS is safe, but Illinois isn't a low-tax state overall'.",
    summary: "Illinois does not tax Social Security benefits at the state level. Under Illinois Compiled Statutes (35 ILCS 5/203), Illinois exempts almost all qualified retirement income—including Social Security, traditional pensions, 401(k) distributions, and IRAs—from its flat 4.95% individual income tax. However, Illinois homeowners face the highest property tax burden of any state in this group: an effective property tax rate of 1.88%, ranking second-highest nationally behind New Jersey. While your retirement checks are shielded from state income tax, substantial residential property taxes make Illinois a high-tax state for retiree homeowners overall.",
    aeoDirectAnswer: "Social Security is 100% tax-free in Illinois, and the state exempts most pensions and 401(k) withdrawals from its 4.95% flat income tax. However, Illinois carries the highest property tax in this group at 1.88% (second-highest in the US), significantly impacting homeowners.",
    otherRetirementTaxDesc: "0% on qualifying employer pensions, 401(k)s, and IRAs; flat 4.95% on non-exempt earned wages.",
    propertyTaxDesc: "1.88% effective rate — second-highest in the country, though seniors can claim Senior Homestead exemptions.",
    takeaway: "Zero income tax on benefits and pensions, but steep property taxes make housing costs unusually high.",
    faqs: [
      {
        q: "Is Social Security taxed in Illinois?",
        a: "No. Illinois does not tax Social Security benefits. You subtract all federally taxable Social Security on Illinois Schedule M."
      },
      {
        q: "Does Illinois tax pensions and 401(k) withdrawals?",
        a: "No. Illinois is one of the few states that exempts all qualified employee retirement plans, including traditional pensions, 401(k)s, 403(b)s, and traditional IRAs, from state income tax."
      },
      {
        q: "Why is Illinois considered expensive for retirees if retirement income is exempt?",
        a: "Because Illinois has the second-highest property tax rate in the nation (1.88% effective rate), along with high combined state and local sales taxes (averaging ~8.98%). This shifts the tax burden heavily onto housing and consumer purchases."
      }
    ]
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    taxesSS: false,
    ruleType: "exempt-ss-flat-other",
    topRate: 0.0519,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 5.19% on other income, with generous $35k (ages 62–64) or $65k (age 65+) exclusion",
    propertyTaxEffectiveRate: 0.0079,
    propertyTaxPct: "0.79%",
    propertyTaxNote: "Moderate (0.79% effective rate statewide)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/georgia/",
    story: "Georgia does not tax Social Security. Other retirement income is taxed at a flat 5.19%, but Georgia provides a generous retirement income exclusion ($35k for ages 62–64, $65k for 65+ under O.C.G.A. § 48-7-27(a)(5)); property tax is a reasonable 0.79%.",
    summary: "Georgia completely exempts Social Security benefits from state income tax. For other retirement income (pensions, annuities, 401(k) withdrawals, interest, and dividends), Georgia applies a flat 5.19% income tax rate. However, under official Georgia Department of Revenue guidance (Form 500 Schedule 1 and O.C.G.A. § 48-7-27(a)(5)), Georgia provides an exceptionally generous retirement income exclusion: filers aged 62 to 64 can exclude up to $35,000 of retirement income, while filers aged 65 and older can exclude up to $65,000 per person ($130,000 for a married couple filing jointly). Homeowners benefit from a moderate 0.79% effective property tax rate and senior homestead tax exemptions.",
    aeoDirectAnswer: "Social Security is 100% exempt from Georgia state income tax. Other retirement income is taxed at a flat 5.19%, but retirees benefit from an official exclusion of up to $35,000 (ages 62–64) or $65,000 (age 65+) under O.C.G.A. § 48-7-27(a)(5). Property tax averages 0.79%.",
    otherRetirementTaxDesc: "Flat 5.19%, but up to $65,000 per person is 100% excluded from state tax for filers age 65+.",
    propertyTaxDesc: "0.79% effective rate — moderate, with county-level senior school tax exemptions in many jurisdictions.",
    takeaway: "Highly attractive retirement hub: $65k exclusion per person shields most retiree income outside of SS.",
    faqs: [
      {
        q: "Is Social Security taxed in Georgia?",
        a: "No. Georgia does not tax Social Security benefits at the state level. You deduct federally taxable Social Security on Georgia Form 500 Schedule 1."
      },
      {
        q: "What is the Georgia Retirement Income Exclusion for 2026?",
        a: "Under O.C.G.A. § 48-7-27(a)(5), taxpayers aged 62 to 64 can exclude up to $35,000 of retirement income from Georgia state tax. Taxpayers aged 65 and older can exclude up to $65,000 per taxpayer ($130,000 for married couples filing jointly)."
      },
      {
        q: "How high are property taxes in Georgia for seniors?",
        a: "Georgia's statewide effective property tax rate is 0.79%. In addition, many Georgia counties provide partial or complete exemptions from school district property taxes for homeowners aged 62 or 65 and older."
      }
    ]
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    taxesSS: false,
    ruleType: "exempt-ss-flat-other",
    topRate: 0.0399,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 3.99% on other taxable income (pensions, 401k withdrawals)",
    propertyTaxEffectiveRate: 0.0066,
    propertyTaxPct: "0.66%",
    propertyTaxNote: "Low (0.66% effective rate — well below national average)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/north-carolina/",
    story: "Flat 3.99% on other income, paired with a very LOW property tax rate of 0.66% (well below national median). Favorable overall retirement picture with zero tax on Social Security.",
    summary: "North Carolina does not tax Social Security benefits at the state level (deducted on Form D-400 Schedule S). As of 2026, North Carolina enacted a simplified flat personal income tax rate of 3.99% across all taxable income, down from prior years. While North Carolina taxes private pensions, 401(k) distributions, and IRAs at this 3.99% flat rate, the state offsets this with a very low effective property tax rate of 0.66%—one of the lowest in the eastern United States. Qualifying low-income seniors aged 65+ can also claim the Elderly or Disabled Property Tax Homestead Exclusion.",
    aeoDirectAnswer: "Social Security is 100% tax-free in North Carolina. The state taxes other retirement income at a modest flat rate of 3.99%, while offering a very low 0.66% effective property tax rate, creating an advantageous overall retirement environment.",
    otherRetirementTaxDesc: "Flat 3.99% on 401(k), IRA, and private pension distributions.",
    propertyTaxDesc: "0.66% effective rate — well below national average, with homestead exclusions for qualifying seniors.",
    takeaway: "Low 3.99% flat tax on pensions combined with a 0.66% property rate provides excellent cost predictability.",
    faqs: [
      {
        q: "Is Social Security taxed in North Carolina?",
        a: "No. North Carolina does not levy state income tax on Social Security benefits. You deduct your federal taxable benefits on Form D-400 Schedule S."
      },
      {
        q: "What tax rate does North Carolina charge on pensions and 401(k)s?",
        a: "North Carolina applies a flat income tax rate of 3.99% on taxable pension distributions, 401(k) withdrawals, and traditional IRAs."
      },
      {
        q: "Do seniors get property tax relief in North Carolina?",
        a: "Yes. North Carolina offers the Elderly/Disabled Exclusion, which excludes either $25,000 or 50% of the appraised value of a permanent residence (whichever is greater) for qualifying homeowners aged 65+ who meet income requirements."
      }
    ]
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbr: "AZ",
    taxesSS: false,
    ruleType: "exempt-ss-low-flat-other",
    topRate: 0.025,
    incomeTaxType: "flat",
    incomeTaxDesc: "Flat 2.50% on other income — tied for lowest top rate nationally",
    propertyTaxEffectiveRate: 0.0048,
    propertyTaxPct: "0.48%",
    propertyTaxNote: "Lowest in this group (0.48% effective rate — among lowest in the country)",
    hasSalaryPage: true,
    salaryPageUrl: "/salary-calculator/arizona/",
    story: "Flat 2.50% income tax (tied for lowest in the country) and property tax at 0.48% (lowest of this entire group). Genuinely one of the most retirement-tax-friendly states overall in the US, not just for Social Security.",
    summary: "Arizona is widely recognized as one of the most retirement-tax-friendly states in the United States. Arizona completely exempts Social Security benefits from state income tax (subtracted on Arizona Form 140). For other retirement income (pensions, 401(k)s, and traditional IRAs), Arizona levies a flat 2.50% tax rate—tied for the lowest individual income tax rate in the country among states that levy one. In addition, Arizona allows up to a $2,500 exclusion for military and federal/civil service pensions. Arizona also boasts the lowest effective property tax rate of this entire group at just 0.48%, keeping fixed living costs exceptionally low for retiree homeowners.",
    aeoDirectAnswer: "Social Security is 100% tax-exempt in Arizona. Combined with a flat 2.50% income tax on other income (tied for lowest in the nation) and a rock-bottom 0.48% effective property tax rate, Arizona is one of America's premier low-tax retirement states.",
    otherRetirementTaxDesc: "Flat 2.50% on pensions, 401(k)s, and IRAs (with $2,500 exemption for military/government pensions).",
    propertyTaxDesc: "0.48% effective rate — lowest of all 10 states in this group and among the lowest in the nation.",
    takeaway: "Unrivaled retirement tax appeal: 0% SS tax, 2.50% flat income tax, and 0.48% property tax.",
    faqs: [
      {
        q: "Is Social Security taxed in Arizona?",
        a: "No. Arizona does not tax Social Security retirement, disability, or survivor benefits. Benefits are fully subtracted on Arizona Form 140."
      },
      {
        q: "How does Arizona tax pensions and 401(k) withdrawals?",
        a: "Arizona taxes private pensions, traditional IRAs, and 401(k) withdrawals at a flat rate of 2.50%. Up to $2,500 of military or civil service pension income can be exempted per year."
      },
      {
        q: "Why are Arizona property taxes so low for retirees?",
        a: "Arizona's statewide effective property tax rate is just 0.48%, thanks to statutory limits on assessed valuation growth. Additionally, Arizona's Senior Property Valuation Protection Program allows qualifying homeowners 65+ to freeze their property valuation."
      }
    ]
  }
];

export const SS_NON_TAXING_STATES_PHASE2 = SS_NON_TAXING_STATES.map((s) => s.slug);

export function getStateSSInfo(slug) {
  const taxing = SS_TAXING_STATES.find((s) => s.slug === slug);
  if (taxing) return taxing;
  const nonTaxing = SS_NON_TAXING_STATES.find((s) => s.slug === slug);
  if (nonTaxing) return nonTaxing;
  return null;
}

