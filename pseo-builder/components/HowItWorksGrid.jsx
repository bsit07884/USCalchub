export default function HowItWorksGrid({ isChildPage, stateData, salaryConfig, comparisonData }) {
  const isNoTax = stateData?.stateTaxRate === 0;

  let diffVsCA = 0;
  if (isChildPage && isNoTax && comparisonData) {
    const caData = comparisonData.find(c => c.slug === 'california');
    if (caData) {
      // Find current state data
      const currentStateData = comparisonData.find(c => c.slug === stateData.slug);
      if (currentStateData) {
        diffVsCA = Math.abs(currentStateData.annualTakeHome - caData.annualTakeHome);
      }
    }
  }

  return (
    <section className={isChildPage ? "mb-[14px]" : "px-6 py-5 border-t border-slate-100"}>
      <h2 className={isChildPage ? "text-[13px] font-medium text-slate-900 mb-2" : "text-[15px] font-medium text-slate-900 mb-[14px]"}>
        How this calculation works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Card 1 */}
        <div className="bg-slate-50 rounded-[10px] p-3">
          <div className="flex items-center gap-2 mb-[5px]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 text-[16px]">
              <i className="ti ti-building-bank"></i>
            </div>
            <h3 className="text-[12px] font-medium text-slate-900 mb-[2px]">Federal income tax</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-[1.5]">
            2026 IRS progressive brackets (10%–37%). Standard deduction $14,600 for single filers. Source: IRS Pub 15-T.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-50 rounded-[10px] p-3">
          <div className="flex items-center gap-2 mb-[5px]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 text-[16px]">
              <i className="ti ti-users"></i>
            </div>
            <h3 className="text-[12px] font-medium text-slate-900 mb-[2px]">FICA — Social Security + Medicare</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-[1.5]">
            Social Security 6.2% on first $168,600. Medicare 1.45% on all income. Additional 0.9% above $200k.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-50 rounded-[10px] p-3">
          <div className="flex items-center gap-2 mb-[5px]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[16px] ${isChildPage && isNoTax ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              <i className={isChildPage && isNoTax ? "ti ti-circle-check" : "ti ti-map-pin"}></i>
            </div>
            <h3 className="text-[12px] font-medium text-slate-900 mb-[2px]">
              {isChildPage && isNoTax ? `${stateData.name} state tax` : 'State income tax'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-[1.5]">
            {isChildPage && isNoTax ? (
              `${stateData.name} charges zero state income tax, saving $${diffVsCA.toLocaleString()}/yr vs California on ${salaryConfig.display} salary.`
            ) : (
              "9 states charge 0% (TX, FL, NV, WY, WA, TN, SD, AK, NH). California tops at 13.3%, New York at 10.9%."
            )}
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-50 rounded-[10px] p-3">
          <div className="flex items-center gap-2 mb-[5px]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 text-[16px]">
              <i className="ti ti-lock"></i>
            </div>
            <h3 className="text-[12px] font-medium text-slate-900 mb-[2px]">Private by design</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-[1.5]">
            All calculations run in your browser. No data stored, no signup required, no ads — ever.
          </p>
        </div>
      </div>
    </section>
  );
}
