// pages/salary-calculator/index.js
import Head from 'next/head';
import Link from 'next/link';
import { TAX_DATA, SALARY_CONFIG, calculateTakeHome } from '../../lib/taxData';

export default function SalaryCalculatorHub() {
  return (
    <>
      <Head>
        <title>
          Salary After Tax Calculator by State 2026 — All 50 States | USCalcHub
        </title>
        <meta name="description"
          content="Free salary after-tax calculator for all 50 US states. See exact take-home pay for $60k, $75k, $100k and any salary in Texas, Florida, California, New York — updated for 2026." />
        <link rel="canonical" href="https://uscalchub.com/salary-calculator/" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Salary After Tax Calculator 2026
        </h1>
        <p className="text-slate-600 mb-8">
          Select your state and salary bracket for an instant take-home pay breakdown with full tax deductions.
        </p>

        {Object.values(TAX_DATA).map(state => (
          <div key={state.slug} className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span>{state.flag}</span>
              <span>{state.name}</span>
              {state.stateTaxRate === 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  No State Income Tax
                </span>
              )}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(SALARY_CONFIG).map(([key, config]) => {
                const calc = calculateTakeHome(config.amount, state.slug);
                return (
                  <Link key={key}
                        href={`/salary-calculator/${state.slug}/${key}/`}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-sm transition-all">
                    <p className="font-bold text-slate-800">
                      {config.display}
                    </p>
                    <p className="text-green-700 font-semibold mt-1">
                      ${calc?.annualTakeHome.toLocaleString()}/yr
                    </p>
                    <p className="text-xs text-slate-500">
                      ${calc?.monthlyTakeHome.toLocaleString()}/mo
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
