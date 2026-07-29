// components/SalaryCalculatorPage.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateTakeHome } from '../lib/taxData';
import Navbar from './Navbar';
import Footer from './Footer';
import QuickAnswerBox from './QuickAnswerBox';
import BreakdownTable from './BreakdownTable';
import ComparisonChart from './ComparisonChart';
import InternalLinks from './InternalLinks';
import HowItWorksGrid from './HowItWorksGrid';
import FAQAccordion from './FAQAccordion';
import ReferenceChips from './ReferenceChips';

export default function SalaryCalculatorPage({
  state, amount, stateData, salaryConfig,
  calculation: initialCalc, comparisonData, h1
}) {
  const [salary, setSalary] = useState(salaryConfig.amount);
  const [calc, setCalc] = useState(initialCalc);
  const [includeNYC, setIncludeNYC] = useState(false);

  useEffect(() => {
    const result = calculateTakeHome(salary, state);
    if (result) setCalc(result);
  }, [salary, state]);

  // Handle NYC tax logic for the UI view
  const nycTax = (state === 'new-york' && includeNYC) ? Math.round(salary * 0.03876) : 0;
  const currentAnnualTakeHome = calc.annualTakeHome - nycTax;
  const currentMonthlyTakeHome = Math.round(currentAnnualTakeHome / 12);
  const currentBiweeklyTakeHome = Math.round(currentAnnualTakeHome / 26);

  const isNoTax = stateData.stateTaxRate === 0;

  // Generate dynamic FAQs
  const diffVsCA = comparisonData.find(c => c.slug === 'california') 
    ? Math.abs(currentAnnualTakeHome - comparisonData.find(c => c.slug === 'california').annualTakeHome) 
    : 0;
  const diffVsTX = comparisonData.find(c => c.slug === 'texas')
    ? Math.abs(currentAnnualTakeHome - comparisonData.find(c => c.slug === 'texas').annualTakeHome)
    : 0;

  const faqs = [
    {
      q: `How much is ${salaryConfig.display} after taxes in ${stateData.name} per month?`,
      a: `A ${salaryConfig.display} annual salary in ${stateData.name} yields approximately $${currentMonthlyTakeHome.toLocaleString()} per month ($${currentAnnualTakeHome.toLocaleString()}/year) after federal income tax and FICA. ${isNoTax ? `${stateData.name} charges zero state income tax.` : ''}`
    },
    {
      q: `Does ${stateData.name} take state income tax from my paycheck?`,
      a: isNoTax 
        ? `No. ${stateData.name} has zero state income tax. Only federal income tax and FICA are deducted from your paycheck in ${stateData.name}.`
        : `Yes. ${stateData.name} applies a ${stateData.stateTaxType} state income tax. On ${salaryConfig.display}, the effective state rate is ${calc.effectiveStateRate}%, totaling $${calc.stateTax.toLocaleString()} annually.`
    },
    {
      q: isNoTax 
        ? `How much more do I keep in ${stateData.name} vs California on ${salaryConfig.display}?`
        : `How much more would I take home in Texas vs ${stateData.name} on ${salaryConfig.display}?`,
      a: isNoTax
        ? `On a ${salaryConfig.display} salary, residents of ${stateData.name} take home approximately $${diffVsCA.toLocaleString()} more per year than California residents due to the lack of state income tax.`
        : `If you moved from ${stateData.name} to Texas (which has no state income tax), you would keep approximately $${diffVsTX.toLocaleString()} more of your ${salaryConfig.display} salary each year.`
    }
  ];

  let topRate = 0;
  if (stateData.brackets && stateData.brackets.length > 0) {
    topRate = stateData.brackets[stateData.brackets.length - 1].rate * 100;
  }

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-3xl mx-auto border-x border-slate-100">
        
        {/* HERO SECTION */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-5 pb-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-[10px] flex-wrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-300">›</span>
            <Link href="/salary-calculator/" className="hover:text-blue-600 transition-colors">Salary calculator</Link>
            <span className="text-slate-300">›</span>
            <Link href={`/salary-calculator/${state}/75k/`} className="hover:text-blue-600 transition-colors capitalize">{stateData.name}</Link>
            <span className="text-slate-300">›</span>
            <span className="text-slate-600 font-medium">{salaryConfig.display}</span>
          </div>

          {/* H1 */}
          <h1 className="text-[20px] font-medium text-slate-900 mb-1 leading-[1.3]">
            {h1}
          </h1>

          {/* Byline */}
          <div className="text-[11px] text-slate-400 flex items-center gap-[5px] flex-wrap mt-1">
            <i className="ti ti-circle-check text-green-500 text-[12px]"></i>
            Reviewed by Muzaffar Ali · July 2026 ·
            <a href="https://www.irs.gov/taxtopics/tc751" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">IRS Publication 15-T</a>
            ·
            <a href="https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tax Foundation 2026</a>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* QUICK ANSWER BOX */}
          <QuickAnswerBox 
            stateData={stateData} 
            salaryConfig={salaryConfig} 
            calculation={{...calc, annualTakeHome: currentAnnualTakeHome, monthlyTakeHome: currentMonthlyTakeHome}} 
            comparisonData={comparisonData} 
          />

          {/* INTERACTIVE CALCULATOR CARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-[14px]">
            <div className="text-[13px] font-medium text-slate-900 mb-3 flex items-center gap-[6px]">
              <i className="ti ti-calculator text-[15px] text-blue-600"></i>
              Adjust your salary
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px] block">
                  Annual salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[15px]">$</span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-3 py-[9px] text-[15px] font-medium text-slate-900 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1000"
                    max="10000000"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px] block">
                  State
                </label>
                {isNoTax ? (
                  <div className="bg-green-50 border border-green-300 rounded-lg px-3 py-[9px] text-[12px] text-green-700 font-medium flex items-center gap-[6px] h-[40px]">
                    <i className="ti ti-circle-check"></i>
                    {stateData.name} — 0% state tax
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-[9px] text-[12px] text-red-600 font-medium h-[40px] flex items-center">
                    {stateData.name} — {topRate.toFixed(1)}% top rate
                  </div>
                )}
              </div>
            </div>

            {state === 'new-york' && (
              <label className="flex items-center gap-3 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200 mb-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={includeNYC} 
                  onChange={() => setIncludeNYC(!includeNYC)} 
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer" 
                />
                <span className="text-[12px] font-medium text-purple-900">
                  I live in New York City — add NYC city tax (3.876% additional)
                </span>
              </label>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="col-span-1 sm:col-span-2 bg-green-50 border-[1.5px] border-green-300 rounded-[10px] px-3 py-[10px] flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
                <div>
                  <div className="text-[10px] text-green-600 uppercase tracking-[0.04em] font-medium mb-[3px]">
                    Annual take-home pay
                  </div>
                  <div className="text-[18px] font-medium text-green-700">
                    ${currentAnnualTakeHome.toLocaleString()}
                  </div>
                </div>
                <div className="text-[11px] text-green-600">/ year</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-[10px]">
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px]">
                  Monthly
                </div>
                <div className="text-[16px] font-medium text-slate-900">
                  ${currentMonthlyTakeHome.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-[2px]">per month</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-[10px]">
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.04em] font-medium mb-[3px]">
                  Biweekly paycheck
                </div>
                <div className="text-[16px] font-medium text-slate-900">
                  ${currentBiweeklyTakeHome.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-[2px]">every 2 weeks</div>
              </div>
            </div>
          </div>

          {/* TAX BREAKDOWN TABLE */}
          <BreakdownTable 
            gross={salary}
            calc={calc}
            stateData={stateData}
            includeNYC={includeNYC}
          />

          {/* STATE COMPARISON CHART */}
          <ComparisonChart 
            salary={salary}
            currentStateSlug={state}
            currentTakeHome={currentAnnualTakeHome}
          />

          {/* INTERNAL LINKS */}
          <InternalLinks 
            stateData={stateData}
            salary={salary}
            currentAmount={amount}
            currentTakeHome={currentAnnualTakeHome}
          />

        </div>

        {/* HOW IT WORKS */}
        <HowItWorksGrid 
          isChildPage={true} 
          stateData={stateData} 
          salaryConfig={salaryConfig} 
          comparisonData={comparisonData}
        />

        {/* FAQ */}
        <FAQAccordion faqs={faqs} isChildPage={true} />

        {/* REFERENCE CHIPS */}
        <div className="px-6 pb-6">
          <ReferenceChips isChildPage={true} stateData={stateData} />
        </div>

      </main>

      <Footer />
    </div>
  );
}
