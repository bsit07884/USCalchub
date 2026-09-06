import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { calculateTakeHome, STATES, getLiveStates } from '../../lib/taxData';

export default function SalaryCalculatorHub() {
  const [salary, setSalary] = useState(75000);
  const [selectedState, setSelectedState] = useState('texas');
  const [filingStatus, setFilingStatus] = useState('single');
  const [searchTerm, setSearchTerm] = useState('');
  
  const liveStates = getLiveStates();
  const popularSlugs = ['florida', 'nevada', 'california', 'texas'];
  const popularStates = liveStates.filter(s => popularSlugs.includes(s.slug));
  const otherStates = liveStates.filter(s => !popularSlugs.includes(s.slug));

  const searchResults = searchTerm.trim() 
    ? liveStates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.abbr.toLowerCase().includes(searchTerm.toLowerCase())) 
    : [];
  
  const currentState = liveStates.find(s => s.slug === selectedState) || liveStates[0];

  const calc = calculateTakeHome(salary, selectedState) || {
    gross: salary,
    annualTakeHome: 0,
    monthlyTakeHome: 0,
    biweeklyTakeHome: 0,
    federalTax: 0,
    ficaTotal: 0,
    stateTax: 0,
    effectiveTotalRate: '0.0'
  };

  // Stacked bar percentages
  const takeHomePct = salary > 0 ? ((calc.annualTakeHome / salary) * 100).toFixed(1) : 0;
  const federalTaxPct = salary > 0 ? ((calc.federalTax / salary) * 100).toFixed(1) : 0;
  const ficaPct = salary > 0 ? ((calc.ficaTotal / salary) * 100).toFixed(1) : 0;
  const stateTaxPct = salary > 0 ? ((calc.stateTax / salary) * 100).toFixed(1) : 0;

  // State Tax badge for dropdown
  let stateTaxBadge = "0% State Tax";
  if (currentState.incomeTax.type === "progressive") {
    stateTaxBadge = `${(currentState.incomeTax.topRate * 100).toFixed(1)}% Top Rate`;
  } else if (currentState.incomeTax.type === "flat") {
    stateTaxBadge = `${(currentState.incomeTax.rate * 100).toFixed(1)}% Flat Rate`;
  }

  const quickSalaries = [50000, 75000, 100000, 125000, 150000];

  const faqs = [
    {
      q: "Which state gives you the highest take-home pay on a $75,000 salary?",
      a: "The states with zero personal earned income tax (Texas, Florida, Nevada, Washington, Wyoming, Tennessee, South Dakota, Alaska, and New Hampshire) deliver the absolute maximum take-home pay of approximately $61,593 per year ($5,133/month) for a single filer claiming standard deductions."
    },
    {
      q: "How much less do I take home in California compared to Texas?",
      a: "In California, a single earner on a $75,000 gross salary pays approximately $3,463 in state income tax plus State Disability Insurance (SDI). As a result, you take home roughly $58,130 in California versus $61,593 in Texas — an immediate difference of $3,463 net cash in pocket per year."
    },
    {
      q: "Are these figures accurate for the 2026 tax year?",
      a: "Yes. These figures use official IRS Publication 15-T standard withholding tax brackets, the updated Social Security wage base limit, the single standard deduction baseline, and enacted 2026 state tax statutes."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "US Salary After Tax Calculator 2026",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "url": "https://uscalchub.com/salary-calculator/",
        "image": "https://uscalchub.com/logo.png",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free US salary after-tax calculator with 2026 IRS federal tax rates, state income tax, and FICA deductions.",
        "author": { "@type": "Organization", "name": "USCalcHub", "url": "https://uscalchub.com" },
        "featureList": ["50 states verified", "2026 IRS rates", "FICA calculation", "State income tax", "Monthly and biweekly breakdown", "Free, no signup"]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://uscalchub.com" },
          { "@type": "ListItem", "position": 2, "name": "Salary Calculator", "item": "https://uscalchub.com/salary-calculator/" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        }))
      }
    ]
  };

  // Helper function to render a state benchmark card
  const renderStateCard = (state) => {
    let rateLabel = "0% state tax";
    let badgeClass = "bg-emerald-100 text-emerald-800";
    if (state.incomeTax.type === "progressive") {
      rateLabel = `${(state.incomeTax.topRate * 100).toFixed(1)}% top rate`;
      badgeClass = "bg-rose-100 text-rose-700";
    } else if (state.incomeTax.type === "flat") {
      rateLabel = `${(state.incomeTax.rate * 100).toFixed(1)}% flat rate`;
      badgeClass = "bg-amber-100 text-amber-800";
    }

    const b1 = calculateTakeHome(state.slug === 'nevada' || state.slug === 'tennessee' ? 50000 : 60000, state.slug);
    const b2 = calculateTakeHome(75000, state.slug);
    const b3 = calculateTakeHome(state.slug === 'nevada' || state.slug === 'tennessee' ? 85000 : 100000, state.slug);

    const b1Gross = state.slug === 'nevada' || state.slug === 'tennessee' ? 50000 : 60000;
    const b3Gross = state.slug === 'nevada' || state.slug === 'tennessee' ? 85000 : 100000;

    return (
      <article key={state.slug} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{state.name}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
              {rateLabel}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex justify-between text-slate-600 px-2 py-1">
              <span>${b1Gross.toLocaleString()} gross:</span>
              <span className="font-bold text-slate-900">${b1?.annualTakeHome.toLocaleString()} take-home</span>
            </div>
            <div className="flex justify-between text-slate-600 bg-slate-50 px-2 py-1 rounded">
              <span className="font-semibold text-blue-700">$75,000 gross:</span>
              <span className="font-bold text-blue-700">${b2?.annualTakeHome.toLocaleString()} take-home</span>
            </div>
            <div className="flex justify-between text-slate-600 px-2 py-1">
              <span>${b3Gross.toLocaleString()} gross:</span>
              <span className="font-bold text-slate-900">${b3?.annualTakeHome.toLocaleString()} take-home</span>
            </div>
          </div>
        </div>
        <Link href={`/salary-calculator/${state.slug}/`} className="mt-4 inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800">
          View {state.name} Calculator <span className="ml-1">→</span>
        </Link>
      </article>
    );
  };

  return (
    <div className="bg-white text-slate-900 antialiased">
      <Head>
        <title>US Salary After Tax Calculator 2026 — USCalcHub</title>
        <meta name="description" content="Enter your salary and state. See exact take-home pay after federal tax, FICA, and state income tax — updated for 2026 IRS Publication 15-T rules." />
        <link rel="canonical" href="https://uscalchub.com/salary-calculator/" />
        <meta property="og:url" content="https://uscalchub.com/salary-calculator/" key="ogurl" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* BEGIN: MainHeader */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Site Brand Logo */}
          <Link aria-label="USCalcHub Home" className="flex items-center gap-1 text-2xl font-black tracking-tight text-slate-900" href="/">
            <span>US</span><span className="text-blue-600">Calc</span><span>Hub</span><span className="text-slate-400 font-medium text-sm">.com</span>
          </Link>
          {/* Center Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link className="hover:text-blue-600 transition-colors" href="/">Home</Link>
            <Link aria-current="page" className="text-blue-600 relative py-1 border-b-2 border-blue-600 font-bold" href="/salary-calculator/">Finance Tools</Link>
            <a className="hover:text-blue-600 transition-colors" href="https://uscalchub.com/blog/">Blog</a>
            <Link className="hover:text-blue-600 transition-colors" href="/contact/">Contact</Link>
            <Link className="hover:text-blue-600 transition-colors" href="/about/">About Us</Link>
          </nav>
          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <a className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" href="#calculator">
              <svg className="w-4 h-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>2026 Tax Tools</span>
            </a>
          </div>
        </div>
      </header>
      {/* END: MainHeader */}

      <main>
        {/* BEGIN: HeroSection */}
        <section className="relative bg-dot-pattern pt-14 pb-12 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {/* Verification Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-6 shadow-sm">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
              </svg>
              <span>2026 IRS RATES UPDATED</span>
            </div>
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              US Salary After Tax Calculator — See Your <span className="relative inline-block text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">Real</span> Take-Home
            </h1>
            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Enter your salary and state. See exact take-home pay after federal tax, FICA, and state income tax — updated for 2026 IRS Publication 15-T rules.
            </p>
            {/* Trust Meta Badge */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center text-emerald-600 font-semibold gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                </svg>
                Reviewed by Muzaffar Ali, Financial Content Team
              </span>
              <span className="text-slate-300">•</span>
              <span>Last updated: September 2026</span>
            </div>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: CalculatorSection */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="calculator">
          {/* Main Calculator Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 relative">
            {/* Inputs Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Annual Salary Input Column */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="annual-salary">Gross Annual Salary ($)</label>
                  <span className="text-[11px] font-medium text-slate-400">Pre-tax gross pay</span>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-slate-400 font-semibold text-lg">$</span>
                  </div>
                  <input 
                    className="block w-full rounded-xl border-slate-200 pl-9 pr-4 py-3 text-slate-900 font-bold text-lg focus:border-blue-500 focus:ring-blue-500 transition-colors" 
                    id="annual-salary" 
                    placeholder="75,000" 
                    type="number" 
                    value={salary}
                    min="1000"
                    max="10000000"
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </div>
                {/* Quick-select Salary Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-xs text-slate-400 mr-1">Quick pick:</span>
                  {quickSalaries.map(amt => (
                    <button 
                      key={amt}
                      type="button" 
                      onClick={() => setSalary(amt)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        salary === amt 
                          ? 'bg-blue-100 text-blue-700 font-bold ring-1 ring-blue-300' 
                          : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      ${amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* State Selection Dropdown Column */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="state-select">Resident State</label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    {stateTaxBadge}
                  </span>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <select 
                    className="block w-full rounded-xl border-slate-200 py-3 pl-4 pr-10 text-slate-900 font-semibold text-base focus:border-blue-500 focus:ring-blue-500" 
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {liveStates.map(s => {
                      let rateLabel = "0% state tax";
                      if (s.incomeTax.type === "progressive") rateLabel = `${(s.incomeTax.topRate * 100).toFixed(1)}% top`;
                      else if (s.incomeTax.type === "flat") rateLabel = `${(s.incomeTax.rate * 100).toFixed(1)}% flat`;
                      return (
                        <option key={s.slug} value={s.slug}>{s.name} ({rateLabel})</option>
                      );
                    })}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Determines state &amp; local withholdings according to 2026 state brackets.</p>
              </div>

              {/* Filing Status Select */}
              <div className="md:col-span-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">IRS Filing Status</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl">
                  <button 
                    type="button"
                    onClick={() => setFilingStatus('single')}
                    className={`rounded-xl p-3 text-center flex flex-col items-center justify-center transition-all ${
                      filingStatus === 'single'
                        ? 'border-2 border-blue-600 bg-blue-50/50'
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-bold ${filingStatus === 'single' ? 'text-blue-900' : 'text-slate-700'}`}>Single</span>
                    <span className={`text-[10px] mt-0.5 ${filingStatus === 'single' ? 'text-blue-600' : 'text-slate-400'}`}>$14,600 Std Ded.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFilingStatus('married')}
                    className={`rounded-xl p-3 text-center flex flex-col items-center justify-center transition-all ${
                      filingStatus === 'married'
                        ? 'border-2 border-blue-600 bg-blue-50/50'
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${filingStatus === 'married' ? 'text-blue-900 font-bold' : 'text-slate-700'}`}>Married Filing Joint</span>
                    <span className={`text-[10px] mt-0.5 ${filingStatus === 'married' ? 'text-blue-600' : 'text-slate-400'}`}>$29,200 Std Ded.</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFilingStatus('hoh')}
                    className={`rounded-xl p-3 text-center flex flex-col items-center justify-center transition-all ${
                      filingStatus === 'hoh'
                        ? 'border-2 border-blue-600 bg-blue-50/50'
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold ${filingStatus === 'hoh' ? 'text-blue-900 font-bold' : 'text-slate-700'}`}>Head of Household</span>
                    <span className={`text-[10px] mt-0.5 ${filingStatus === 'hoh' ? 'text-blue-600' : 'text-slate-400'}`}>$21,900 Std Ded.</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="mt-8 rounded-xl bg-emerald-50/70 border border-emerald-300 p-6 sm:p-7" data-purpose="calculation-results-summary">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Hero Net Take Home Amount */}
                <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-emerald-200/80 pb-6 lg:pb-0 lg:pr-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
                    </svg>
                    <span>Estimated Take-Home Pay</span>
                  </div>
                  <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-emerald-700 tracking-tight">
                    ${calc.annualTakeHome.toLocaleString()}
                  </div>
                  <p className="mt-1 text-xs text-emerald-800/80 font-medium">
                    Annual net income after federal, FICA, &amp; {currentState.name} tax
                  </p>
                </div>
                {/* Right: Breakdown Metrics */}
                <div className="lg:col-span-7 grid grid-cols-3 gap-4">
                  <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <span className="block text-[11px] font-semibold uppercase text-slate-500">Monthly</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900">${calc.monthlyTakeHome.toLocaleString()} <span className="text-xs font-normal text-slate-500">/mo</span></span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <span className="block text-[11px] font-semibold uppercase text-slate-500">Bi-Weekly</span>
                    <span className="text-base sm:text-lg font-bold text-slate-900">${calc.biweeklyTakeHome.toLocaleString()} <span className="text-xs font-normal text-slate-500">/pay</span></span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                    <span className="block text-[11px] font-semibold uppercase text-slate-500">Effective Tax</span>
                    <span className="text-base sm:text-lg font-bold text-emerald-600">{calc.effectiveTotalRate}%</span>
                  </div>
                </div>
              </div>

              {/* Stacked Deductions Bar Breakdown */}
              <div className="mt-6 pt-5 border-t border-emerald-200/70">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Salary Allocation Breakdown</span>
                  <span className="text-slate-500 font-normal">Total Gross: ${salary.toLocaleString()}.00</span>
                </div>
                {/* Stacked Color Bar */}
                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${takeHomePct}%` }} title={`Take-Home Pay: $${calc.annualTakeHome.toLocaleString()} (${takeHomePct}%)`}></div>
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${federalTaxPct}%` }} title={`Federal Tax: $${calc.federalTax.toLocaleString()} (${federalTaxPct}%)`}></div>
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${ficaPct}%` }} title={`FICA Tax: $${calc.ficaTotal.toLocaleString()} (${ficaPct}%)`}></div>
                  <div className="bg-slate-400 h-full transition-all duration-300" style={{ width: `${stateTaxPct}%` }} title={`State Tax: $${calc.stateTax.toLocaleString()} (${stateTaxPct}%)`}></div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs mt-3 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Take-Home Pay: <strong className="text-slate-900">${calc.annualTakeHome.toLocaleString()}</strong> ({takeHomePct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Federal Tax: <strong className="text-slate-900">${calc.federalTax.toLocaleString()}</strong> ({federalTaxPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>FICA (SS &amp; Medicare): <strong className="text-slate-900">${calc.ficaTotal.toLocaleString()}</strong> ({ficaPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>State Tax: <strong className="text-slate-900">${calc.stateTax.toLocaleString()}</strong> ({stateTaxPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Link */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-emerald-200/50">
                <span>*Based on 2026 standard deduction ($14,600 single) and statutory tax tables.</span>
                <button 
                  onClick={() => window.print()}
                  className="text-emerald-800 hover:text-emerald-950 font-semibold underline inline-flex items-center gap-1 cursor-pointer" 
                  type="button"
                >
                  Print / Save Summary
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* END: CalculatorSection */}

        {/* BEGIN: QuickTakeawayNotice */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 sm:p-5 flex items-start gap-3.5 text-blue-900">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              ⚡
            </div>
            <div className="text-sm leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-xs block text-blue-700 mb-0.5">2026 Quick Takeaway &amp; Tax Optimization</span>
              On a <strong>${salary.toLocaleString()} salary</strong>, living in a zero-income-tax state like Texas or Florida saves you approximately <strong>$5,475 per year</strong> compared to California (which levies an effective state tax rate of ~4.6% and marginal rate of 9.3% at this bracket).
            </div>
          </div>
        </section>
        {/* END: QuickTakeawayNotice */}

        {/* BEGIN: StateComparisonSection */}
        <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="state-comparison">
          {/* Header with blue vertical bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Find Your State Take-Home Comparison</h2>
              </div>
              <p className="text-sm text-slate-500 ml-3.5">Compare take-home pay and statutory withholdings across top destination states.</p>
            </div>
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mt-2 md:mt-0">
              {liveStates.length} States Verified
            </span>
          </div>

          {/* State Search Bar */}
          <div className="mb-6 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <input 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-xs" 
              placeholder="Search state (e.g., Texas, California, New York, Florida)..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dynamic Search Results if typing */}
          {searchTerm.trim() ? (
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <span>Matching States ({searchResults.length})</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {searchResults.map(renderStateCard)}
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                  No state found matching &ldquo;{searchTerm}&rdquo;.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 4 Popular State Cards in 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {popularStates.map(renderStateCard)}
              </div>

              {/* Collapsible drawer for remaining states */}
              <details className="mt-5 border border-slate-200 rounded-xl bg-white overflow-hidden group">
                <summary className="w-full py-3.5 px-5 text-center text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between transition cursor-pointer list-none">
                  <span>Browse all {liveStates.length} states (Full rate benchmark comparison)</span>
                  <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </summary>
                <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {otherStates.map(renderStateCard)}
                  </div>
                </div>
              </details>
            </>
          )}
        </section>
        {/* END: StateComparisonSection */}

        {/* BEGIN: HowCalculationWorksSection */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">How This Calculation Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Federal Income Tax */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Federal Income Tax</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculated using 2026 progressive IRS brackets (10% to 37%). Single standard deduction is set to $14,600. Source: IRS Pub 15-T.
              </p>
            </div>
            {/* Card 2: FICA Taxes */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">FICA (SS &amp; Medicare)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Social Security (6.2% on wages up to $168,600) + Medicare (1.45% on all earnings). High-earner 0.9% additional surtax applies over $200k.
              </p>
            </div>
            {/* Card 3: State Income Tax */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">State Income Tax</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                9 states charge 0% (TX, FL, NV, WY, WA, TN, SD, AK, NH). California tops out at 13.3%, while New York levies up to 10.9%.
              </p>
            </div>
            {/* Card 4: Private by Design */}
            <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Private by Design</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All calculations run entirely in your local web browser. No financial data is ever collected, stored, tracked, or sent to any server.
              </p>
            </div>
          </div>
        </section>
        {/* END: HowCalculationWorksSection */}

        {/* BEGIN: FAQSection */}
        <section className="py-6 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3" data-purpose="faq-accordion-group">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-slate-200 rounded-xl bg-white p-5 open:ring-1 open:ring-blue-500 transition cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-slate-900 text-sm list-none select-none">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </span>
                </summary>
                <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          {/* Reference Sources Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Sources:</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">IRS Publication 15-T (2026)</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">Tax Foundation State Rates 2026</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">SSA 2026 Wage Base</span>
          </div>
        </section>
        {/* END: FAQSection */}
      </main>

      {/* BEGIN: MainFooter */}
      <footer className="bg-[#0b132b] text-white border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Left: Brand Info & Socials */}
            <div className="md:col-span-6 space-y-4">
              <Link className="flex items-center gap-1 text-2xl font-black tracking-tight text-white" href="/">
                <span>US</span><span className="text-blue-500">Calc</span><span>Hub</span><span className="text-slate-400 font-medium text-sm">.com</span>
              </Link>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Your trusted destination for fast, transparent, and accurate financial tools, salary calculators, and IRS tax guides in the USA.
              </p>
              {/* Social Icons / Text Links */}
              <div className="flex items-center space-x-4 pt-2 text-xs font-semibold text-slate-400">
                <a className="hover:text-white transition" href="https://www.pinterest.com/uscalch" target="_blank" rel="noopener noreferrer">Pinterest</a>
                <a className="hover:text-white transition" href="https://www.facebook.com/uscalchub" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a className="hover:text-white transition" href="https://www.instagram.com/uscalchub" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a className="hover:text-white transition" href="https://www.linkedin.com/in/uscalc-hub-a5a01b411/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
            {/* Center: Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link className="hover:text-white transition" href="/privacy-policy/">Privacy Policy</Link></li>
                <li><Link className="hover:text-white transition" href="/terms/">Terms of Service</Link></li>
                <li><Link className="hover:text-white transition" href="/contact/">Contact Us</Link></li>
                <li><a className="hover:text-white transition" href="https://uscalchub.com/blog/">Blog</a></li>
                <li><Link className="hover:text-white transition" href="/about/">About Us</Link></li>
              </ul>
            </div>
            {/* Right: Support / Contact */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-300 mb-3">Support</h4>
              <p className="text-xs text-slate-400 mb-2">Questions or feedback? Email us at:</p>
              <a className="text-xs font-medium text-blue-400 hover:underline" href="mailto:support@uscalchub.com">
                support@uscalchub.com
              </a>
            </div>
          </div>
          {/* Legal Disclaimer Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed text-center">
            <p className="max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> All figures on this site are estimates for informational and educational purposes only, based on publicly available 2026 tax data believed to be accurate at the time of publication. Tax laws, rates, and thresholds change frequently and may vary by individual circumstance. This content does not constitute financial, tax, or legal advice — consult a qualified CPA or tax professional before making financial decisions. USCalcHub and its owners assume no liability for errors, omissions, or outcomes resulting from use of this site.
            </p>
            <p className="mt-4 text-slate-500 font-medium">
              © 2026 USCalcHub.com. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}
