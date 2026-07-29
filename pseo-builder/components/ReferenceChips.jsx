export default function ReferenceChips({ isChildPage, stateData }) {
  const containerClass = isChildPage
    ? "flex flex-wrap gap-[6px] pt-[10px] border-t border-slate-100 mb-6"
    : "flex flex-wrap gap-2 px-6 py-4 border-t border-slate-100";

  const stateLinks = {
    texas: { text: "TX Comptroller", url: "https://comptroller.texas.gov/" },
    florida: { text: "FL Dept of Revenue", url: "https://floridarevenue.com/" },
    california: { text: "CA Franchise Tax Board", url: "https://www.ftb.ca.gov/" },
    "new-york": { text: "NY Dept of Taxation", url: "https://www.tax.ny.gov/" }
  };

  return (
    <div className={containerClass}>
      <a href="https://www.irs.gov/taxtopics/tc751" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-[10px] py-1 text-[11px] text-slate-500 hover:bg-slate-100 transition-colors">
        <i className="ti ti-external-link text-[11px]"></i>
        IRS Publication 15-T (2026)
      </a>
      <a href="https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-[10px] py-1 text-[11px] text-slate-500 hover:bg-slate-100 transition-colors">
        <i className="ti ti-external-link text-[11px]"></i>
        Tax Foundation State Rates 2026
      </a>
      <a href="https://www.ssa.gov/oact/cola/cbb.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-[10px] py-1 text-[11px] text-slate-500 hover:bg-slate-100 transition-colors">
        <i className="ti ti-external-link text-[11px]"></i>
        SSA 2026 Wage Base
      </a>
      {isChildPage && stateData && stateLinks[stateData.slug] && (
        <a href={stateLinks[stateData.slug].url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-[10px] py-1 text-[11px] text-slate-500 hover:bg-slate-100 transition-colors">
          <i className="ti ti-external-link text-[11px]"></i>
          {stateLinks[stateData.slug].text}
        </a>
      )}
    </div>
  );
}
