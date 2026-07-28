// components/SalaryCalculatorPage.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { calculateTakeHome, TAX_DATA, SALARY_CONFIG } from '../lib/taxData';

export default function SalaryCalculatorPage({
  state, amount, stateData, salaryConfig,
  calculation: initialCalc, comparisonData, h1
}) {
  // Pre-filled from SSR data, user can adjust
  const [salary, setSalary] = useState(salaryConfig.amount);
  const [calc, setCalc] = useState(initialCalc);
  const [includeNYC, setIncludeNYC] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Recalculate on salary change
  useEffect(() => {
    const result = calculateTakeHome(salary, state);
    if (result) setCalc(result);
  }, [salary, state]);

  // Render comparison chart
  useEffect(() => {
    if (!chartRef.current || typeof window === 'undefined') return;
    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartInstance.current) chartInstance.current.destroy();

      const comparison = Object.keys(TAX_DATA).map(slug => ({
        name: TAX_DATA[slug].name,
        flag: TAX_DATA[slug].flag,
        takeHome: calculateTakeHome(salary, slug)?.annualTakeHome || 0,
        color: TAX_DATA[slug].color
      })).sort((a, b) => b.takeHome - a.takeHome);

      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: comparison.map(s => `${s.flag} ${s.name}`),
          datasets: [{
            data: comparison.map(s => s.takeHome),
            backgroundColor: comparison.map(s =>
              s.name === stateData.name
                ? s.color
                : s.color + '80'
            ),
            borderRadius: 8,
            borderSkipped: false,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` $${ctx.parsed.x.toLocaleString()}/year take-home`
              }
            }
          },
          scales: {
            x: {
              ticks: {
                callback: (v) =>
                  '$' + Math.round(v / 1000) + 'k',
                font: { size: 11 }
              },
              grid: { color: '#f1f5f9' }
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12, weight: 'bold' } }
            }
          }
        }
      });
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [salary, state, stateData.name]);

  const savings = calc.annualTakeHome -
    (calculateTakeHome(salary, 'california')?.annualTakeHome || 0);
  const savingsVsNY = calc.annualTakeHome -
    (calculateTakeHome(salary, 'new-york')?.annualTakeHome || 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* BREADCRUMB */}
      <nav className="text-xs text-slate-500 mb-6 flex gap-2 flex-wrap items-center">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <Link href="/salary-calculator" className="hover:text-blue-600">Salary Calculator</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium capitalize">
          {stateData.name}
        </span>
        <span>›</span>
        <span className="text-slate-700 font-medium">
          {salaryConfig.display}
        </span>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        {h1}
      </h1>

      {/* REVIEWER BYLINE */}
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-1">
        <span>✓</span>
        Reviewed by Muzaffar Ali, Financial Content Team | Last updated: July 2026 | Source:{" "}
        <a href="https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/"
          target="_blank" rel="noopener"
          className="text-blue-500 hover:underline">
          Tax Foundation 2026
        </a>
      </p>

      {/* QUICK ANSWER BOX */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-8 max-w-2xl">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">⚡ Quick Answer</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          A <strong>{salaryConfig.display} salary in {stateData.name}</strong> yields approximately{" "}
          <strong>
            ${calc.annualTakeHome.toLocaleString()}/year
            (${calc.monthlyTakeHome.toLocaleString()}/month)
          </strong>{" "}
          after federal income tax (${calc.federalTax.toLocaleString()}) and FICA (${calc.ficaTotal.toLocaleString()})
          {stateData.stateTaxRate === 0
            ? ". Texas and Florida charge zero state income tax."
            : `. ${stateData.name} adds $${calc.stateTax.toLocaleString()} in state income tax.`
          }
        </p>
      </div>

      {/* ═══ INTERACTIVE CALCULATOR ═══ */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          {stateData.flag} Adjust Your Salary
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Pre-filled with {salaryConfig.display} in {stateData.name}. Edit to recalculate instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min="1000"
              max="10000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State (pre-selected)
            </label>
            <div className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 text-slate-800 font-semibold">
              {stateData.flag} {stateData.name}
            </div>
          </div>
        </div>

        {/* NYC Option for New York */}
        {state === 'new-york' && (
          <div className="mb-5 flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <input
              type="checkbox"
              id="nycCheck"
              checked={includeNYC}
              onChange={(e) => setIncludeNYC(e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <label htmlFor="nycCheck" className="text-sm text-slate-700">
              I live in <strong>New York City</strong> — add NYC city tax (3.876% additional)
            </label>
          </div>
        )}

        {/* RESULTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Annual Take-Home", value: `$${calc.annualTakeHome.toLocaleString()}`, highlight: true },
            { label: "Monthly Take-Home", value: `$${calc.monthlyTakeHome.toLocaleString()}` },
            { label: "Biweekly Paycheck", value: `$${calc.biweeklyTakeHome.toLocaleString()}` },
            { label: "Effective Tax Rate", value: `${calc.effectiveTotalRate}%` },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl p-4 text-center ${item.highlight ? 'bg-green-50 border-2 border-green-400' : 'bg-slate-50 border border-slate-200'}`}>
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.highlight ? 'text-green-700' : 'text-slate-800'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DETAILED TAX BREAKDOWN TABLE ═══ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Complete 2026 Tax Breakdown
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4 text-left rounded-tl-xl">Tax Component</th>
                <th className="p-4 text-left">Rate</th>
                <th className="p-4 text-left">Annual Amount</th>
                <th className="p-4 text-left rounded-tr-xl">Monthly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-4 font-semibold text-slate-800">Gross Salary</td>
                <td className="p-4 text-slate-500">—</td>
                <td className="p-4 font-bold text-slate-800">${salary.toLocaleString()}</td>
                <td className="p-4 text-slate-600">${Math.round(salary / 12).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100 bg-red-50">
                <td className="p-4 text-slate-700">Federal Income Tax</td>
                <td className="p-4 text-red-600">{calc.effectiveFederalRate}% eff.</td>
                <td className="p-4 text-red-600 font-semibold">−${calc.federalTax.toLocaleString()}</td>
                <td className="p-4 text-red-500">−${Math.round(calc.federalTax / 12).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4 text-slate-700">Social Security</td>
                <td className="p-4 text-slate-500">6.2%</td>
                <td className="p-4 text-red-600 font-semibold">−${calc.socialSecurity.toLocaleString()}</td>
                <td className="p-4 text-red-500">−${Math.round(calc.socialSecurity / 12).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4 text-slate-700">Medicare</td>
                <td className="p-4 text-slate-500">1.45%</td>
                <td className="p-4 text-red-600 font-semibold">−${calc.medicare.toLocaleString()}</td>
                <td className="p-4 text-red-500">−${Math.round(calc.medicare / 12).toLocaleString()}</td>
              </tr>

              {/* State Tax Row — conditional */}
              {calc.stateTax > 0 ? (
                <tr className="border-b border-slate-100 bg-red-50">
                  <td className="p-4 text-slate-700">{stateData.name} State Tax</td>
                  <td className="p-4 text-red-600">{calc.effectiveStateRate}% eff.</td>
                  <td className="p-4 text-red-600 font-semibold">−${calc.stateTax.toLocaleString()}</td>
                  <td className="p-4 text-red-500">−${Math.round(calc.stateTax / 12).toLocaleString()}</td>
                </tr>
              ) : (
                <tr className="border-b border-slate-100 bg-green-50">
                  <td className="p-4 text-slate-700">{stateData.name} State Tax</td>
                  <td className="p-4 text-green-700 font-bold">0%</td>
                  <td className="p-4 text-green-700 font-bold">$0</td>
                  <td className="p-4 text-green-700">$0</td>
                </tr>
              )}

              {/* SDI Row — California only */}
              {calc.sdi > 0 && (
                <tr className="border-b border-slate-100 bg-red-50">
                  <td className="p-4 text-slate-700">CA SDI (Disability)</td>
                  <td className="p-4 text-red-600">0.9%</td>
                  <td className="p-4 text-red-600 font-semibold">−${calc.sdi.toLocaleString()}</td>
                  <td className="p-4 text-red-500">−${Math.round(calc.sdi / 12).toLocaleString()}</td>
                </tr>
              )}

              {/* NYC Row — New York only, if checkbox checked */}
              {state === 'new-york' && includeNYC && (
                <tr className="border-b border-slate-100 bg-purple-50">
                  <td className="p-4 text-slate-700">NYC City Tax</td>
                  <td className="p-4 text-purple-600">3.876%</td>
                  <td className="p-4 text-purple-600 font-semibold">−${Math.round(salary * 0.03876).toLocaleString()}</td>
                  <td className="p-4 text-purple-500">−${Math.round((salary * 0.03876) / 12).toLocaleString()}</td>
                </tr>
              )}

              {/* Take-Home Row */}
              <tr className="bg-green-50">
                <td className="p-4 font-bold text-slate-900 text-base">✅ Total Take-Home Pay</td>
                <td className="p-4">—</td>
                <td className="p-4 font-bold text-green-700 text-base">${calc.annualTakeHome.toLocaleString()}/yr</td>
                <td className="p-4 font-bold text-green-700">${calc.monthlyTakeHome.toLocaleString()}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ COMPARISON CHART ═══ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          ${salary.toLocaleString()} Salary — State Comparison Chart
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          How your take-home changes across our pilot states.
          <strong className="text-slate-700"> {stateData.flag} {stateData.name}</strong> is highlighted.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm" style={{ height: '260px' }}>
          <canvas ref={chartRef} />
        </div>
      </section>

      {/* ═══ SAVINGS CALLOUT (for no-tax states) ═══ */}
      {stateData.stateTaxRate === 0 && savings > 0 && (
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">vs California</p>
              <p className="text-2xl font-bold text-green-800">+${savings.toLocaleString()}/year</p>
              <p className="text-sm text-green-700 mt-1">
                More take-home in {stateData.name} vs California on ${salary.toLocaleString()} salary. That is ${Math.round(savings / 12).toLocaleString()}/month extra.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">vs New York</p>
              <p className="text-2xl font-bold text-green-800">+${savingsVsNY.toLocaleString()}/year</p>
              <p className="text-sm text-green-700 mt-1">
                More take-home in {stateData.name} vs New York. Over 5 years: ${(savingsVsNY * 5).toLocaleString()} difference.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══ HOW THIS WORKS ═══ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">How This Calculation Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Federal Income Tax",
              body: `Calculated using 2026 IRS progressive brackets (10%–37%) after applying the $14,600 standard deduction for single filers. Your effective federal rate on ${salaryConfig.display} is ${calc.effectiveFederalRate}%.`
            },
            {
              title: "FICA (Social Security + Medicare)",
              body: `Social Security: 6.2% on first $168,600. Medicare: 1.45% on all income. Additional 0.9% Medicare on income above $200,000.`
            },
            {
              title: `${stateData.name} State Tax`,
              body: stateData.stateTaxRate === 0
                ? `${stateData.name} charges zero state income tax. This saves you $${calc.stateTax} compared to a state with the national average rate of 4.6%.`
                : `${stateData.name} uses progressive state brackets. On ${salaryConfig.display}, the effective state rate is ${calc.effectiveStateRate}%, totaling $${calc.stateTax.toLocaleString()}.`
            },
            {
              title: "Official Sources",
              body: null,
              links: [
                { href: "https://www.irs.gov/taxtopics/tc751", text: "IRS Publication 15-T (2026) ↗" },
                { href: "https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/", text: "Tax Foundation 2026 State Rates ↗" },
                { href: "https://www.ssa.gov/oact/cola/cbb.html", text: "SSA 2026 Wage Base ↗" }
              ]
            }
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-2">{item.title}</p>
              {item.body && <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>}
              {item.links && (
                <div className="flex flex-col gap-1">
                  {item.links.map(link => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener" className="text-sm text-blue-600 hover:underline">
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ RELATED PAGES (Internal Linking) ═══ */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Explore Other Salary Amounts in {stateData.name}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {Object.keys(SALARY_CONFIG).filter(a => a !== amount).map(a => (
            <Link key={a} href={`/salary-calculator/${state}/${a}`} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <p className="font-bold text-slate-800">{SALARY_CONFIG[a].display}</p>
              <p className="text-xs text-slate-500 mt-1">in {stateData.name}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-4 mt-6">
          {salaryConfig.display} in Other States
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(TAX_DATA).filter(s => s !== state).map(s => {
            const otherCalc = calculateTakeHome(salary, s);
            return (
              <Link key={s} href={`/salary-calculator/${s}/${amount}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <p className="font-bold text-slate-800 text-sm">{TAX_DATA[s].flag} {TAX_DATA[s].name}</p>
                <p className="text-green-700 font-semibold mt-1">${otherCalc?.annualTakeHome.toLocaleString()}</p>
                <p className="text-xs text-slate-500">/year</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ RELATED BLOG ARTICLES ═══ */}
      <section className="mb-8 bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Related Guides</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/blog/top-9-states-with-no-income-tax-2026/" className="text-blue-600 hover:underline text-sm">
              → 9 States With No Income Tax in 2026 — Complete Guide
            </Link>
          </li>
          <li>
            <Link href="/blog/california-vs-texas-salary-tax-calculator/" className="text-blue-600 hover:underline text-sm">
              → California vs Texas Salary Comparison
            </Link>
          </li>
          <li>
            <Link href="/blog/cost-of-living-comparison-city-calculator-2026/" className="text-blue-600 hover:underline text-sm">
              → Cost of Living Comparison by City 2026
            </Link>
          </li>
          <li>
            <Link href="/salary-calculator/" className="text-blue-600 hover:underline text-sm">
              → Full 50-State Salary Calculator
            </Link>
          </li>
        </ul>
      </section>

    </main>
  );
}
