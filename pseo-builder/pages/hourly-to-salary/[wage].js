// pages/hourly-to-salary/[wage].js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  HOURLY_RATES,
  getAllHourlySlugs,
  parseRateFromSlug,
  getHourlyData,
  calculateHourlyBreakdown,
  getHourlySlug
} from '../../lib/hourlySalaryData';

export async function getStaticPaths() {
  const slugs = getAllHourlySlugs();
  const paths = slugs.map((slug) => ({
    params: { wage: slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { wage } = params;
  const rate = parseRateFromSlug(wage);

  if (!rate) {
    return { notFound: true };
  }

  const wageData = getHourlyData(rate);
  const otherRates = HOURLY_RATES.filter((r) => r !== rate);

  return {
    props: {
      wageData,
      otherRates,
      seo: {
        title: wageData.title,
        description: wageData.metaDescription,
        h1: wageData.h1,
        canonical: `https://uscalchub.com/hourly-to-salary/${wageData.slug}/`
      }
    }
  };
}

export default function HourlyWagePage({ wageData, otherRates, seo }) {
  const [customRate, setCustomRate] = useState(wageData.rate);
  const [customHours, setCustomHours] = useState(40);

  // Dynamic calculations when user adjusts sliders
  const isDefault = customRate === wageData.rate && customHours === 40;
  const dynamicAnnual = Math.round(customRate * customHours * 52);
  const dynamicMonthly = Math.round(dynamicAnnual / 12);
  const dynamicBiweekly = Math.round(dynamicAnnual / 26);
  const dynamicWeekly = Math.round(customRate * customHours);

  // Formatter helper
  const fmt = (val) => '$' + Math.round(val).toLocaleString('en-US');

  const { calc } = wageData;

  // Nearby wage links for cross-linking
  const nearbyRates = otherRates
    .sort((a, b) => Math.abs(a - wageData.rate) - Math.abs(b - wageData.rate))
    .slice(0, 4)
    .sort((a, b) => a - b);

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://uscalchub.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content="https://uscalchub.com/logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": `${wageData.h1} — USCalcHub`,
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web Browser",
                  "url": seo.canonical,
                  "image": "https://uscalchub.com/logo.png",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": seo.description,
                  "author": {
                    "@type": "Organization",
                    "name": "USCalcHub",
                    "url": "https://uscalchub.com"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://uscalchub.com/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Hourly to Salary",
                      "item": "https://uscalchub.com/hourly-to-salary/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": `$${wageData.rate} an Hour`,
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": wageData.faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.a
                    }
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
          {/* Breadcrumb navigation */}
          <nav className="flex text-xs text-slate-500 mb-4 items-center space-x-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-400">/</span>
            <Link href="/hourly-to-salary/" className="hover:text-blue-600 transition-colors">Hourly to Salary</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium">${wageData.rate} an Hour</span>
          </nav>

          {/* Header Section */}
          <header className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <i className="ti ti-cash"></i>
              <span>2026 Wage & Salary Guide · 2,080 Working Hours</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {seo.h1}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Complete conversion of <strong>${wageData.rate} per hour</strong> into annual salary, monthly pay, biweekly paychecks, and estimated after-tax take-home earnings.
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
                  Working 40 hours per week at <strong>${wageData.rate} an hour</strong> equals an annual gross salary of <strong>{fmt(calc.annualGross)} per year</strong> ({fmt(calc.monthlyGross)} per month, {fmt(calc.biweeklyGross)} biweekly, or {fmt(calc.weeklyGross)} per week). After standard 2026 Federal Income Tax ({fmt(calc.federalTax)}) and FICA taxes ({fmt(calc.ficaTotal)}), your estimated net take-home pay is approximately <strong>{fmt(calc.netTakeHomeZeroTax)} per year</strong> ({fmt(calc.netMonthlyZeroTax)}/month) in zero-tax states like Texas or Florida.
                </p>

                {/* Quick 3-metric snapshot bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/60">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Gross Annual Salary</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">
                      {fmt(calc.annualGross)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">40 hrs/wk (2,080 hrs)</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Net Take-Home (0% Tax State)</div>
                    <div className="text-emerald-700 font-bold text-sm mt-0.5">
                      {fmt(calc.netTakeHomeZeroTax)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{fmt(calc.netMonthlyZeroTax)} / month</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Gross Biweekly Paycheck</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">
                      {fmt(calc.biweeklyGross)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">80 working hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Wage Converter Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="ti ti-calculator text-blue-600"></i>
                  Interactive ${wageData.rate}/Hour Paycheck Calculator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust hours worked per week or change the hourly rate to test part-time vs overtime scenarios.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Calculated Annual Gross</span>
                <span className="text-xl font-black text-blue-600">{fmt(dynamicAnnual)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="hourly-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Hourly Rate ($):
                    </label>
                    <span className="text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      ${customRate}/hr
                    </span>
                  </div>
                  <input
                    id="hourly-input"
                    type="range"
                    min="10"
                    max="120"
                    step="1"
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>$10/hr</span>
                    <span>$50/hr</span>
                    <span>$120/hr</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="hours-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Hours Worked Per Week:
                    </label>
                    <span className="text-xs font-bold text-slate-600">
                      {customHours} hours/week
                    </span>
                  </div>
                  <input
                    id="hours-input"
                    type="range"
                    min="20"
                    max="60"
                    step="1"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value, 10))}
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>20 hrs (Part-Time)</span>
                    <button
                      type="button"
                      className="text-[11px] font-bold text-indigo-600 underline"
                      onClick={() => {
                        setCustomRate(wageData.rate);
                        setCustomHours(40);
                      }}
                    >
                      Reset 40 Hours Standard
                    </button>
                    <span>60 hrs (Overtime)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Gross Paycheck Schedule
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="text-3xl font-black text-slate-900">{fmt(dynamicAnnual)}</div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500">Weekly: </span>
                      <span className="text-sm font-bold text-slate-800">{fmt(dynamicWeekly)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Gross</div>
                      <div className="text-base font-bold text-slate-800 mt-0.5">{fmt(dynamicMonthly)}</div>
                      <div className="text-[11px] text-slate-500">12 paychecks/yr</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biweekly Gross</div>
                      <div className="text-base font-bold text-slate-800 mt-0.5">{fmt(dynamicBiweekly)}</div>
                      <div className="text-[11px] text-slate-500">26 paychecks/yr</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5 mb-3">
                    <div className="flex justify-between items-baseline">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Est. Take-Home Pay (Zero Tax State)
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        ~{Math.round((calc.netTakeHomeZeroTax / calc.annualGross) * 100)}% Net
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800 mt-0.5">
                      {fmt(calc.netTakeHomeZeroTax)}
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Net earnings after federal income tax ({fmt(calc.federalTax)}) and FICA ({fmt(calc.ficaTotal)}).
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Daily Pay (8-Hour Day):</span>
                  <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                    {fmt(wageData.rate * 8)} / day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table 1: Complete Conversion Table & Vacation Variations */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-table text-blue-600"></i>
              ${wageData.rate} an Hour Conversion Table (Gross Paycheck Schedule)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of earnings before taxes across all standard US pay frequencies and unpaid time-off policies:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Timeframe</th>
                    <th className="py-2.5 px-3">Work Hours</th>
                    <th className="py-2.5 px-3">Gross Earnings</th>
                    <th className="py-2.5 px-3">Annual Equivalent</th>
                    <th className="py-2.5 px-3 text-right">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Per Hour</td>
                    <td className="py-2.5 px-3 text-slate-600">1 hour</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">${wageData.rate}.00</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">Base hourly wage</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Per Day</td>
                    <td className="py-2.5 px-3 text-slate-600">8 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.dailyGross)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">Standard 8-hr workday</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Per Week</td>
                    <td className="py-2.5 px-3 text-slate-600">40 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.weeklyGross)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">52 weekly paychecks</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Bi-Weekly</td>
                    <td className="py-2.5 px-3 text-slate-600">80 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.biweeklyGross)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">Every 2 weeks (26 pay periods)</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Per Month</td>
                    <td className="py-2.5 px-3 text-slate-600">~173.3 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.monthlyGross)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">12 monthly paychecks</td>
                  </tr>
                  <tr className="transition-colors bg-blue-50/80 font-semibold">
                    <td className="py-2.5 px-3 font-bold text-blue-900">Annual (Full-Time)</td>
                    <td className="py-2.5 px-3 text-blue-800">2,080 hours</td>
                    <td className="py-2.5 px-3 font-bold text-blue-900">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-blue-800">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-right text-blue-700 font-bold">Standard 52 Weeks</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Annual (2 Wks Unpaid)</td>
                    <td className="py-2.5 px-3 text-slate-600">2,000 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.twoWeeksUnpaidAnnual)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.twoWeeksUnpaidAnnual)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">50 working weeks</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Annual (4 Wks Unpaid)</td>
                    <td className="py-2.5 px-3 text-slate-600">1,920 hours</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(calc.fourWeeksUnpaidAnnual)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.fourWeeksUnpaidAnnual)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">48 working weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: 2026 After-Tax Paycheck Breakdown by State */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-receipt-tax text-emerald-600"></i>
              ${wageData.rate} an Hour After Taxes (2026 State Comparison)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Estimated net take-home pay after standard 2026 IRS withholding, FICA payroll taxes (7.65%), and state income tax:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">State / Benchmark</th>
                    <th className="py-2.5 px-3">Gross Salary</th>
                    <th className="py-2.5 px-3">Federal Tax</th>
                    <th className="py-2.5 px-3">FICA (SS + Med)</th>
                    <th className="py-2.5 px-3">State Tax</th>
                    <th className="py-2.5 px-3 text-right">Net Annual Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="transition-colors bg-emerald-50/60">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">Texas / Florida / Nevada</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">0% State Tax</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-rose-600">−{fmt(calc.federalTax)}</td>
                    <td className="py-2.5 px-3 text-amber-600">−{fmt(calc.ficaTotal)}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">$0</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-700 text-sm">{fmt(calc.netTakeHomeZeroTax)}</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">California</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">Progressive</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-rose-600">−{fmt(calc.federalTax)}</td>
                    <td className="py-2.5 px-3 text-amber-600">−{fmt(calc.ficaTotal)}</td>
                    <td className="py-2.5 px-3 text-rose-600">−{fmt(calc.caEstimatedStateTax)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 text-sm">{fmt(calc.netTakeHomeCA)}</td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-50/60">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">New York (State)</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">Progressive</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{fmt(calc.annualGross)}</td>
                    <td className="py-2.5 px-3 text-rose-600">−{fmt(calc.federalTax)}</td>
                    <td className="py-2.5 px-3 text-amber-600">−{fmt(calc.ficaTotal)}</td>
                    <td className="py-2.5 px-3 text-rose-600">−{fmt(calc.nyEstimatedStateTax)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 text-sm">{fmt(calc.netTakeHomeNY)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              *Calculations assume 2026 single filer status using standard IRS standard deduction ($14,600). Actual paycheck amounts may vary based on 401(k) pre-tax deferrals, health insurance, and local municipal income taxes.
            </div>
          </div>

          {/* Deep Editorial Context Section: Career & Budgeting at This Wage */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <i className="ti ti-chart-bar text-base"></i>
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Income & Budgeting Analysis</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Can You Live on ${wageData.rate} an Hour in the USA?</h2>
              </div>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
              <p>
                An hourly wage of <strong>${wageData.rate} per hour</strong> equates to an annual gross salary of <strong>{fmt(calc.annualGross)}</strong>. In the United States, where the median household income hovers around $75,000, earning ${wageData.rate}/hr places an individual earner {calc.annualGross >= 75000 ? 'at or above' : 'approaching'} the national median income.
              </p>
              <p>
                Applying the standard <strong>50/30/20 budgeting rule</strong> to your net monthly income of ~{fmt(calc.netMonthlyZeroTax)}:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Needs (50%):</strong> Allocate approximately <strong>{fmt(calc.netMonthlyZeroTax * 0.50)}/month</strong> toward housing, utilities, groceries, and transportation. Following the 30% rent rule, recommended maximum monthly rent is <strong>{fmt(calc.monthlyGross * 0.30)}</strong>.</li>
                <li><strong>Wants (30%):</strong> Budget approximately <strong>{fmt(calc.netMonthlyZeroTax * 0.30)}/month</strong> for dining out, recreation, and discretionary expenses.</li>
                <li><strong>Savings & Debt (20%):</strong> Set aside <strong>{fmt(calc.netMonthlyZeroTax * 0.20)}/month</strong> for emergency funds, 401(k) retirement contributions, or paying off credit card balances.</li>
              </ul>
            </div>
          </div>

          {/* Cross-Link Banner to Full Salary Calculator Hub */}
          <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)' }} className="bg-blue-600 text-white rounded-xl p-5 mb-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold mb-1 text-white">Need State-Specific Tax Withholdings?</h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
                Use our interactive 50-State Salary Calculator to compare exact city and state payroll withholdings, 401(k) tax savings, and married filing joint deductions.
              </p>
            </div>
            <Link
              href="/salary-calculator/"
              className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-xs"
            >
              Open 50-State Salary Hub <i className="ti ti-arrow-right ml-1"></i>
            </Link>
          </div>

          {/* Explore Other Hourly Wages Grid */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-arrows-left-right text-blue-600"></i>
              Compare Other Common Hourly Wages
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Explore annual salary conversions for other frequently searched US hourly pay rates:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {nearbyRates.map((r) => {
                const b = calculateHourlyBreakdown(r);
                return (
                  <Link
                    key={r}
                    href={`/hourly-to-salary/${getHourlySlug(r)}/`}
                    className="block bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                  >
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                      <span>${r} an Hour</span>
                      <i className="ti ti-chevron-right text-[10px] text-slate-400 group-hover:text-blue-600"></i>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {fmt(b.annualGross)} / year
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-help-circle text-blue-600"></i>
              Frequently Asked Questions (${wageData.rate} an Hour)
            </h2>

            <div className="divide-y divide-slate-100">
              {wageData.faqs.map((faq, idx) => (
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
