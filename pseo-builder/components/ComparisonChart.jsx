import { TAX_DATA, calculateTakeHome } from '../lib/taxData';

export default function ComparisonChart({ salary, currentStateSlug, currentTakeHome }) {
  // Generate comparisonData on the fly based on dynamic salary
  const comparisonData = Object.values(TAX_DATA).map(state => {
    const calc = calculateTakeHome(salary, state.slug);
    return {
      slug: state.slug,
      name: state.name,
      flag: state.flag,
      stateTaxRate: state.stateTaxRate,
      annualTakeHome: calc.annualTakeHome
    };
  }).sort((a, b) => b.annualTakeHome - a.annualTakeHome);

  // Max take-home for 100% width reference
  const maxTakeHome = Math.max(...comparisonData.map(c => c.annualTakeHome));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-[14px] mb-[14px]">
      <div className="text-[12px] font-medium text-slate-900 mb-3">
        ${salary.toLocaleString()} - state comparison
      </div>

      <div className="flex gap-3 mb-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div> No state tax
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div> Viewing now
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <div className="w-2 h-2 rounded-full bg-red-100 border border-red-300"></div> High state tax
        </div>
      </div>

      <div className="flex flex-col gap-[7px] max-w-[550px] mx-auto mt-2">
        {comparisonData.map(state => {
          const isCurrent = state.slug === currentStateSlug;
          const isNoTax = state.stateTaxRate === 0;
          const isHighTax = !isNoTax && !isCurrent;
          
          const diff = Math.abs(state.annualTakeHome - currentTakeHome);
          const widthPercent = (state.annualTakeHome / maxTakeHome) * 100;

          // Determine fill color
          let fillClass = "bg-green-100";
          let textClass = "text-green-700 font-medium text-[10px]";
          
          if (isCurrent) {
            fillClass = "bg-blue-500";
            textClass = "text-white font-medium text-[10px]";
          } else if (isHighTax) {
            fillClass = "bg-red-50 border border-red-100";
            textClass = "text-red-500 font-medium text-[10px]";
          }

          return (
            <div key={state.slug} className="flex items-center gap-2">
              <div className={`text-[11px] w-[70px] text-right flex-shrink-0 ${isCurrent ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                {state.flag} {state.name}
              </div>

              <div className={`flex-1 bg-slate-100 rounded-full h-5 overflow-hidden relative ${isCurrent ? 'border-[1.5px] border-blue-500' : ''}`}>
                <div 
                  className={`h-full rounded-full flex items-center px-2 ${fillClass}`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className={textClass}>${(state.annualTakeHome / 1000).toFixed(1)}k/yr</span>
                </div>
              </div>

              <div className="text-[10px] w-[60px] text-right flex-shrink-0">
                {isCurrent && <span className="text-blue-600 font-medium">You</span>}
                {!isCurrent && state.annualTakeHome > currentTakeHome && (
                  <span className="text-green-600">+{'$' + diff.toLocaleString()}</span>
                )}
                {!isCurrent && state.annualTakeHome < currentTakeHome && (
                  <span className="text-red-400">-{'$' + diff.toLocaleString()}</span>
                )}
                {!isCurrent && state.annualTakeHome === currentTakeHome && (
                  <span className="text-slate-400">$0</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
