import Link from 'next/link';
import { calculateTakeHome, TAX_DATA, SALARY_CONFIG } from '../lib/taxData';

export default function InternalLinks({ stateData, salary, currentAmount, currentTakeHome }) {
  // If the user's custom salary matches a preset amount string (like "75k"), we use its config display.
  // Otherwise, we format their custom salary.
  let currentSalaryDisplay = `$${salary.toLocaleString()}`;
  if (currentAmount && SALARY_CONFIG[currentAmount] && SALARY_CONFIG[currentAmount].amount === salary) {
    currentSalaryDisplay = SALARY_CONFIG[currentAmount].display;
  }

  return (
    <>
      {/* Other salaries in this state */}
      <div className="mb-[14px]">
        <h3 className="text-[13px] font-medium text-slate-900 mb-2">
          Other salaries in {stateData.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.keys(SALARY_CONFIG).map(a => {
            const config = SALARY_CONFIG[a];
            const isCurrentPageAmount = a === currentAmount;
            
            // For the button corresponding to the current page, show the custom entered salary
            const targetAmount = isCurrentPageAmount ? salary : config.amount;
            const targetDisplay = isCurrentPageAmount ? currentSalaryDisplay : config.display;
            const calc = calculateTakeHome(targetAmount, stateData.slug);
            
            return (
              <Link key={a} href={`/salary-calculator/${stateData.slug}/${a}/`}
                className={`bg-white border rounded-[10px] px-3 py-[10px] transition-all hover:border-slate-400 block ${isCurrentPageAmount ? 'border-blue-400 bg-blue-50' : 'border-slate-200 cursor-pointer'}`}
              >
                <div className={`text-[13px] font-medium ${isCurrentPageAmount ? 'text-blue-600' : 'text-slate-900'}`}>
                  {targetDisplay}
                </div>
                <div className="text-[11px] text-green-600 mt-[3px]">
                  ${calc.annualTakeHome.toLocaleString()}/yr
                </div>
                <div className="text-[10px] text-slate-400 mt-[1px]">
                  {isCurrentPageAmount ? 'Current page' : `in ${stateData.name}`}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Same salary in other states */}
      <div className="mb-4">
        <h3 className="text-[13px] font-medium text-slate-900 mb-2">
          {currentSalaryDisplay} in other states
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.keys(TAX_DATA)
            .filter(s => s !== stateData.slug)
            .map(s => {
              const otherState = TAX_DATA[s];
              const calc = calculateTakeHome(salary, s);
              const isHigher = calc.annualTakeHome > currentTakeHome;
              const diff = Math.abs(calc.annualTakeHome - currentTakeHome);
              
              return (
                <Link key={s} href={`/salary-calculator/${s}/${currentAmount}/`}
                  className="bg-white border border-slate-200 rounded-[10px] px-3 py-[10px] transition-colors hover:border-slate-400 cursor-pointer block"
                >
                  <div className="text-[12px] font-medium text-slate-900">
                    {otherState.flag} {otherState.name}
                  </div>
                  <div className={`text-[13px] font-medium mt-[3px] ${isHigher ? 'text-green-600' : 'text-red-500'}`}>
                    ${calc.annualTakeHome.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-[1px]">
                    {isHigher ? '+' : '-'}${diff.toLocaleString()} vs {stateData.abbreviation}
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    </>
  );
}
