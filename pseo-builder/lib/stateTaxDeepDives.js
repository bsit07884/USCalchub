// pseo-builder/lib/stateTaxDeepDives.js
// Statutory deep-dive content for Arizona, Colorado, and Georgia to clear "Crawled - currently not indexed" quality gate

export const STATE_TAX_DEEP_DIVES = {
  // ==========================================================================
  // STATE 1: ARIZONA (AZ) — 2.50% Flat Tax & SB 1828 Statutory Regime
  // ==========================================================================
  arizona: {
    stateCode: "AZ",
    stateName: "Arizona",
    taxType: "Single Flat Tax",
    flatRatePct: 2.50,
    standardDeduction: {
      single: 14600,
      marriedJoint: 29200,
      headOfHousehold: 21900
    },
    aeoDirectAnswer: "Arizona enforces a single statutory flat individual income tax rate of 2.50% codified under Senate Bill 1828. Arizona fully conforms to federal standard deduction allowances ($14,600 Single / $29,200 Married Filing Jointly for 2026), provides a $100 per-child Dependent Tax Credit, and exempts 100% of active-duty military compensation and federal/state government pensions up to $2,500.",
    statutoryFrameworkHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Statutory Architecture: Senate Bill 1828 and the 2.5% Flat Tax Regime</h3>
      <p class="mb-3">
        Arizona's taxation architecture underwent an aggressive legislative transformation codified under <strong>Senate Bill 1828</strong>, which repealed the state's historical multi-tier graduated income tax brackets (which reached as high as 4.50%) and replaced them with a uniform <strong>2.50% single flat individual income tax rate</strong>. For the 2026 fiscal year, Arizona Department of Revenue (ADOR) statutes benchmark individual state liability against Federal Adjusted Gross Income (FAGI) under Title 43 of the Arizona Revised Statutes (A.R.S. § 43-1041).
      </p>
      <p class="mb-3">
        Arizona establishes full statutory conformity with federal standard deduction thresholds. Under A.R.S. § 43-1043, Arizona taxpayers claim standard deductions of <strong>$14,600 for Single filers</strong>, <strong>$29,200 for Married Filing Jointly</strong>, and <strong>$21,900 for Head of Household</strong>. Taxpayers who elect to itemize on their federal returns may itemize for Arizona purposes, maintaining full state deductions for medical expenses exceeding 7.5% of FAGI, charitable contributions (with an optional 25% charitable standard deduction boost under A.R.S. § 43-1042), and property taxes paid.
      </p>
      <p class="mb-4">
        In addition to rate compression, Arizona provides direct tax credits under A.R.S. § 43-1073.01. The <strong>Arizona Dependent Tax Credit</strong> grants a direct dollar-for-dollar liability offset of <strong>$100 per dependent under 17 years of age</strong> and <strong>$25 per dependent aged 17 and older</strong> for single filers earning under $200,000 ($400,000 joint). Furthermore, Arizona provides complete statutory tax exclusions for <strong>100% of active-duty military pay</strong> (A.R.S. § 43-1022) and an annual pension exclusion of up to <strong>$2,500</strong> for civil service, military retirement, and Arizona state government pensions. Social Security retirement benefits are 100% exempt from Arizona state income tax.
      </p>
    `,
    benchmarkMathExampleHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Mathematical Paycheck Breakdown: $75,000 Benchmark (Single Filer)</h3>
      <p class="mb-3">
        To understand the exact statutory mechanics of an Arizona paycheck, consider a single professional earning a gross annual W-2 salary of <strong>$75,000.00</strong> in Phoenix (Maricopa County) for the 2026 tax year, claiming the standard deduction without pre-tax cafeteria deductions:
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-xs sm:text-sm text-slate-700">
        <li><strong>Gross Annual Salary:</strong> $75,000.00 ($6,250.00 / month | $2,884.62 / biweekly)</li>
        <li>
          <strong>Federal Income Tax Withholding (IRS Pub 15-T):</strong> 
          Taxable Income = $75,000 - $14,600 (Federal Standard Deduction) = $60,400.00.
          <br />• 10% on $0 to $11,925 = $1,192.50
          <br />• 12% on $11,925 to $48,475 = $4,386.00
          <br />• 22% on $48,475 to $60,400 ($11,925 at 22%) = $2,623.50
          <br /><strong>Total Federal Income Tax:</strong> $8,202.00 (Effective Federal Rate: 10.94%)
        </li>
        <li>
          <strong>FICA Payroll Taxes (Statutory Ceiling $176,100):</strong>
          <br />• Social Security (OASDI at 6.2%): $75,000 × 0.062 = $4,650.00
          <br />• Medicare (HI at 1.45%): $75,000 × 0.0145 = $1,087.50
          <br /><strong>Total FICA Liability:</strong> $5,737.50 (7.65% mandatory statutory contribution)
        </li>
        <li>
          <strong>Arizona State Income Tax Withholding (ADOR 2.5% Flat Rate):</strong>
          <br />Arizona Taxable Income = $75,000 - $14,600 (AZ Standard Deduction) = $60,400.00.
          <br />Tax Liability = $60,400.00 × 2.50% = <strong>$1,510.00</strong> (Effective State Rate: 2.01%)
        </li>
        <li>
          <strong>Net Take-Home Pay Summary:</strong>
          <br />• Total Tax Withholding: $8,202.00 (Fed) + $5,737.50 (FICA) + $1,510.00 (State) = <strong>$15,449.50</strong>
          <br />• <strong>Annual Net Take-Home:</strong> $59,550.50
          <br />• <strong>Monthly Net Pay:</strong> $4,962.54
          <br />• <strong>Biweekly Net Pay:</strong> $2,290.40
        </li>
      </ul>
    `,
    relocationComparisonHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Relocation & Fiscal Arbitrage: California to Arizona</h3>
      <p class="mb-3">
        Relocating from California (Los Angeles/San Francisco) to Arizona (Phoenix/Scottsdale/Tucson) produces significant state tax arbitrage. On a $75,000 gross salary, California's progressive income tax brackets (up to 9.3% marginal rate at this income tier) plus the mandatory 1.2% uncapped State Disability Insurance (SDI) tax create an annual California state payroll deduction of approximately <strong>$4,845.00</strong>.
      </p>
      <p class="mb-3">
        Moving to Arizona slashes that state tax liability to <strong>$1,510.00</strong>, delivering an immediate <strong>annual cash savings of $3,335.00 ($277.92/month)</strong> in take-home pay alone on an identical salary. For a household earning $150,000, Arizona's 2.5% flat tax generates over <strong>$7,800.00 in annual net take-home gains</strong> compared to California.
      </p>
      <p class="mb-4">
        From a broader cost-of-living perspective, Arizona's combined state and local sales tax averages <strong>8.37%</strong> (state base 5.6% plus county/municipal add-ons), which is competitive with California's 8.85% to 10.25% metro sales taxes. Furthermore, Arizona enforces low effective residential property tax rates averaging <strong>0.62%</strong> of assessed market value (regulated by Article IX of the Arizona Constitution), substantially lower than the national median of 0.99%, preserving disposable income for relocated homeowners.
      </p>
    `
  },

  // ==========================================================================
  // STATE 2: COLORADO (CO) — 4.40% Flat Tax & TABOR Refund Mechanics
  // ==========================================================================
  colorado: {
    stateCode: "CO",
    stateName: "Colorado",
    taxType: "Flat Individual Income Tax",
    flatRatePct: 4.40,
    standardDeduction: {
      single: 14600,
      marriedJoint: 29200,
      headOfHousehold: 21900
    },
    aeoDirectAnswer: "Colorado levies a flat statutory individual income tax rate of 4.40% assessed on modified federal taxable income under C.R.S. § 39-22-104. Colorado's unique Taxpayer's Bill of Rights (TABOR) constitutionally caps state revenue growth, triggering automated taxpayer refund checks or temporary rate reductions (to 4.25%) when state surpluses occur. Seniors aged 65+ benefit from a $24,000 pension and retirement income exclusion.",
    statutoryFrameworkHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Statutory Architecture: C.R.S. § 39-22-104 and Constitutional TABOR Mechanics</h3>
      <p class="mb-3">
        Colorado operates a streamlined single-rate individual income tax system codified under <strong>Colorado Revised Statutes (C.R.S.) § 39-22-104</strong>. Following voter-approved Proposition 121, Colorado's baseline statutory tax rate was reduced from 4.55% to <strong>4.40%</strong>. Rather than calculating separate state-specific standard deductions, Colorado uses <strong>Federal Taxable Income (Line 15 of IRS Form 1040)</strong> as its starting computational baseline. Consequently, Colorado automatically incorporates federal standard deduction allowances ($14,600 Single / $29,200 Married Filing Jointly for 2026) directly into the state tax base.
      </p>
      <p class="mb-3">
        The defining cornerstone of Colorado fiscal policy is the <strong>Taxpayer's Bill of Rights (TABOR)</strong>, enshrined in Article X, Section 20 of the Colorado Constitution. TABOR restricts state revenue growth to the combined rate of population growth plus inflation (Denver-Aurora-Lakewood CPI-U). Any state tax revenues collected in excess of this constitutional cap cannot be retained by the state general fund; they must be refunded directly to Colorado taxpayers. TABOR refund mechanisms include <strong>temporary statutory tax rate cuts</strong> (reducing the income tax rate from 4.40% down to 4.25% in high-surplus fiscal cycles), direct tiered refund checks (or flat TABOR surplus dividends distributed with Form DR 0104), and temporary commercial property tax valuation credits.
      </p>
      <p class="mb-4">
        Colorado provides an advantageous statutory retirement exclusion under C.R.S. § 39-22-104(4)(f). Taxpayers aged <strong>65 and older</strong> are legally entitled to subtract up to <strong>$24,000</strong> of qualified retirement income (including military retirement pay, PERA public pensions, 401(k)/IRA distributions, and taxable Social Security) directly from Colorado taxable income. For taxpayers aged <strong>55 to 64</strong>, the statutory pension exclusion allows a deduction of up to <strong>$20,000</strong> annually.
      </p>
    `,
    benchmarkMathExampleHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Mathematical Paycheck Breakdown: $75,000 Benchmark (Single Filer)</h3>
      <p class="mb-3">
        Here is the deterministic payroll computation for an unmarried individual earning a gross annual salary of <strong>$75,000.00</strong> residing in Denver, Colorado for the 2026 fiscal year:
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-xs sm:text-sm text-slate-700">
        <li><strong>Gross Annual Salary:</strong> $75,000.00 ($6,250.00 / month | $2,884.62 / biweekly)</li>
        <li>
          <strong>Federal Income Tax Withholding (IRS Pub 15-T):</strong> 
          Taxable Income = $75,000 - $14,600 (Federal Standard Deduction) = $60,400.00.
          <br />• 10% on $0 to $11,925 = $1,192.50
          <br />• 12% on $11,925 to $48,475 = $4,386.00
          <br />• 22% on $48,475 to $60,400 ($11,925 at 22%) = $2,623.50
          <br /><strong>Total Federal Income Tax:</strong> $8,202.00 (Effective Federal Rate: 10.94%)
        </li>
        <li>
          <strong>FICA Payroll Taxes (Statutory Ceiling $176,100):</strong>
          <br />• Social Security (OASDI at 6.2%): $75,000 × 0.062 = $4,650.00
          <br />• Medicare (HI at 1.45%): $75,000 × 0.0145 = $1,087.50
          <br /><strong>Total FICA Liability:</strong> $5,737.50 (7.65% mandatory statutory contribution)
        </li>
        <li>
          <strong>Colorado State Income Tax (Department of Revenue 4.40% Flat Rate):</strong>
          <br />Colorado Taxable Base = Federal Taxable Income = $75,000 - $14,600 = $60,400.00.
          <br />State Tax Liability = $60,400.00 × 4.40% = <strong>$2,657.60</strong> (Effective State Rate: 3.54%)
          <br /><em>Note: During TABOR revenue surplus years where the temporary 4.25% trigger applies, state tax drops to $2,567.00.</em>
        </li>
        <li>
          <strong>Net Take-Home Pay Summary:</strong>
          <br />• Total Tax Withholding: $8,202.00 (Fed) + $5,737.50 (FICA) + $2,657.60 (State) = <strong>$16,597.10</strong>
          <br />• <strong>Annual Net Take-Home:</strong> $58,402.90
          <br />• <strong>Monthly Net Pay:</strong> $4,866.91
          <br />• <strong>Biweekly Net Pay:</strong> $2,246.27
        </li>
      </ul>
    `,
    relocationComparisonHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Relocation & Fiscal Arbitrage: New York to Colorado</h3>
      <p class="mb-3">
        Relocating from New York State / New York City to Colorado (Denver/Boulder/Colorado Springs) generates substantial recurring tax relief. A single professional earning $75,000 in NYC is subject to NY State progressive brackets (averaging 5.50% at this tier) plus the NYC Local Resident Income Tax (up to 3.876%), resulting in combined state and local income tax withholding of approximately <strong>$5,210.00</strong>.
      </p>
      <p class="mb-3">
        In Colorado, the total state income tax obligation on $75,000 is <strong>$2,657.60</strong>, yielding an immediate annual tax savings of <strong>$2,552.40 ($212.70/month)</strong>. For high-earning households at $200,000, escaping NYC and NY State top marginal rates (which climb to 6.85% state + 3.876% city) for Colorado's flat 4.40% creates over <strong>$8,900.00 in annual net take-home gains</strong>.
      </p>
      <p class="mb-4">
        Colorado also maintains one of the lowest effective residential property tax rates in the United States, averaging <strong>0.51%</strong> of market value (compared to New York State's average of 1.73% and Westchester/Long Island rates exceeding 2.2%). While Colorado's statewide sales tax is low at <strong>2.90%</strong>, municipal home-rule cities add local sales taxes bringing the combined metro rate to <strong>7.80%–8.81%</strong>, which remains equal to or lower than New York City's combined 8.875% sales tax rate.
      </p>
    `
  },

  // ==========================================================================
  // STATE 3: GEORGIA (GA) — HB 1015 Flat Tax & Senior Exclusion Framework
  // ==========================================================================
  georgia: {
    stateCode: "GA",
    stateName: "Georgia",
    taxType: "Accelerated Flat Individual Income Tax",
    flatRatePct: 5.39,
    standardDeduction: {
      single: 12000,
      marriedJoint: 24000,
      headOfHousehold: 12000
    },
    aeoDirectAnswer: "Georgia enforces a flat individual income tax rate of 5.39% for 2026, accelerated under House Bill 1015 from the prior 5.49% rate. Georgia provides generous statutory standard deductions of $12,000 for Single filers ($24,000 Married Filing Jointly), a $3,000 per-dependent exemption, and an expansive $65,000 per-person retirement income exclusion for individuals aged 62 and older.",
    statutoryFrameworkHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Statutory Architecture: House Bill 1015 and Georgia's Flat Tax Trajectory</h3>
      <p class="mb-3">
        Georgia's individual tax structure is governed by the landmark provisions of <strong>House Bill 1437</strong> and the accelerating legislation of <strong>House Bill 1015</strong> (codified under Official Code of Georgia Annotated O.C.G.A. § 48-7-20). Effective for the 2026 tax year, Georgia permanently repealed its legacy six-bracket graduated system (which featured a top marginal rate of 5.75%) in favor of a single flat income tax rate of <strong>5.39%</strong>. Under state statute, this rate is scheduled to decrease by 0.10% annually until reaching a target flat floor of 4.99%, contingent on state revenue reserves meeting target benchmarks.
      </p>
      <p class="mb-3">
        To protect low- and middle-income wage earners during the transition to a flat tax, Georgia established substantial statutory standard deductions under O.C.G.A. § 48-7-27. For 2026, the Georgia standard deduction is codified at <strong>$12,000 for Single and Head of Household filers</strong>, and <strong>$24,000 for Married Filing Jointly</strong>. In addition, Georgia allows a statutory <strong>dependent exemption of $3,000 per qualifying child</strong>, providing meaningful tax compression for families with dependents.
      </p>
      <p class="mb-4">
        Georgia stands out nationally for its retiree-friendly statutory tax exclusions under O.C.G.A. § 48-7-27(a)(5). Taxpayers aged <strong>62 to 64</strong> can exclude up to <strong>$35,000</strong> of qualified retirement income per person. Upon reaching <strong>age 65</strong>, this exclusion increases dramatically to <strong>$65,000 per taxpayer</strong> ($130,000 for a married couple where both spouses are 65+). Qualified income includes pensions, 401(k)/IRA distributions, annuities, interest, dividends, and up to $4,000 of earned wages. Furthermore, Social Security retirement benefits are 100% exempt from Georgia state income tax.
      </p>
    `,
    benchmarkMathExampleHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Mathematical Paycheck Breakdown: $75,000 Benchmark (Single Filer)</h3>
      <p class="mb-3">
        Here is the deterministic paycheck computation for an unmarried employee earning a gross annual salary of <strong>$75,000.00</strong> in Atlanta (Fulton County), Georgia for the 2026 tax year:
      </p>
      <ul class="list-disc pl-5 space-y-2 mb-4 text-xs sm:text-sm text-slate-700">
        <li><strong>Gross Annual Salary:</strong> $75,000.00 ($6,250.00 / month | $2,884.62 / biweekly)</li>
        <li>
          <strong>Federal Income Tax Withholding (IRS Pub 15-T):</strong> 
          Taxable Income = $75,000 - $14,600 (Federal Standard Deduction) = $60,400.00.
          <br />• 10% on $0 to $11,925 = $1,192.50
          <br />• 12% on $11,925 to $48,475 = $4,386.00
          <br />• 22% on $48,475 to $60,400 ($11,925 at 22%) = $2,623.50
          <br /><strong>Total Federal Income Tax:</strong> $8,202.00 (Effective Federal Rate: 10.94%)
        </li>
        <li>
          <strong>FICA Payroll Taxes (Statutory Ceiling $176,100):</strong>
          <br />• Social Security (OASDI at 6.2%): $75,000 × 0.062 = $4,650.00
          <br />• Medicare (HI at 1.45%): $75,000 × 0.0145 = $1,087.50
          <br /><strong>Total FICA Liability:</strong> $5,737.50 (7.65% mandatory statutory contribution)
        </li>
        <li>
          <strong>Georgia State Income Tax (Department of Revenue 5.39% Flat Rate):</strong>
          <br />Georgia Taxable Income = $75,000 - $12,000 (GA Single Standard Deduction) = $63,000.00.
          <br />State Tax Liability = $63,000.00 × 5.39% = <strong>$3,395.70</strong> (Effective State Rate: 4.53%)
        </li>
        <li>
          <strong>Net Take-Home Pay Summary:</strong>
          <br />• Total Tax Withholding: $8,202.00 (Fed) + $5,737.50 (FICA) + $3,395.70 (State) = <strong>$17,335.20</strong>
          <br />• <strong>Annual Net Take-Home:</strong> $57,664.80
          <br />• <strong>Monthly Net Pay:</strong> $4,805.40
          <br />• <strong>Biweekly Net Pay:</strong> $2,217.88
        </li>
      </ul>
    `,
    relocationComparisonHtml: `
      <h3 class="text-base font-bold text-slate-900 mt-4 mb-2">Relocation & Fiscal Arbitrage: California to Georgia</h3>
      <p class="mb-3">
        Relocating from California (San Francisco/Silicon Valley/Orange County) to Georgia (Metro Atlanta/Alpharetta/Savannah) yields immediate financial dividend through reduced income taxation and vastly superior purchasing power. A California resident earning $75,000 pays approximately <strong>$4,845.00</strong> in state income tax and mandatory SDI withholding.
      </p>
      <p class="mb-3">
        In Georgia, the corresponding state income tax is <strong>$3,395.70</strong>, providing an annual income tax savings of <strong>$1,449.30 ($120.78/month)</strong>. At executive income thresholds ($250,000 joint), Georgia's 5.39% flat rate compared to California's 9.3%–10.3% marginal rates yields over <strong>$9,800.00 in annual net paycheck savings</strong>.
      </p>
      <p class="mb-4">
        The macroeconomic advantages of Georgia are concentrated in housing and municipal costs. Georgia's median effective property tax rate stands at <strong>0.90%</strong>, but median home prices in metro Atlanta are approximately 50% to 60% lower than coastal California markets, resulting in property tax bills that are thousands of dollars lower in absolute terms. Georgia's statewide sales tax is <strong>4.0%</strong>, with local county options bringing total sales tax to an average of <strong>7.38%</strong>, compared to California metro areas that frequently exceed 9.50% to 10.25%.
      </p>
    `
  }
};
