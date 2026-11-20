// pages/1099-vs-w2-calculator/index.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { TEN_NINETY_NINE_CALCULATOR_DATA } from '../../lib/tenNinetyNineData';

export async function getStaticProps() {
  return {
    props: {
      data: TEN_NINETY_NINE_CALCULATOR_DATA
    }
  };
}

export default function TenNinetyNineCalculatorPage({ data }) {
  const { meta, aeoDirectAnswer, engineParameters, editorialSections, comparativeScenarios, faqs } = data;

  const [w2Salary, setW2Salary] = useState(100000);
  const [tenNinetyNineGross, setTenNinetyNineGross] = useState(130000);
  const [expensePct, setExpensePct] = useState(15);
  const [benefitsPct, setBenefitsPct] = useState(20);

  const w2Num = Math.max(0, parseFloat(w2Salary) || 0);
  const tnnNum = Math.max(0, parseFloat(tenNinetyNineGross) || 0);
  const expPctNum = Math.max(0, Math.min(60, parseFloat(expensePct) || 0));
  const benPctNum = Math.max(0, Math.min(50, parseFloat(benefitsPct) || 0));

  // Helper: 2026 Federal Progressive Income Tax Brackets (Single filer, standard deduction $14,600)
  const calcFederalTax = (taxableIncome) => {
    if (taxableIncome <= 0) return 0;
    let tax = 0;
    const brackets = [
      { cap: 11925, rate: 0.10 },
      { cap: 48475, rate: 0.12 },
      { cap: 103350, rate: 0.22 },
      { cap: 197300, rate: 0.24 },
      { cap: 250525, rate: 0.32 },
      { cap: 626350, rate: 0.35 },
      { cap: Infinity, rate: 0.37 }
    ];
    let prevCap = 0;
    for (const b of brackets) {
      if (taxableIncome > prevCap) {
        const taxableChunk = Math.min(taxableIncome - prevCap, b.cap - prevCap);
        tax += taxableChunk * b.rate;
        prevCap = b.cap;
      } else {
        break;
      }
    }
    return tax;
  };

  // --- W-2 Calculations ---
  // FICA: 6.2% SS up to $176,100 + 1.45% Medicare uncapped
  const w2SsTax = Math.min(w2Num, 176100) * 0.062;
  const w2MedTax = w2Num * 0.0145;
  const w2FicaTax = Math.round((w2SsTax + w2MedTax) * 100) / 100;

  const w2Taxable = Math.max(0, w2Num - 14600);
  const w2FedTax = Math.round(calcFederalTax(w2Taxable) * 100) / 100;
  const w2NetTakeHome = Math.max(0, Math.round((w2Num - w2FicaTax - w2FedTax) * 100) / 100);
  const w2BenefitsValue = Math.round((w2Num * (benPctNum / 100)) * 100) / 100;
  const w2TotalValue = w2NetTakeHome + w2BenefitsValue;

  // --- 1099 Calculations ---
  const expensesAmount = Math.round((tnnNum * (expPctNum / 100)) * 100) / 100;
  const netBusinessProfit = Math.max(0, tnnNum - expensesAmount);

  // Schedule SE net earnings (92.35%)
  const seNetEarnings = netBusinessProfit * 0.9235;
  const secaSsTax = Math.min(seNetEarnings, 176100) * 0.124;
  const secaMedTax = seNetEarnings * 0.029;
  const additionalMedTax = seNetEarnings > 200000 ? (seNetEarnings - 200000) * 0.009 : 0;
  const secaTotalTax = Math.round((secaSsTax + secaMedTax + additionalMedTax) * 100) / 100;

  // Above-the-line deduction (50% of SECA)
  const aboveTheLineDeduction = secaTotalTax * 0.50;

  // Section 199A QBI deduction (20% of net profit)
  const qbiDeduction = Math.round((netBusinessProfit * 0.20) * 100) / 100;

  const tnnTaxable = Math.max(0, netBusinessProfit - aboveTheLineDeduction - qbiDeduction - 14600);
  const tnnFedTax = Math.round(calcFederalTax(tnnTaxable) * 100) / 100;

  const tnnNetCash = Math.max(0, Math.round((netBusinessProfit - secaTotalTax - tnnFedTax) * 100) / 100);
  const tnnNetAfterReplacingBenefits = Math.round((tnnNetCash - w2BenefitsValue) * 100) / 100;

  // Recommended 1099 Target for parity with W-2 total package
  const parityMultiplier = 1.30;
  const recommended1099Gross = Math.round(w2Num * parityMultiplier);
  const hourlyW2Equiv = (w2Num / 2080).toFixed(2);
  const hourly1099Equiv = (recommended1099Gross / 2000).toFixed(2); // assuming 2,000 billable hours

  const fmt = (num) => '$' + Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtWhole = (num) => '$' + Math.round(Number(num || 0)).toLocaleString('en-US');

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.metaDescription} />
        <link rel="canonical" href={meta.canonicalUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.metaDescription} />
        <meta property="og:url" content={meta.canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://uscalchub.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.metaDescription} />
        <meta name="twitter:image" content="https://uscalchub.com/logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": meta.h1,
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web Browser",
                  "url": meta.canonicalUrl,
                  "image": "https://uscalchub.com/logo.png",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                  "description": meta.metaDescription,
                  "author": { "@type": "Organization", "name": "USCalcHub", "url": "https://uscalchub.com" }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://uscalchub.com/" },
                    { "@type": "ListItem", "position": 2, "name": "1099 vs W-2 Calculator", "item": meta.canonicalUrl }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
                  }))
                }
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
        <Navbar />

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav className="flex text-xs text-slate-500 mb-4 items-center space-x-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium">1099 vs W-2 Tax Calculator</span>
          </nav>

          {/* Header */}
          <header className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <i className="ti ti-scale"></i>
              <span>2026 FICA vs SECA Statutory Tax Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {meta.h1}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Compare 1099 independent contractor vs. W-2 employee earnings. Factor in the full 15.3% SECA tax, the $176,100 Social Security cap, Section 199A QBI deductions, and lost employee benefits.
            </p>
          </header>

          {/* AEO Direct Answer Lead Callout Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 mb-8 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <i className="ti ti-bulb text-lg"></i>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  Direct Answer & Key Takeaway
                </div>
                <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                  {aeoDirectAnswer}
                </p>

                {/* Quick 3-metric snapshot bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-200/60">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Required 1099 Premium</div>
                    <div className="text-emerald-700 font-bold text-sm mt-0.5">
                      +25% to +35% Gross
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">To equal W-2 take-home & benefits</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">2026 Social Security Cap</div>
                    <div className="text-blue-700 font-bold text-sm mt-0.5">
                      $176,100 Statutory Ceiling
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Earnings above cap exempt from 12.4% SS</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Section 199A QBI Shield</div>
                    <div className="text-purple-700 font-bold text-sm mt-0.5">
                      20.0% Federal Deduction
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Direct tax shelter on net profit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="ti ti-calculator text-emerald-600"></i>
                  Interactive 1099 vs. W-2 Comparison Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust salary levels, expected contractor billings, and write-off percentages to see side-by-side net pay.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Recommended 1099 Target</span>
                <span className="text-xl font-black text-emerald-600">{fmtWhole(recommended1099Gross)}/yr</span>
                <span className="text-[10px] text-slate-400 block">(${hourly1099Equiv}/hr at 2,000 hrs)</span>
              </div>
            </div>

            {/* Presets and Sliders Bar */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200/80">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">
                Quick Baseline Salary Presets:
              </div>
              <div className="flex flex-wrap gap-2">
                {[50000, 60000, 75000, 100000, 125000, 150000, 200000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setW2Salary(preset);
                      setTenNinetyNineGross(Math.round(preset * 1.30));
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      w2Num === preset
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ${(preset / 1000)}k
                  </button>
                ))}
              </div>

              {/* Advanced Parameters: Expenses & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      1099 Business Expenses (Schedule C):
                    </label>
                    <span className="text-xs font-black text-blue-600">{expPctNum}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={expensePct}
                    onChange={(e) => setExpensePct(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Software, mileage, home office, gear write-offs</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      W-2 Benefits Value (Health, 401k, PTO):
                    </label>
                    <span className="text-xs font-black text-emerald-600">{benPctNum}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={benefitsPct}
                    onChange={(e) => setBenefitsPct(e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">National BLS benchmark is 20% to 30% of total comp</span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: W-2 Employee */}
              <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                        W-2 Employee Position
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Employer pays 50% FICA</span>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Annual Gross Salary:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={w2Salary}
                        onChange={(e) => setW2Salary(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Equivalent to ${hourlyW2Equiv}/hr (40 hrs/wk)</span>
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Gross W-2 Earnings:</span>
                      <span className="font-bold text-slate-900">{fmt(w2Num)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Employee FICA (7.65%):</span>
                      <span className="font-bold text-amber-700">−{fmt(w2FicaTax)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Estimated Federal Income Tax:</span>
                      <span className="font-bold text-rose-700">−{fmt(w2FedTax)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 bg-emerald-50/50 px-2 rounded">
                      <span className="text-emerald-800 font-semibold">+ Employer Benefits Value ({benPctNum}%):</span>
                      <span className="font-bold text-emerald-800">+{fmt(w2BenefitsValue)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5">
                    <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      W-2 Net Cash Take-Home Pay
                    </div>
                    <div className="text-2xl font-black text-blue-900 mt-0.5">
                      {fmt(w2NetTakeHome)}
                    </div>
                    <div className="text-[11px] text-blue-700 mt-1">
                      Total Economic Package: <strong className="text-slate-900">{fmt(w2TotalValue)}</strong> (with benefits)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 1099 Independent Contractor */}
              <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                        1099 Contractor Position
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700">Includes 20% QBI Shield</span>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Gross 1099 Billable Revenue:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={tenNinetyNineGross}
                        onChange={(e) => setTenNinetyNineGross(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-slate-400">Billable: ${(tnnNum / 2000).toFixed(2)}/hr (2,000 hrs)</span>
                      <button
                        type="button"
                        onClick={() => setTenNinetyNineGross(recommended1099Gross)}
                        className="text-[10px] font-bold text-emerald-700 hover:underline"
                      >
                        Auto-Match W-2 Parity
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Business Expenses ({expPctNum}% Schedule C):</span>
                      <span className="font-bold text-slate-500">−{fmt(expensesAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">Net Schedule C Profit:</span>
                      <span className="font-bold text-slate-900">{fmt(netBusinessProfit)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Full SECA Tax (15.3% on 92.35%):</span>
                      <span className="font-bold text-amber-700">−{fmt(secaTotalTax)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Est. Federal Tax (After 20% QBI & 50% SE):</span>
                      <span className="font-bold text-rose-700">−{fmt(tnnFedTax)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      1099 Net Cash In Pocket
                    </div>
                    <div className="text-2xl font-black text-emerald-900 mt-0.5">
                      {fmt(tnnNetCash)}
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1">
                      After Replacing Benefits Self-Funded: <strong className={tnnNetAfterReplacingBenefits >= w2NetTakeHome ? "text-emerald-800" : "text-amber-700"}>{fmt(tnnNetAfterReplacingBenefits)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Verdict Bar */}
            <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              tnnNetAfterReplacingBenefits >= w2NetTakeHome
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                <i className={`text-xl ${tnnNetAfterReplacingBenefits >= w2NetTakeHome ? 'ti ti-circle-check text-emerald-600' : 'ti ti-alert-triangle text-amber-600'}`}></i>
                <div className="text-xs sm:text-sm">
                  {tnnNetAfterReplacingBenefits >= w2NetTakeHome ? (
                    <span><strong>1099 Advantage:</strong> At {fmtWhole(tnnNum)}, this contractor offer exceeds the equivalent {fmtWhole(w2Num)} W-2 employee total package by <strong>+{fmt(tnnNetAfterReplacingBenefits - w2NetTakeHome)}</strong>/yr.</span>
                  ) : (
                    <span><strong>W-2 Advantage:</strong> At {fmtWhole(tnnNum)}, this contractor rate leaves you <strong>−{fmt(w2NetTakeHome - tnnNetAfterReplacingBenefits)}</strong> behind the equivalent W-2 package after covering self-funded benefits. Target at least <strong>{fmtWhole(recommended1099Gross)}</strong>.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Landmark Comparative Scenarios Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-table text-emerald-600"></i>
              Landmark W-2 vs. 1099 Parity Benchmarks ($60k, $100k, $150k)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Real economic comparison showing why higher contractor gross billings are required to achieve parity:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Benchmark Role</th>
                    <th className="py-2.5 px-3">W-2 Salary</th>
                    <th className="py-2.5 px-3">W-2 Take-Home</th>
                    <th className="py-2.5 px-3">1099 Target Gross</th>
                    <th className="py-2.5 px-3">1099 SECA Tax</th>
                    <th className="py-2.5 px-3 text-right">Parity Billable Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {comparativeScenarios.map((sc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sc.benchmarkName}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold">{fmtWhole(sc.w2Salary)}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-bold">{fmt(sc.w2NetTakeHome)}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-black">{fmtWhole(sc.equivalent1099GrossTarget)}</td>
                      <td className="py-2.5 px-3 text-amber-700 font-semibold">−{fmt(sc.tenNinetyNineSecaTax)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        {sc.netEconomicParityScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Editorial Sections */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 mb-8 space-y-6">
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editorialSections.statutoryFicaVsSecaHtml }}
            />
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed pt-6 border-t border-slate-100"
              dangerouslySetInnerHTML={{ __html: editorialSections.taxShieldsAndDeductionsHtml }}
            />
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed pt-6 border-t border-slate-100"
              dangerouslySetInnerHTML={{ __html: editorialSections.benefitsMultiplierHtml }}
            />
          </div>

          {/* Cross-Link Banner */}
          <div style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }} className="bg-emerald-600 text-white rounded-xl p-5 mb-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold mb-1 text-white">Compare Overtime Wages & Hourly Paychecks</h3>
              <p className="text-xs text-emerald-100 leading-relaxed max-w-lg">
                Explore our 2026 Overtime Pay Calculator or discover how your hourly wage converts to weekly, biweekly, and annual salary after taxes.
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link
                href="/overtime-calculator/"
                className="bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-xs"
              >
                Overtime Calculator <i className="ti ti-arrow-right ml-1"></i>
              </Link>
              <Link
                href="/hourly-to-salary/"
                className="bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-400/50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors"
              >
                Hourly Wage Hub
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-help-circle text-emerald-600"></i>
              Frequently Asked Questions (1099 vs W-2 Taxes)
            </h2>

            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
