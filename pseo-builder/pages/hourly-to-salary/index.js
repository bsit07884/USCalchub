// pages/hourly-to-salary/index.js
import { useState, useId } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  HOURLY_RATES,
  calculateHourlyBreakdown,
  getHourlySlug
} from '../../lib/hourlySalaryData';

export async function getStaticProps() {
  const allTiers = HOURLY_RATES.map((rate) => {
    const calc = calculateHourlyBreakdown(rate);
    return {
      rate,
      slug: getHourlySlug(rate),
      calc
    };
  });

  return {
    props: {
      allTiers,
      seo: {
        title: 'Hourly to Salary Calculator 2026: Convert Hourly Wage to Annual Pay',
        description: 'Convert your hourly wage into annual salary, monthly, biweekly, and weekly paychecks. Includes 2026 after-tax take-home estimates and wage comparison tables.',
        h1: 'Hourly to Salary Calculator',
        canonical: 'https://uscalchub.com/hourly-to-salary/'
      }
    }
  };
}

export default function HourlyToSalaryHubPage({ allTiers, seo }) {
  const rateInputId = useId();
  const hoursInputId = useId();
  const weeksInputId = useId();

  const [inputRate, setInputRate] = useState(25);
  const [inputHours, setInputHours] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const rateNum = Math.max(0, Number(inputRate) || 0);
  const hoursNum = Math.max(0, Number(inputHours) || 0);
  const weeksNum = Math.max(0, Number(weeksPerYear) || 52);

  // Dynamic calculations
  const totalAnnualHours = Math.round(hoursNum * weeksNum);
  const annualGross = Math.round(rateNum * totalAnnualHours);
  const monthlyGross = Math.round(annualGross / 12);
  const biweeklyGross = Math.round(annualGross / 26);
  const weeklyGross = Math.round(rateNum * hoursNum);
  const dailyGross = Math.round(rateNum * 8);

  // Estimated 2026 Taxes (Single Filer, Standard Deduction)
  const standardDeduction = 14600;
  const taxable = Math.max(0, annualGross - standardDeduction);
  let fedTax = 0;
  if (taxable > 0) fedTax += Math.min(taxable, 11925) * 0.10;
  if (taxable > 11925) fedTax += Math.min(taxable - 11925, 48475 - 11925) * 0.12;
  if (taxable > 48475) fedTax += Math.min(taxable - 48475, 103350 - 48475) * 0.22;
  if (taxable > 103350) fedTax += Math.min(taxable - 103350, 197300 - 103350) * 0.24;
  if (taxable > 197300) fedTax += Math.min(taxable - 197300, 250525 - 197300) * 0.32;
  fedTax = Math.round(fedTax);

  const ssTax = Math.round(Math.min(annualGross, 184500) * 0.062);
  const medTax = Math.round(annualGross * 0.0145 + Math.max(0, annualGross - 200000) * 0.009);
  const ficaTotal = ssTax + medTax;
  const netTakeHome = Math.max(0, annualGross - fedTax - ficaTotal);
  const netMonthly = Math.round(netTakeHome / 12);
  const netBiweekly = Math.round(netTakeHome / 26);

  const fmt = (val) => '$' + Math.round(val).toLocaleString('en-US');

  const faqs = [
    {
      q: 'How do you calculate hourly wage to annual salary?',
      a: 'To convert an hourly wage to an annual salary, multiply your hourly rate by the number of hours worked per week, then multiply by 52 weeks. For a standard full-time schedule of 40 hours per week, multiply your hourly rate by 2,080 hours (40 × 52). For example, $25 per hour × 2,080 hours = $52,000 per year gross salary.'
    },
    {
      q: 'How many work hours are in a year?',
      a: 'A standard full-time work year consists of 2,080 hours (40 hours per week × 52 weeks). If you take 2 weeks of unpaid vacation or unpaid time off, your working hours total 2,000 hours per year (40 hours × 50 weeks).'
    },
    {
      q: 'How much is $25 an hour per year after taxes?',
      a: 'At $25 an hour ($52,000 gross annual pay), a single filer in 2026 pays approximately $4,057 in Federal Income Tax and $3,978 in FICA payroll taxes. In states with no state income tax (such as Texas, Florida, or Nevada), your estimated take-home pay is approximately $43,965 per year ($3,664/month or $1,691 biweekly).'
    },
    {
      q: 'What is the difference between biweekly and semi-monthly pay?',
      a: 'Biweekly pay occurs every two weeks, resulting in 26 paychecks per year. Semi-monthly pay occurs twice per month (typically on the 1st and 15th, or 15th and last day of the month), resulting in 24 paychecks per year. Semi-monthly paychecks are slightly larger because annual salary is divided by 24 rather than 26.'
    },
    {
      q: 'Is hourly pay or salaried compensation better?',
      a: 'Hourly employees are legally protected under the Fair Labor Standards Act (FLSA) and entitled to 1.5x overtime pay for any hours worked beyond 40 per week. Salaried exempt employees receive a guaranteed regular paycheck regardless of hours worked, but often do not receive additional pay for working evenings or weekends.'
    }
  ];

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
                  "name": `${seo.h1} — USCalcHub`,
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
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": faqs.map((faq) => ({
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
          {/* Breadcrumbs */}
          <nav className="flex text-xs text-slate-500 mb-4 items-center space-x-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium">Hourly to Salary</span>
          </nav>

          {/* Header */}
          <header className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <i className="ti ti-calculator"></i>
              <span>2026 Conversion Calculator · Instant & Accurate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {seo.h1}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Convert your hourly wage into annual salary, monthly income, biweekly pay, and weekly paychecks. Includes 2026 after-tax net pay estimates and 20 common hourly pay tier guides.
            </p>
          </header>

          {/* AEO Direct Answer Box */}
          <section className="mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-l-4 border-blue-600 rounded-r-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[11px]">
                <i className="ti ti-check"></i>
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900">
                Quick Formula & Direct Answer (2026 Standard)
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              To convert an hourly rate to an annual salary for a full-time job (40 hours per week), multiply your hourly rate by <strong>2,080 working hours</strong>:
            </p>
            <div className="my-3 p-3 bg-white rounded-lg border border-blue-200 font-mono text-sm text-slate-900 font-semibold shadow-inner">
              Annual Salary = Hourly Wage × Hours Worked Per Week × Weeks Worked Per Year
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              For example, <strong>$25/hour</strong> × 40 hours × 52 weeks = <strong>$52,000/year gross</strong> ($4,333/month or $2,000 biweekly). With 2 weeks of unpaid time off (2,000 hours), total gross pay equals <strong>$50,000/year</strong>.
            </p>
          </section>

          {/* Interactive Calculator Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Interactive Wage & Paycheck Converter
                </h2>
                <p className="text-xs text-slate-500">
                  Adjust rate, hours per week, or weeks worked to calculate your custom earnings.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                2026 Rates Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Hourly Wage Input */}
              <div>
                <label htmlFor={rateInputId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Hourly Wage ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">$</span>
                  <input
                    id={rateInputId}
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={inputRate}
                    onChange={(e) => setInputRate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Hours per Week */}
              <div>
                <label htmlFor={hoursInputId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Hours Per Week: <span className="text-blue-600 font-bold">{hoursNum} hrs</span>
                </label>
                <input
                  id={hoursInputId}
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={hoursNum}
                  onChange={(e) => setInputHours(e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2.5"
                />
              </div>

              {/* Weeks per Year */}
              <div>
                <label htmlFor={weeksInputId} className="block text-xs font-semibold text-slate-700 mb-1">
                  Weeks Per Year
                </label>
                <select
                  id={weeksInputId}
                  value={weeksNum}
                  onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800 bg-white"
                >
                  <option value={52}>52 Weeks (Full Year / Paid PTO)</option>
                  <option value={50}>50 Weeks (2 Weeks Unpaid Vacation)</option>
                  <option value={48}>48 Weeks (4 Weeks Unpaid Time Off)</option>
                  <option value={40}>40 Weeks (Academic / Seasonal)</option>
                </select>
              </div>
            </div>

            {/* Output Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Gross Annual</span>
                <span className="text-base sm:text-lg font-bold text-blue-700 block mt-0.5">{fmt(annualGross)}</span>
                <span className="text-[10px] text-slate-400">{totalAnnualHours.toLocaleString()} hrs/yr</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Monthly Gross</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 block mt-0.5">{fmt(monthlyGross)}</span>
                <span className="text-[10px] text-slate-400">12 pay periods</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Biweekly Gross</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 block mt-0.5">{fmt(biweeklyGross)}</span>
                <span className="text-[10px] text-slate-400">26 pay periods</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Weekly Gross</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 block mt-0.5">{fmt(weeklyGross)}</span>
                <span className="text-[10px] text-slate-400">{hoursNum} hrs/wk</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Daily (8h)</span>
                <span className="text-base sm:text-lg font-bold text-slate-800 block mt-0.5">{fmt(dailyGross)}</span>
                <span className="text-[10px] text-slate-400">Standard 8h day</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">Est. Take-Home</span>
                <span className="text-base sm:text-lg font-bold text-emerald-700 block mt-0.5">{fmt(netTakeHome)}</span>
                <span className="text-[10px] text-emerald-600 font-medium">After Fed + FICA</span>
              </div>
            </div>

            {/* Quick Tax Note */}
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <div>
                <strong>2026 Estimated Withholding:</strong> Federal Tax: {fmt(fedTax)} | FICA (SS + Medicare): {fmt(ficaTotal)} | Net Monthly: <span className="text-emerald-700 font-bold">{fmt(netMonthly)}</span>
              </div>
              <Link href="/salary-calculator/" className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1">
                State-by-State Tax Calculator <i className="ti ti-arrow-right"></i>
              </Link>
            </div>
          </section>

          {/* Quick Links to Common Hourly Tiers */}
          <section className="mb-8">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
              Explore Specific Hourly Pay Rates
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {allTiers.map((t) => (
                <Link
                  key={t.slug}
                  href={`/hourly-to-salary/${t.slug}/`}
                  className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm rounded-lg p-2.5 text-center transition-all group"
                >
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 block">
                    ${t.rate} an Hour
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {fmt(t.calc.annualGross)}/yr
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Comprehensive 20-Tier Conversion Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-8">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Hourly to Salary Conversion Table (40 Hours/Week · 2,080 Hours)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full compensation breakdown across 20 standard US hourly wages based on full-time 40-hour work weeks.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Hourly Rate</th>
                    <th className="py-2.5 px-3">Daily (8h)</th>
                    <th className="py-2.5 px-3">Weekly (40h)</th>
                    <th className="py-2.5 px-3">Biweekly (80h)</th>
                    <th className="py-2.5 px-3">Monthly</th>
                    <th className="py-2.5 px-3">Annual Gross</th>
                    <th className="py-2.5 px-3 text-emerald-700">Est. Take-Home*</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTiers.map((t) => (
                    <tr key={t.slug} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">${t.rate}/hr</td>
                      <td className="py-2.5 px-3 text-slate-600">{fmt(t.calc.dailyGross)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{fmt(t.calc.weeklyGross)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{fmt(t.calc.biweeklyGross)}</td>
                      <td className="py-2.5 px-3 text-slate-600">{fmt(t.calc.monthlyGross)}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-700">{fmt(t.calc.annualGross)}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">{fmt(t.calc.netTakeHomeZeroTax)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href={`/hourly-to-salary/${t.slug}/`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View <i className="ti ti-chevron-right text-xs ml-0.5"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              * Estimated take-home pay assumes a single filer taking the standard deduction in a state with zero state income tax (e.g., Texas, Florida, Nevada, Washington).
            </p>
          </section>

          {/* Editorial Content / EEAT Guide */}
          <article className="prose prose-slate max-w-none bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
              How to Convert Hourly Pay to Annual Salary: Detailed Mathematical Guide
            </h2>
            <p className="mb-4">
              Converting an hourly rate to an annual salary is one of the most common financial calculations for job seekers, contractors, and human resources professionals. While the basic calculation appears straightforward, factors such as paid time off, unpaid vacation, overtime eligibility, and statutory payroll tax withholdings have a substantial impact on actual take-home earnings.
            </p>

            <h3 className="text-base font-bold text-slate-800 mt-4 mb-2">
              The Standard 2,080 Hours Rule (Paid Holidays and Vacation)
            </h3>
            <p className="mb-3">
              In the United States, human resources departments, payroll systems, and the Bureau of Labor Statistics (BLS) calculate full-time employment based on a 40-hour work week across 52 weeks in a calendar year:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 mb-4">
              40 hours/week × 52 weeks/year = 2,080 working hours per year
            </div>
            <p className="mb-4">
              If your employer offers paid time off (PTO)—including paid vacation days, paid sick leave, and federal holidays—your annual gross pay is calculated directly by multiplying your hourly rate by 2,080. For instance, at <strong>$30 an hour</strong>, your annual compensation equals <strong>$62,400 per year</strong>.
            </p>

            <h3 className="text-base font-bold text-slate-800 mt-4 mb-2">
              The 2,000 Hours Benchmark (Unpaid Time Off or Independent Contractors)
            </h3>
            <p className="mb-3">
              Many hourly workers, temporary staffing employees, and 1099 independent contractors do not receive paid holidays or paid vacations. If you take 2 weeks of unpaid leave during the year, your active working schedule is 50 weeks:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 mb-4">
              40 hours/week × 50 weeks/year = 2,000 working hours per year
            </div>
            <p className="mb-4">
              Using the 2,000 hours benchmark makes mental math exceptionally easy: simply double your hourly wage and add three zeros. For example, at <strong>$25 an hour</strong>, doubling equals 50, which translates to <strong>$50,000 per year</strong> without paid time off.
            </p>

            <h3 className="text-base font-bold text-slate-800 mt-4 mb-2">
              Paycheck Frequencies: Biweekly vs Semi-Monthly
            </h3>
            <p className="mb-3">
              Understanding your pay frequency is crucial for budgeting mortgage payments, rent, and utility bills:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><strong>Biweekly (Every 2 Weeks):</strong> 26 pay periods per year. Each paycheck covers 80 hours. Most months you receive 2 paychecks, but two months per year contain a &quot;three-paycheck bonus&quot; month.</li>
              <li><strong>Semi-Monthly (Twice Per Month):</strong> 24 pay periods per year, commonly paid on the 1st and 15th, or 15th and 30th. Each paycheck covers approximately 86.67 hours.</li>
              <li><strong>Weekly:</strong> 52 pay periods per year. Ideal for cash flow, covering 40 regular hours per paycheck.</li>
              <li><strong>Monthly:</strong> 12 pay periods per year. Covers 173.33 hours per paycheck.</li>
            </ul>

            <h3 className="text-base font-bold text-slate-800 mt-4 mb-2">
              Understanding 2026 Taxes and Net Take-Home Pay
            </h3>
            <p className="mb-3">
              Your gross salary is not what reaches your bank account. Every US paycheck is subject to mandatory federal and state withholdings:
            </p>
            <ol className="list-decimal pl-5 space-y-1 mb-4">
              <li><strong>Federal Income Tax:</strong> Progressive brackets ranging from 10% to 37% after subtracting the 2026 standard deduction ($14,600 for single filers).</li>
              <li><strong>Social Security Tax (OASDI):</strong> 6.2% of gross earnings up to the statutory 2026 wage cap of $184,500.</li>
              <li><strong>Medicare Tax:</strong> 1.45% on all gross earnings, plus an additional 0.9% surtax on earnings exceeding $200,000 for single filers.</li>
              <li><strong>State and Local Income Taxes:</strong> Varies significantly by jurisdiction. States such as Texas, Florida, Nevada, Washington, and Tennessee have 0% state income tax on wages, while states like California and New York levy progressive rates up to 13.3% and 10.9%.</li>
            </ol>
            <p>
              To see an exact paycheck breakdown customized to your state and filing status, visit our <Link href="/salary-calculator/" className="text-blue-600 font-semibold hover:underline">US Salary After-Tax Calculator</Link>.
            </p>
          </article>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-8">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
              Frequently Asked Questions (Hourly to Salary Conversion)
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools Navigation */}
          <section className="bg-slate-100 rounded-xl p-5 text-center">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Explore More Free Financial Tools on USCalcHub
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Link href="/salary-calculator/" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 font-medium text-slate-700">
                Salary After Tax Calculator
              </Link>
              <Link href="/overtime-calculator/" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 font-medium text-slate-700">
                Overtime Pay Calculator
              </Link>
              <Link href="/credit-card-payoff/" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 font-medium text-slate-700">
                Credit Card Payoff Calculator
              </Link>
              <Link href="/real-estate-calculator/" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 font-medium text-slate-700">
                Real Estate Commission Calculator
              </Link>
              <Link href="/social-security-calculator/" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 font-medium text-slate-700">
                Social Security Tax Calculator
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}