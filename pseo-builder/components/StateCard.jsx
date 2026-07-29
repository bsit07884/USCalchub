import Link from 'next/link';
import { calculateTakeHome, SALARY_CONFIG } from '../lib/taxData';

export default function StateCard({ state }) {
  const isNoTax = state.stateTaxRate === 0;
  
  // Get top bracket rate
  let topRate = 0;
  if (state.brackets && state.brackets.length > 0) {
    topRate = state.brackets[state.brackets.length - 1].rate * 100;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors duration-150 hover:border-slate-400">
      
      {/* Card Header */}
      <div className="px-[14px] py-[10px] border-b border-slate-100 flex justify-between items-center">
        <div className="text-[13px] font-medium text-slate-900 flex items-center gap-[6px]">
          <span className="text-[16px]">{state.flag}</span>
          <span>{state.name}</span>
        </div>
        
        {isNoTax ? (
          <span className="text-[10px] bg-green-50 text-green-600 px-2 py-[2px] rounded-full font-medium">
            0% state tax
          </span>
        ) : (
          <span className="text-[10px] bg-red-50 text-red-600 px-2 py-[2px] rounded-full font-medium">
            {topRate.toFixed(1)}% top rate
          </span>
        )}
      </div>

      {/* Salary Rows */}
      <div>
        {Object.keys(SALARY_CONFIG).map(amount => {
          const config = SALARY_CONFIG[amount];
          const calc = calculateTakeHome(config.amount, state.slug);
          const isFeatured = amount === '75k';
          
          return (
            <Link 
              key={amount} 
              href={`/salary-calculator/${state.slug}/${amount}/`}
              className={`flex justify-between items-center px-[14px] py-[7px] border-b border-slate-100 last:border-b-0 transition-colors cursor-pointer ${isFeatured ? 'bg-blue-50 hover:bg-blue-100/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`text-[12px] ${isFeatured ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                {config.display}
              </div>
              <div className="flex items-center gap-[6px]">
                <div className={`text-[12px] font-medium ${isNoTax ? 'text-green-600' : 'text-red-500'}`}>
                  ${calc.annualTakeHome.toLocaleString()}
                </div>
                <i className="ti ti-chevron-right text-[10px] text-slate-300"></i>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Card Footer */}
      <div className="px-[14px] py-[7px] border-t border-slate-100">
        <Link 
          href={`/salary-calculator/${state.slug}/75k/`} // Link to a default child page since there is no state hub yet
          className="text-[11px] text-blue-600 flex items-center justify-center gap-[3px] hover:text-blue-700 transition-colors font-medium"
        >
          View {state.name} calculator <i className="ti ti-arrow-right text-[11px]"></i>
        </Link>
      </div>
    </div>
  );
}
