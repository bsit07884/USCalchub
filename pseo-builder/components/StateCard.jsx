import Link from 'next/link';
import { calculateTakeHome, SALARY_CONFIG, isLiveScope } from '../lib/taxData';

export default function StateCard({ state }) {
  const isNoTax = state.incomeTax.type === "none";
  
  // Get top bracket rate
  let topRate = 0;
  if (state.incomeTax.type === "progressive" && state.incomeTax.brackets && state.incomeTax.brackets.length > 0) {
    topRate = state.incomeTax.brackets[state.incomeTax.brackets.length - 1].rate * 100;
  } else if (state.incomeTax.type === "flat") {
    topRate = state.incomeTax.rate * 100;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-blue-200 transition-all overflow-hidden flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <div className="p-5 pb-3 flex items-start justify-between gap-2">
          <div className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>{state.flag}</span>
            <span>{state.name}</span>
          </div>
          
          {isNoTax ? (
            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold whitespace-nowrap">
              0% state tax
            </span>
          ) : (
            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold whitespace-nowrap">
              {topRate.toFixed(1)}% top rate
            </span>
          )}
        </div>

        {/* Salary Rows */}
        <div className="px-5 pb-3">
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/30">
            {Object.keys(SALARY_CONFIG).filter(amount => isLiveScope(state.slug, amount)).map(amount => {
              const config = SALARY_CONFIG[amount];
              const calc = calculateTakeHome(config.amount, state.slug);
              const isFeatured = amount === '75k';
              
              return (
                <Link 
                  key={amount} 
                  href={`/salary-calculator/${state.slug}/${amount}/`}
                  className={`flex justify-between items-center px-4 py-3 transition-colors cursor-pointer ${isFeatured ? 'bg-blue-50/70 hover:bg-blue-100/60' : 'hover:bg-white'}`}
                >
                  <div className={`text-xs ${isFeatured ? 'text-blue-700 font-semibold' : 'text-slate-600 font-medium'}`}>
                    {config.display}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-xs font-semibold ${isNoTax ? 'text-green-600' : 'text-slate-900'}`}>
                      ${calc.annualTakeHome.toLocaleString()}
                    </div>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 mt-2">
        <Link 
          href={`/salary-calculator/${state.slug}/${isLiveScope(state.slug, '75k') ? '75k' : '85k'}/`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View {state.name} 2026 Rules
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
