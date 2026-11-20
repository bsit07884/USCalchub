// pages/overtime-calculator/index.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { OVERTIME_CALCULATOR_DATA } from '../../lib/overtimeData';

export async function getStaticProps() {
  return {
    props: {
      data: OVERTIME_CALCULATOR_DATA
    }
  };
}

export default function OvertimeCalculatorPage({ data }) {
  const { meta, aeoDirectAnswer, engineParameters, editorialSections, benchmarks, faqs } = data;

  const [hourlyRate, setHourlyRate] = useState(25);
  const [regularHours, setRegularHours] = useState(40);
  const [otHours, setOtHours] = useState(10);
  const [doubleHours, setDoubleHours] = useState(0);

  const rateNum = Math.max(0, parseFloat(hourlyRate) || 0);
  const regHoursNum = Math.max(0, parseFloat(regularHours) || 0);
  const otHoursNum = Math.max(0, parseFloat(otHours) || 0);
  const dblHoursNum = Math.max(0, parseFloat(doubleHours) || 0);

  // Dynamic calculations
  const timeAndHalfRate = rateNum * 1.5;
  const doubleTimeRate = rateNum * 2.0;

  const regularGross = rateNum * regHoursNum;
  const overtimeGross = timeAndHalfRate * otHoursNum;
  const doubleGross = doubleTimeRate * dblHoursNum;
  const totalGross = regularGross + overtimeGross + doubleGross;

  // FICA (7.65%)
  const ficaTax = Math.round(totalGross * 0.0765 * 100) / 100;

  // Federal Withholding (approximate 2026 progressive single bracket vs 22% flat supplemental)
  const annualizedGross = totalGross * 52;
  const taxable = Math.max(0, annualizedGross - 14600);
  let annualizedFed = 0;
  if (taxable > 0) annualizedFed += Math.min(taxable, 11925) * 0.10;
  if (taxable > 11925) annualizedFed += Math.min(taxable - 11925, 48475 - 11925) * 0.12;
  if (taxable > 48475) annualizedFed += Math.min(taxable - 48475, 103350 - 48475) * 0.22;
  if (taxable > 103350) annualizedFed += Math.min(taxable - 103350, 197300 - 103350) * 0.24;
  const periodicFedTax = Math.round((annualizedFed / 52) * 100) / 100;

  // Supplemental 22% flat comparison on OT portion
  const flat22OtTax = Math.round(overtimeGross * 0.22 * 100) / 100;

  const netTakeHome = Math.max(0, Math.round((totalGross - ficaTax - periodicFedTax) * 100) / 100);

  const fmt = (num) => '$' + Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                    { "@type": "ListItem", "position": 2, "name": "Overtime Calculator", "item": meta.canonicalUrl }
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
            <span className="text-slate-700 font-medium">Overtime Pay Calculator</span>
          </nav>

          {/* Header */}
          <header className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <i className="ti ti-clock-check"></i>
              <span>2026 FLSA & IRS Publication 15-T Rules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {meta.h1}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Calculate exact time-and-a-half (1.5x) and double-time (2.0x) overtime pay, compare the IRS 22% supplemental withholding rule, and see your true take-home paycheck.
            </p>
          </header>

          {/* AEO Direct Answer Lead Callout Box */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 mb-8 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <i className="ti ti-bulb text-lg"></i>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Direct Answer & Key Takeaway
                </div>
                <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                  {aeoDirectAnswer}
                </p>

                {/* Quick 3-metric snapshot bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/60">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Time-and-a-Half Rate</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">
                      {fmt(rateNum * 1.5)} / hr
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">1.5x base hourly wage</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Supplemental Withholding</div>
                    <div className="text-amber-700 font-bold text-sm mt-0.5">
                      22.0% Flat Rate
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Preliminary payroll escrow</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Year-End Reality</div>
                    <div className="text-emerald-700 font-bold text-sm mt-0.5">
                      Reconciled at 10%–22%
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Over-withholding refunded</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="ti ti-calculator text-blue-600"></i>
                  Interactive Overtime Paycheck Calculator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your regular hourly rate and overtime hours to calculate total gross pay and estimated deductions.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Calculated Gross Paycheck</span>
                <span className="text-xl font-black text-blue-600">{fmt(totalGross)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                    Regular Hourly Rate ($):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[18, 20, 25, 30, 40, 50].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setHourlyRate(r)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          rateNum === r ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        ${r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Regular Hours:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={regularHours}
                      onChange={(e) => setRegularHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard (≤ 40)</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Overtime (1.5x):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={otHours}
                      onChange={(e) => setOtHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Rate: {fmt(timeAndHalfRate)}</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Double Time (2x):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={doubleHours}
                      onChange={(e) => setDoubleHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 block">Rate: {fmt(doubleTimeRate)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Breakdown */}
              <div className="lg:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Paycheck Breakdown
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Regular Pay ({regHoursNum} hrs @ {fmt(rateNum)}):</span>
                      <span className="font-bold text-slate-900">{fmt(regularGross)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-blue-700 font-semibold">Overtime Pay ({otHoursNum} hrs @ {fmt(timeAndHalfRate)}):</span>
                      <span className="font-bold text-blue-700">+{fmt(overtimeGross)}</span>
                    </div>
                    {dblHoursNum > 0 && (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-indigo-700 font-semibold">Double Time ({dblHoursNum} hrs @ {fmt(doubleTimeRate)}):</span>
                        <span className="font-bold text-indigo-700">+{fmt(doubleGross)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">FICA Taxes (6.2% SS + 1.45% Medicare):</span>
                      <span className="font-bold text-amber-700">−{fmt(ficaTax)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Est. Federal Withholding:</span>
                      <span className="font-bold text-rose-700">−{fmt(periodicFedTax)}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5 mb-2">
                    <div className="flex justify-between items-baseline">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Estimated Net Take-Home Pay
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        {totalGross > 0 ? ((netTakeHome / totalGross) * 100).toFixed(1) + '%' : '100%'} of gross
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800 mt-0.5">
                      {fmt(netTakeHome)}
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Estimated net earnings for this pay period before state income tax deductions.
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Note:</span> If your payroll uses the 22% flat supplemental rule on overtime, {fmt(flat22OtTax)} is withheld on the overtime portion, with any overage returned as an IRS tax refund.
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Wage Scenarios Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-table text-blue-600"></i>
              Common Overtime Pay Scenarios (40 Reg + 10 OT Hours)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Detailed breakdown of weekly paychecks with 10 overtime hours worked at 1.5x time-and-a-half:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Base Wage</th>
                    <th className="py-2.5 px-3">1.5x OT Rate</th>
                    <th className="py-2.5 px-3">Gross (50 hrs)</th>
                    <th className="py-2.5 px-3">FICA (7.65%)</th>
                    <th className="py-2.5 px-3">Fed Tax Est.</th>
                    <th className="py-2.5 px-3 text-right">Net Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {benchmarks.map((bm) => (
                    <tr key={bm.hourlyRate} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{bm.hourlyRateDisplay}</td>
                      <td className="py-2.5 px-3 text-blue-600 font-bold">{bm.overtimeRateDisplay}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{fmt(bm.totalGross)}</td>
                      <td className="py-2.5 px-3 text-amber-700">−{fmt(bm.ficaTax)}</td>
                      <td className="py-2.5 px-3 text-rose-700">−{fmt(bm.estimatedFederalWithholding)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-700 text-sm">
                        {fmt(bm.estimatedNetTakeHome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Editorial & Myth-Buster Sections */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 mb-8 space-y-6">
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editorialSections.flsaFrameworkHtml }}
            />
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed pt-6 border-t border-slate-100"
              dangerouslySetInnerHTML={{ __html: editorialSections.supplementalTaxMythBusterHtml }}
            />
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed pt-6 border-t border-slate-100"
              dangerouslySetInnerHTML={{ __html: editorialSections.mathematicalFormulaHtml }}
            />
          </div>

          {/* Cross-Link Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)' }} className="bg-blue-600 text-white rounded-xl p-5 mb-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold mb-1 text-white">Compare Full Annual Salaries & State Taxes</h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
                Explore our 50-State Salary Hub or check how your base hourly wage converts into monthly and annual after-tax earnings across all 20 wage tiers.
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link
                href="/hourly-to-salary/"
                className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-xs"
              >
                Hourly Wage Hub <i className="ti ti-arrow-right ml-1"></i>
              </Link>
              <Link
                href="/salary-calculator/"
                className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-400/50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors"
              >
                50-State Hub
              </Link>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-help-circle text-blue-600"></i>
              Frequently Asked Questions (Overtime Tax Rules)
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
