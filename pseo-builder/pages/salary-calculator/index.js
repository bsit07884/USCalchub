import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StateCard from '../../components/StateCard';
import HowItWorksGrid from '../../components/HowItWorksGrid';
import FAQAccordion from '../../components/FAQAccordion';
import ReferenceChips from '../../components/ReferenceChips';
import { calculateTakeHome, TAX_DATA } from '../../lib/taxData';

export default function SalaryCalculatorHub() {
  const [salary, setSalary] = useState(75000);
  const [selectedState, setSelectedState] = useState('texas');
  
  const calc = calculateTakeHome(salary, selectedState) || {
    annualTakeHome: 0,
    monthlyTakeHome: 0,
    biweeklyTakeHome: 0
  };

  const faqs = [
    {
      q: "Which state has the highest take-home pay on a $75,000 salary?",
      a: "Texas, Florida, Nevada, and Wyoming — all with zero state income tax — give the highest take-home at approximately $60,900/year on a $75,000 salary in 2026."
    },
    {
      q: "How much less do I take home in California vs Texas?",
      a: "On a $75,000 salary, California residents take home approximately $5,475 less per year than Texas residents due to California's 9.3% state income tax rate at that income level."
    },
    {
      q: "Are these figures accurate for 2026?",
      a: "Yes. All federal brackets use 2026 IRS Publication 15-T rates and the $14,600 standard deduction. State rates are sourced from Tax Foundation 2026 data, updated for states that cut rates effective January 1, 2026."
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
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free US salary after-tax calculator covering Texas, Florida, California, and New York with 2026 IRS federal tax rates, state income tax, and FICA deductions.",
        "author": { "@type": "Organization", "name": "USCalcHub", "url": "https://uscalchub.com" },
        "featureList": ["All 4 pilot states", "2026 IRS rates", "FICA calculation", "State income tax", "Monthly and biweekly breakdown", "Free, no signup"]
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

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <Head>
        <title>US Salary After Tax Calculator 2026 | USCalcHub</title>
        <meta name="description" content="Free US salary after-tax calculator for Texas, Florida, California, New York. See your exact take-home pay updated for 2026 IRS rates." />
        <link rel="canonical" href="https://uscalchub.com/salary-calculator/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <Navbar />

      <main className="flex-grow w-full max-w-5xl mx-auto border-x border-slate-100">
        
        {/* SECTION 2: Hero with embedded calculator */}
        <section className="bg-slate-50 border-b border-slate-200 px-6 pt-8 pb-6">
          {/* Row 1 — eyebrow badge */}
          <span className="inline-flex items-center gap-[5px] bg-blue-50 text-blue-600 text-[10px] font-medium px-[10px] py-[3px] rounded-full uppercase tracking-[0.04em] mb-3">
            <i className="ti ti-calendar text-[10px]"></i>
            2026 IRS rates updated
          </span>

          {/* Row 2 — H1 */}
          <h1 className="text-[22px] font-medium text-slate-900 leading-[1.3] max-w-[440px] mb-[6px]">
            US salary after tax calculator — see your <em className="text-blue-600 not-italic">real</em> take-home
          </h1>

          {/* Row 3 — subtitle */}
          <p className="text-[13px] text-slate-500 leading-[1.5] max-w-[400px] mb-[18px]">
            Enter your salary and state. See exact take-home pay after federal tax, FICA, and state income tax — updated for 2026.
          </p>

          {/* Row 4 — Mini calculator card */}
          <div className="bg-white border border-slate-200 rounded-xl p-[14px] max-w-[460px]">
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px] block">
                  Annual salary
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-medium text-slate-900 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  min="1000"
                  max="10000000"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px] block">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-600 w-full focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="texas">Texas (0% state tax)</option>
                  <option value="florida">Florida (0% state tax)</option>
                  <option value="california">California (13.3% top)</option>
                  <option value="new-york">New York (10.9% top)</option>
                </select>
              </div>
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg px-3 py-[10px] flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-2 sm:gap-0">
              <div>
                <div className="text-[11px] text-green-600 flex items-center gap-1">
                  <i className="ti ti-check text-[11px]"></i>
                  Estimated take-home
                </div>
                <div className="text-[20px] font-medium text-green-700">
                  ${calc.annualTakeHome.toLocaleString()}
                </div>
              </div>
              <div className="sm:text-right flex gap-3 sm:block">
                <div className="text-[11px] text-green-600">${calc.monthlyTakeHome.toLocaleString()}/mo</div>
                <div className="text-[11px] text-green-600">${calc.biweeklyTakeHome.toLocaleString()}/biweekly</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: State cards grid */}
        <section className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-[14px]">
            <h2 className="text-[15px] font-medium text-slate-900">
              Browse by state and salary
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 sm:mt-0">
              Click any row for full breakdown and FAQ
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            {Object.values(TAX_DATA).map(state => (
              <StateCard key={state.slug} state={state} />
            ))}
          </div>
        </section>

        {/* SECTION 4: How this works */}
        <HowItWorksGrid isChildPage={false} />

        {/* SECTION 5: FAQ */}
        <FAQAccordion faqs={faqs} isChildPage={false} />

        {/* SECTION 6: Reference chips */}
        <ReferenceChips isChildPage={false} />

      </main>

      <Footer />
    </div>
  );
}
