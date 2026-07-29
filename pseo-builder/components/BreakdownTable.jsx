export default function BreakdownTable({ 
  gross, 
  calc, 
  stateData, 
  includeNYC 
}) {
  const getWidth = (amount) => `${(amount / gross) * 100}%`;
  
  const nycTax = (stateData.slug === 'new-york' && includeNYC) 
    ? Math.round(gross * 0.03876) 
    : 0;

  const actualTakeHome = calc.annualTakeHome - nycTax;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-[14px]">
      <div className="px-[14px] py-[10px] text-[12px] font-medium text-slate-900 border-b border-slate-100">
        Detailed 2026 tax breakdown
      </div>
      
      {/* Gross salary row */}
      <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
        <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-slate-300"></div>
        <div className="text-[12px] font-medium text-slate-900 flex-1">Gross salary</div>
        <div className="text-[11px] text-slate-400 w-[60px] text-right">—</div>
        <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-slate-200" style={{ width: '100%' }}></div>
        </div>
        <div className="text-[12px] font-medium w-[80px] text-right text-slate-900">
          ${gross.toLocaleString()}
        </div>
      </div>

      {/* Federal income tax */}
      <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
        <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-red-400"></div>
        <div className="text-[12px] text-slate-500 flex-1">Federal income tax</div>
        <div className="text-[11px] text-slate-400 w-[60px] text-right">{calc.effectiveFederalRate}% eff.</div>
        <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-red-400" style={{ width: getWidth(calc.federalTax) }}></div>
        </div>
        <div className="text-[12px] font-medium w-[80px] text-right text-red-500">
          −${calc.federalTax.toLocaleString()}
        </div>
      </div>

      {/* Social Security */}
      <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
        <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-amber-400"></div>
        <div className="text-[12px] text-slate-500 flex-1">Social Security</div>
        <div className="text-[11px] text-slate-400 w-[60px] text-right">6.2%</div>
        <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-amber-400" style={{ width: getWidth(calc.socialSecurity) }}></div>
        </div>
        <div className="text-[12px] font-medium w-[80px] text-right text-amber-600">
          −${calc.socialSecurity.toLocaleString()}
        </div>
      </div>

      {/* Medicare */}
      <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
        <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-amber-300"></div>
        <div className="text-[12px] text-slate-500 flex-1">Medicare</div>
        <div className="text-[11px] text-slate-400 w-[60px] text-right">1.45%</div>
        <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-amber-300" style={{ width: getWidth(calc.medicare) }}></div>
        </div>
        <div className="text-[12px] font-medium w-[80px] text-right text-amber-500">
          −${calc.medicare.toLocaleString()}
        </div>
      </div>

      {/* State Tax */}
      {calc.stateTax === 0 ? (
        <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
          <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-green-500"></div>
          <div className="text-[12px] text-slate-500 flex-1">{stateData.name} state tax</div>
          <div className="text-[11px] font-medium text-green-600 w-[60px] text-right">0%</div>
          <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
          <div className="text-[12px] font-medium w-[80px] text-right text-green-600">
            $0
          </div>
        </div>
      ) : (
        <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
          <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-red-500"></div>
          <div className="text-[12px] text-slate-500 flex-1">{stateData.name} state tax</div>
          <div className="text-[11px] text-slate-400 w-[60px] text-right">{calc.effectiveStateRate}% eff.</div>
          <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full bg-red-500" style={{ width: getWidth(calc.stateTax) }}></div>
          </div>
          <div className="text-[12px] font-medium w-[80px] text-right text-red-600">
            −${calc.stateTax.toLocaleString()}
          </div>
        </div>
      )}

      {/* SDI (California only) */}
      {calc.sdi > 0 && (
        <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
          <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-red-600"></div>
          <div className="text-[12px] text-slate-500 flex-1">CA SDI (Disability Insurance)</div>
          <div className="text-[11px] text-slate-400 w-[60px] text-right">0.9%</div>
          <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full bg-red-600" style={{ width: getWidth(calc.sdi) }}></div>
          </div>
          <div className="text-[12px] font-medium w-[80px] text-right text-red-700">
            −${calc.sdi.toLocaleString()}
          </div>
        </div>
      )}

      {/* NYC Tax */}
      {nycTax > 0 && (
        <div className="flex items-center px-[14px] py-2 border-b border-slate-100">
          <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-purple-500"></div>
          <div className="text-[12px] text-slate-500 flex-1">NYC city income tax</div>
          <div className="text-[11px] text-slate-400 w-[60px] text-right">3.876%</div>
          <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full bg-purple-500" style={{ width: getWidth(nycTax) }}></div>
          </div>
          <div className="text-[12px] font-medium w-[80px] text-right text-purple-600">
            −${nycTax.toLocaleString()}
          </div>
        </div>
      )}

      {/* Final Take Home */}
      <div className="flex items-center px-[14px] py-2 bg-green-50">
        <div className="w-[6px] h-[6px] rounded-full mr-2 flex-shrink-0 bg-green-500"></div>
        <div className="text-[12px] font-medium text-slate-900 flex-1">Take-home pay</div>
        <div className="text-[11px] text-slate-400 w-[60px] text-right">—</div>
        <div className="w-[80px] h-1 bg-slate-100 rounded-full mx-2 overflow-hidden flex-shrink-0">
          <div className="h-full rounded-full bg-green-500" style={{ width: getWidth(actualTakeHome) }}></div>
        </div>
        <div className="text-[13px] font-medium w-[80px] text-right text-green-700">
          ${actualTakeHome.toLocaleString()}/yr
        </div>
      </div>
    </div>
  );
}
