// components/SalaryCalculatorPage.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { calculateTakeHome, TAX_DATA, SALARY_CONFIG } from '../lib/taxData';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SalaryCalculatorPage({
  state, amount, stateData, salaryConfig,
  calculation: initialCalc, comparisonData, h1
}) {
  const [salary, setSalary] = useState(salaryConfig.amount);
  const [calc, setCalc] = useState(initialCalc);
  const [includeNYC, setIncludeNYC] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const result = calculateTakeHome(salary, state);
    if (result) setCalc(result);
  }, [salary, state]);

  // Enhanced Modern Chart Rendering
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
                : s.color + '40' // Softer opacity for non-active states
            ),
            borderRadius: 6,
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
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              padding: 12,
              titleFont: { size: 14, family: 'Inter' },
              bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
              callbacks: {
                label: (ctx) => ` $${ctx.parsed.x.toLocaleString()} Net Pay`
              }
            }
          },
          scales: {
            x: {
              ticks: { callback: (v) => '$' + Math.round(v / 1000) + 'k', font: { family: 'Inter' } },
              grid: { color: '#f8fafc' }
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: 'Inter', weight: '600' } }
            }
          }
        }
      });
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [salary, state, stateData.name]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
      
      <Navbar />

      <main className="flex-grow w-full">
        
        {/* PREMIUM HERO SECTION FOR CHILD PAGES */}
        <div className="bg-slate-900 pt-16 pb-24 px-4 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10">
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full"><path d="M0 100 L100 0 L100 100 Z" fill="url(#hero-gradient)"/></svg>
             <defs><linearGradient id="hero-gradient"><stop stopColor="#3B82F6"/><stop offset="1" stopColor="#1E3A8A"/></linearGradient></defs>
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Breadcrumb - Light Version */}
            <nav className="text-xs text-slate-300 mb-8 flex gap-2 flex-wrap items-center">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>›</span>
              <Link href="/salary-calculator/" className="hover:text-white transition-colors">Salary Calculator</Link>
              <span>›</span>
              <span className="text-white font-medium capitalize">{stateData.name}</span>
              <span>›</span>
              <span className="text-white font-bold">{salaryConfig.display}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {h1}
            </h1>
            <p className="text-slate-300 text-lg flex items-center gap-2">
              <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Updated for 2026</span>
              Based on official IRS & State Tax Brackets
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20 pb-16">
          
          {/* MAIN CALCULATOR WIDGET (Modern Glassmorphism Style) */}
          <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 mb-10">
            <div className="flex flex-col md:flex-row gap-8 items-center border-b border-slate-100 pb-8 mb-8">
              
              {/* Input Area */}
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Gross Annual Salary
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-4 text-slate-900 font-black text-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    min="1000"
                    max="10000000"
                  />
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <div className="px-4 py-3 bg-slate-100 rounded-xl text-slate-700 font-bold flex items-center gap-2 w-full">
                     <span className="text-2xl">{stateData.flag}</span>
                     {stateData.name} State Tax Applied
                  </div>
                </div>

                {state === 'new-york' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3 cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setIncludeNYC(!includeNYC)}>
                    <input type="checkbox" checked={includeNYC} onChange={() => {}} className="mt-1 w-5 h-5 accent-purple-600 rounded cursor-pointer" />
                    <div>
                      <p className="text-sm font-bold text-purple-900">I live in New York City</p>
                      <p className="text-xs text-purple-700 mt-1">Apply the additional 3.876% NYC resident tax.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight Result Area */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
                <p className="text-blue-100 font-semibold uppercase tracking-widest text-sm mb-2 relative z-10">Estimated Take-Home Pay</p>
                <p className="text-5xl font-black mb-2 relative z-10">${calc.annualTakeHome.toLocaleString()}<span className="text-xl font-medium text-blue-200">/yr</span></p>
                <p className="text-xl text-blue-100 font-medium relative z-10">or ${calc.monthlyTakeHome.toLocaleString()} / month</p>
                
                {stateData.stateTaxRate === 0 && (
                   <div className="mt-6 inline-block bg-green-400/20 border border-green-400/30 text-green-100 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm relative z-10">
                     ✨ You save 100% on State Income Tax!
                   </div>
                )}
              </div>
            </div>

            {/* Detailed Breakdown Table */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Detailed 2026 Tax Breakdown
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="p-4 font-bold">Deduction Type</th>
                      <th className="p-4 font-bold">Rate</th>
                      <th className="p-4 font-bold text-right">Annual Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Federal Income Tax</td>
                      <td className="p-4 text-slate-500">{calc.effectiveFederalRate}% eff.</td>
                      <td className="p-4 text-red-500 font-bold text-right">−${calc.federalTax.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Social Security (FICA)</td>
                      <td className="p-4 text-slate-500">6.2%</td>
                      <td className="p-4 text-red-500 font-bold text-right">−${calc.socialSecurity.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">Medicare</td>
                      <td className="p-4 text-slate-500">1.45%</td>
                      <td className="p-4 text-red-500 font-bold text-right">−${calc.medicare.toLocaleString()}</td>
                    </tr>
                    
                    {calc.stateTax > 0 ? (
                      <tr className="bg-red-50/50 hover:bg-red-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{stateData.name} State Tax</td>
                        <td className="p-4 text-slate-600 font-medium">{calc.effectiveStateRate}% eff.</td>
                        <td className="p-4 text-red-600 font-bold text-right">−${calc.stateTax.toLocaleString()}</td>
                      </tr>
                    ) : (
                      <tr className="bg-green-50/50 hover:bg-green-50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{stateData.name} State Tax</td>
                        <td className="p-4 text-green-600 font-bold">0%</td>
                        <td className="p-4 text-green-600 font-bold text-right">$0</td>
                      </tr>
                    )}

                    {calc.sdi > 0 && (
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-700">CA SDI (Disability)</td>
                        <td className="p-4 text-slate-500">0.9%</td>
                        <td className="p-4 text-red-500 font-bold text-right">−${calc.sdi.toLocaleString()}</td>
                      </tr>
                    )}

                    {state === 'new-york' && includeNYC && (
                      <tr className="bg-purple-50/50 hover:bg-purple-50 transition-colors">
                        <td className="p-4 font-bold text-purple-900">NYC City Tax</td>
                        <td className="p-4 text-purple-700 font-medium">3.876%</td>
                        <td className="p-4 text-purple-700 font-bold text-right">−${Math.round(salary * 0.03876).toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-800 text-white">
                    <tr>
                      <td className="p-4 font-black text-lg">Total Take-Home</td>
                      <td className="p-4 font-medium text-slate-300">{calc.effectiveTotalRate}% Total Tax</td>
                      <td className="p-4 font-black text-xl text-green-400 text-right">${calc.annualTakeHome.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>

          {/* VISUAL CHART SECTION */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-10">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">State-by-State Comparison</h2>
                  <p className="text-slate-500 text-sm">See how your ${salary.toLocaleString()} salary fares in other states.</p>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span> You are viewing {stateData.name}
                </div>
             </div>
             
             <div className="w-full" style={{ height: '320px' }}>
                <canvas ref={chartRef} />
             </div>
          </section>

          {/* EXPLORE MORE (Internal Linking Grid) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>💰</span> Other Salaries in {stateData.name}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(SALARY_CONFIG).filter(a => a !== amount).map(a => (
                    <Link key={a} href={`/salary-calculator/${state}/${a}/`} className="bg-white rounded-xl p-3 text-center border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all font-bold text-slate-700">
                      {SALARY_CONFIG[a].display}
                    </Link>
                  ))}
                </div>
             </div>
             <div className="bg-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🗺️</span> Compare Other States
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(TAX_DATA).filter(s => s !== state).slice(0,4).map(s => (
                    <Link key={s} href={`/salary-calculator/${s}/${amount}/`} className="bg-white rounded-xl p-3 text-center border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all font-bold text-slate-700">
                      {TAX_DATA[s].flag} {TAX_DATA[s].name}
                    </Link>
                  ))}
                </div>
             </div>
          </section>

        </div>
      </main>

      <Footer />

    </div>
  );
}
