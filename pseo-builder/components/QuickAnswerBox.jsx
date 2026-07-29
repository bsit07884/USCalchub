export default function QuickAnswerBox({ stateData, salaryConfig, calculation, comparisonData }) {
  const isNoTax = stateData.stateTaxRate === 0;
  
  // Calculate difference vs CA for no-tax states
  const caData = comparisonData.find(c => c.slug === 'california');
  let diffVsCA = 0;
  if (caData) {
    diffVsCA = Math.abs(calculation.annualTakeHome - caData.annualTakeHome);
  }

  return (
    <div className="bg-blue-50 border-l-[3px] border-blue-500 rounded-r-[10px] px-[14px] py-3 mb-[14px]">
      <div className="text-[10px] font-medium text-blue-600 uppercase tracking-[0.05em] mb-[3px] flex items-center gap-1">
        <i className="ti ti-bolt text-[10px]"></i>
        Quick answer
      </div>
      <p className="text-[12px] text-slate-900 leading-[1.6]">
        A <strong>{salaryConfig.display}</strong> salary in <strong>{stateData.name}</strong>{' '}
        {isNoTax && <span className="italic">(zero state income tax)</span>} yields{' '}
        <strong>${calculation.annualTakeHome.toLocaleString()}/year (${calculation.monthlyTakeHome.toLocaleString()}/month)</strong> take-home 
        after federal tax (${calculation.federalTax.toLocaleString()}) and FICA (${calculation.ficaTotal.toLocaleString()}).{' '}
        {isNoTax ? (
          <>
            {stateData.name} residents keep <strong>${diffVsCA.toLocaleString()}/year</strong> more than the same salary in California.
          </>
        ) : (
          <>
            See how much more you'd keep in Texas or Florida below.
          </>
        )}
      </p>
    </div>
  );
}
