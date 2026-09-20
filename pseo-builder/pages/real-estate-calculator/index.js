// pages/real-estate-calculator/index.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { REAL_ESTATE_PRICES, COMMISSION_SLIDER_BOUNDS, calculateRealEstateCommission } from '../../lib/realEstateData';

export async function getStaticProps() {
  return {
    props: {
      prices: REAL_ESTATE_PRICES,
      seo: {
        title: "Real Estate Commission Calculator (2026) | USCalcHub",
        description: "Calculate 2026 real estate commissions, buyer/listing agent splits, and net home sale proceeds post-NAR settlement. Free interactive seller closing calculator.",
        canonical: "https://uscalchub.com/real-estate-calculator/"
      }
    }
  };
}

export default function RealEstateHubPage({ prices, seo }) {
  const [price, setPrice] = useState(450000);
  const [rate, setRate] = useState(COMMISSION_SLIDER_BOUNDS.defaultRate);
  const [splitMode, setSplitMode] = useState('dual'); // 'dual' (50/50), 'listing' (100/0), 'custom'
  const [customSplit, setCustomSplit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine active split ratio
  const effectiveSplit = splitMode === 'dual' ? 50 : splitMode === 'listing' ? 100 : customSplit;

  // Shared calculation logic
  const calc = calculateRealEstateCommission(price, rate, effectiveSplit);
  const {
    totalCommission,
    listingRate,
    buyerRate,
    listingCommission,
    buyerCommission,
    netProceeds,
    savingsVs6,
    netProceedsPct
  } = calc;

  // Currency Formatter
  const fmt = (val) => '$' + Math.round(val || 0).toLocaleString('en-US');
  const fmtK = (val) => '$' + (val / 1000).toFixed(1) + 'k';

  // Quick pick prices
  const quickPrices = [300000, 400000, 450000, 500000, 750000, 1000000];

  // Comparison table tiers
  const comparisonTiers = [
    { rate: 6.0, label: '6.0%', sublabel: '(Old Standard)', highlight: false },
    { rate: 5.5, label: '5.50%', sublabel: '(National Average)', highlight: true },
    { rate: 5.0, label: '5.0%', sublabel: '(Competitive Tier)', highlight: false },
    { rate: 4.0, label: '4.0%', sublabel: '(Negotiated Rate)', highlight: false },
    { rate: 3.0, label: '3.0%', sublabel: '(Discount Broker / Flat)', highlight: false }
  ];

  // Filtered price cards for explorer
  const filteredPrices = prices.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const text = `${p.displayPrice} ${p.price} ${p.slug} ${p.secondaryAngleTitle} ${p.title}`.toLowerCase();
    return text.includes(q);
  });

  const faqs = [
    {
      q: "Who pays the buyer's agent commission under 2026 rules?",
      a: "Traditionally, the seller paid the entirety of the 5% to 6% commission, split between both brokerages. Under current rules, buyers sign direct representation agreements with their broker. However, sellers may still offer seller concessions at closing to cover buyer agent costs to broaden the pool of eligible buyers."
    },
    {
      q: "Are real estate commissions set by law?",
      a: "No. By federal antitrust law, commission rates are entirely negotiable between property owners and licensed brokers. There is no statutory minimum or maximum fee anywhere in the United States."
    },
    {
      q: "What additional closing costs will a seller pay beyond commission?",
      a: "Beyond commission fees, sellers typically cover state and county transfer taxes (deed stamps), title search & owner’s title insurance policies, outstanding property prorations, HOA transfer fees, and attorney/escrow settlement charges. These typically amount to 1% to 2% of the home price."
    }
  ];

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />

        {/* OpenGraph & Social */}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://uscalchub.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content="https://uscalchub.com/logo.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Real Estate Commission Calculator 2026",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web Browser",
                  "url": seo.canonical,
                  "image": "https://uscalchub.com/logo.png",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": seo.description,
                  "author": {
                    "@type": "Organization",
                    "name": "USCalcHub",
                    "url": "https://uscalchub.com"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://uscalchub.com/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Real Estate Calculator",
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.a
                    }
                  }))
                }
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
        <Navbar />

        {/* BEGIN: Hero & Header Section */}
        <section className="relative bg-white border-b border-slate-200 overflow-hidden pt-10 pb-12">
          {/* Subtle Dot Grid Background Overlay */}
          <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {/* Compliance Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4 shadow-xs">
              <span>⚡ 2026 POST-NAR SETTLEMENT COMPLIANT</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Real Estate Commission Calculator — See Your{' '}
              <span className="text-blue-600 relative inline-block underline decoration-blue-200 decoration-wavy decoration-2">
                Net Proceeds
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Selling your home? Calculate standard buyer/seller agent commissions, explore negotiated rates, and discover exact net seller proceeds under post-NAR rules.
            </p>

            {/* Trust & Verification Metadata */}
            <div className="mt-4 inline-flex items-center text-xs font-medium text-slate-500 space-x-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">✓</span>
              <span>Reviewed by <strong className="text-slate-700 font-semibold">Muzaffar Ali</strong>, Financial Content Team</span>
              <span>•</span>
              <span>Last updated: September 2026</span>
            </div>

            {/* Quick Answer Callout Box */}
            <div className="mt-8 text-left bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl p-4 sm:p-5 shadow-xs max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  ⚡
                </div>
                <div>
                  <span className="block text-xs font-bold tracking-wider uppercase text-blue-900 mb-1">
                    Quick Answer
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The 2026 national average real estate commission is <strong className="font-bold text-slate-900">5.50%</strong> post-NAR settlement (typically ranging between 5.0% and 6.0%). On a <strong className="font-bold text-slate-900">$400,000 home</strong>, that equals <strong className="font-bold text-slate-900">$22,000 in agent fees</strong> with <strong className="font-bold text-slate-900">$378,000 net proceeds</strong>. Sellers negotiating a 4.0% rate save <strong className="text-blue-700 font-bold">$6,000</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: Interactive Calculator Section */}
        <section className="py-10 sm:py-12 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
              {/* Calculator Title */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <i className="ti ti-calculator text-blue-600"></i>
                  Real Estate Commission Calculator
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Calculate agent fees and net proceeds instantly.
                </p>
              </div>

              {/* Inputs Group */}
              <div className="space-y-6">
                {/* Property Sale Price Input */}
                <div>
                  <label htmlFor="property-price" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Property Sale Price ($)
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-medium">
                      $
                    </div>
                    <input
                      id="property-price"
                      type="number"
                      step="5000"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="block w-full rounded-lg border-slate-300 pl-8 pr-4 py-2.5 text-slate-900 font-semibold focus:border-blue-600 focus:ring-blue-600 sm:text-base transition"
                      placeholder="450,000"
                    />
                  </div>

                  {/* Quick Pick Price Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-xs text-slate-400 mr-1 font-medium">Quick pick:</span>
                    {quickPrices.map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setPrice(pVal)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                          price === pVal
                            ? 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold'
                            : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600'
                        }`}
                      >
                        {pVal >= 1000000 ? '$1M' : `$${pVal / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commission Rate Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="commission-rate-slider" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Commission Rate (%)
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">3.0%</span>
                    <input
                      id="commission-rate-slider"
                      type="range"
                      min={COMMISSION_SLIDER_BOUNDS.min}
                      max={COMMISSION_SLIDER_BOUNDS.max}
                      step={COMMISSION_SLIDER_BOUNDS.step}
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs text-slate-500 font-medium">8.0%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>3.0% (Discount)</span>
                    <span>5.5% (National Avg)</span>
                    <span>8.0% (High Tier)</span>
                  </div>

                  {/* Quick Rate Presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <span className="text-xs text-slate-400 mr-1 font-medium self-center">Presets:</span>
                    {[3.0, 4.0, 5.0, 5.5, 6.0, 7.0].map((presetRate) => (
                      <button
                        key={presetRate}
                        type="button"
                        onClick={() => setRate(presetRate)}
                        className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                          Math.abs(rate - presetRate) < 0.05
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {presetRate.toFixed(1)}%{presetRate === 5.5 ? ' (Avg)' : presetRate === 6.0 ? ' (Old)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Agent Split Options */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Split Option (Listing Agent vs. Buyer Agent)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium text-center">
                    <button
                      type="button"
                      onClick={() => setSplitMode('dual')}
                      className={`py-2 px-2.5 rounded-lg border transition ${
                        splitMode === 'dual'
                          ? 'border-2 border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      50/50 Dual Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('listing')}
                      className={`py-2 px-2.5 rounded-lg border transition ${
                        splitMode === 'listing'
                          ? 'border-2 border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Listing Agent Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitMode('custom')}
                      className={`py-2 px-2.5 rounded-lg border transition ${
                        splitMode === 'custom'
                          ? 'border-2 border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Custom Split
                    </button>
                  </div>

                  {splitMode === 'custom' && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-slate-700">Listing: {customSplit}%</span>
                        <span className="font-bold text-slate-700">Buyer: {100 - customSplit}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={customSplit}
                        onChange={(e) => setCustomSplit(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  )}
                </div>

                {/* Calculation Result Summary Card (Dark Slate-900 Card) */}
                <div className="bg-slate-900 rounded-xl p-5 sm:p-6 text-white shadow-md">
                  {/* Result Row 1 */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-slate-400 text-sm font-medium">Total Commission Fees:</span>
                    <span className="text-xl sm:text-2xl font-bold text-sky-400">
                      {fmt(totalCommission)}
                    </span>
                  </div>

                  {/* Result Row 2 */}
                  <div className="flex items-center justify-between pt-3 pb-4">
                    <div>
                      <span className="block text-slate-200 font-semibold text-sm sm:text-base">
                        You Receive (Net Proceeds):
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Before standard transfer tax &amp; escrow fees
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                      {fmt(netProceeds)}
                    </span>
                  </div>

                  {/* Proceeds Visual Distribution Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1.5 font-medium">
                      <span>Net Proceeds ({netProceedsPct.toFixed(1)}%)</span>
                      <span>Agent Fees ({rate.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, netProceedsPct))}%` }}
                      ></div>
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, listingRate))}%` }}
                      ></div>
                      <div
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, buyerRate))}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Seller Net
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Listing Agent ({listingRate.toFixed(2)}% · {fmt(listingCommission)})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Buyer Agent ({buyerRate.toFixed(2)}% · {fmt(buyerCommission)})
                      </span>
                    </div>
                  </div>

                  {/* Comparison vs 6% standard banner */}
                  <div className="pt-4 mt-4 border-t border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Vs. Traditional 6.0% Fee:</span>
                    {savingsVs6 > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                        ✓ Save {fmt(savingsVs6)} ({fmt(calc.standard6Commission)} at 6%)
                      </span>
                    ) : savingsVs6 === 0 ? (
                      <span className="font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        Equal to 6.0% baseline
                      </span>
                    ) : (
                      <span className="font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                        +{fmt(Math.abs(savingsVs6))} above 6.0% baseline
                      </span>
                    )}
                  </div>
                </div>

                {/* Helper Settlement Note */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold shrink-0 mt-0.5">ℹ</span>
                  <p>
                    <strong>Note:</strong> Standard commission in the US is typically 5-6%, often split 50/50 between the buyer's and seller's agents. Under the landmark 2024 NAR settlement, buyer agent fees are explicitly negotiable and uncoupled from MLS listings.
                  </p>
                </div>

                {/* Verification Badge */}
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 italic">
                    ★ Verified calculation logic by USCalcHub Financial Models
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: Commission Rate Comparison Section */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-900">Commission Rate Comparison — See Your Options</h2>
              </div>
              <p className="text-sm text-slate-500 ml-3.5">
                Based on your entered home price ({fmt(price)}). Shows exact fees and net proceeds at every common commission rate.
              </p>
            </div>

            {/* Comparison Table Container */}
            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase">
                    <th className="py-3.5 px-4 sm:px-6">Commission Rate</th>
                    <th className="py-3.5 px-4">Agent Fees</th>
                    <th className="py-3.5 px-4">Your Net Proceeds</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">vs 6% Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {comparisonTiers.map((tier) => {
                    const rowFee = (price * tier.rate) / 100;
                    const rowNet = price - rowFee;
                    const rowSavings = (price * 0.06) - rowFee;
                    const isCurrent = Math.abs(rate - tier.rate) < 0.05;

                    return (
                      <tr
                        key={tier.rate}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-blue-50/60 font-semibold'
                            : tier.highlight
                            ? 'bg-blue-50/20 hover:bg-blue-50/40'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{tier.label}</span>
                            <span className="text-xs text-slate-400 block sm:inline font-normal">
                              {tier.sublabel}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold">{fmt(rowFee)}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{fmt(rowNet)}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          {rowSavings > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                              +{fmt(rowSavings)}
                            </span>
                          ) : rowSavings === 0 ? (
                            <span className="text-slate-400 font-mono text-xs">—</span>
                          ) : (
                            <span className="text-rose-600 font-bold text-xs">
                              -{fmt(Math.abs(rowSavings))}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2.5 text-xs text-slate-400 italic">
              *Example calculation based on {fmt(price)} home price. Your results update live based on price entered above.
            </p>

            {/* Visual Chart: Net Proceeds by Rate */}
            <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between">
                <span>Net Proceeds by Commission Rate</span>
                <span className="text-xs font-normal text-slate-500">Higher proceeds with lower commission</span>
              </h3>

              {/* Chart Grid Simulation */}
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 sm:px-6 border-b border-slate-200">
                {/* Bar 1: 6% */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-slate-700">{fmtK(price * 0.94)}</span>
                  <div
                    className="w-full max-w-[54px] bg-rose-500 rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: '120px' }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    6.0%<br /><span className="text-[10px] text-slate-400">(Old)</span>
                  </span>
                </div>

                {/* Bar 2: 5.5% */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-slate-700">{fmtK(price * (1 - 0.055))}</span>
                  <div
                    className="w-full max-w-[54px] bg-amber-500 rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: '138px' }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    5.50%<br /><span className="text-[10px] text-slate-400">(Natl Avg)</span>
                  </span>
                </div>

                {/* Bar 3: 5.0% */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-slate-700">{fmtK(price * 0.95)}</span>
                  <div
                    className="w-full max-w-[54px] bg-yellow-500 rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: '155px' }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    5.0%<br /><span className="text-[10px] text-slate-400">(Standard)</span>
                  </span>
                </div>

                {/* Bar 4: 4.0% */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-emerald-700">{fmtK(price * 0.96)}</span>
                  <div
                    className="w-full max-w-[54px] bg-emerald-500 rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: '180px' }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    4.0%<br /><span className="text-[10px] text-slate-400">(Negotiated)</span>
                  </span>
                </div>

                {/* Bar 5: 3.0% */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-emerald-800">{fmtK(price * 0.97)}</span>
                  <div
                    className="w-full max-w-[54px] bg-emerald-600 rounded-t-md transition-all group-hover:opacity-90"
                    style={{ height: '205px' }}
                  ></div>
                  <span className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    3.0%<br /><span className="text-[10px] text-slate-400">(Discount)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: Price Explorer Grid Section (Dynamic from realEstateData.js) */}
        <section className="py-12 bg-slate-50 border-t border-slate-200" id="price-explorer">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-900">Explore Commissions by Home Sale Price</h2>
                </div>
                <p className="text-sm text-slate-500 ml-3.5">
                  Select a benchmark price to see exact listing vs. buyer agent splits and net seller equity.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                4 Price Tiers
              </span>
            </div>

            {/* Quick Price Search Box (Local Card Filter) */}
            <div className="relative mb-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search price tiers (e.g., $300k, $500,000, 750k, 1 million)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:ring-blue-600 transition"
              />
            </div>

            {/* 2x2 Interactive Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredPrices.map((p) => {
                const minFee = p.price * (p.typicalRangeMin / 100);
                const maxFee = p.price * (p.typicalRangeMax / 100);
                const minNet = p.price * (1 - p.typicalRangeMax / 100);
                const maxNet = p.price * (1 - p.typicalRangeMin / 100);
                const splitMin = minFee / 2;
                const splitMax = maxFee / 2;

                return (
                  <div
                    key={p.slug}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {p.displayPrice} Sale
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {fmt(minFee)} – {fmt(maxFee)} fee
                        </span>
                      </div>
                      <span className="block text-[11px] font-bold text-blue-600 tracking-wider uppercase mb-2">
                        {p.secondaryAngleTitle}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Typical {p.typicalRangeMin}–{p.typicalRangeMax}% commission equals {fmt(minFee)} to {fmt(maxFee)} ({fmt(splitMin)}–{fmt(splitMax)} per side). Seller estimated net proceeds: {fmt(minNet)} – {fmt(maxNet)}.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/real-estate-calculator/${p.slug}/`}
                        className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>View {p.displayPrice} Payout Breakdown</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPrices.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm bg-white rounded-xl border border-slate-200 p-6">
                No matching price tier found. Enter your custom home sale price in the main calculator above!
              </div>
            )}
          </div>
        </section>

        {/* BEGIN: Educational Guide & Features Section */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">How Real Estate Commissions Work in 2026</h2>
              <p className="text-sm text-slate-500 mt-1">Understanding decoupled representation fees and closing costs.</p>
            </div>

            {/* Feature Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                  ⚖
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Post-NAR Settlement Decoupling</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sellers are no longer required to offer unilateral commission splits to buyer agents on MLS systems. Every representation agreement is strictly between the client and their broker.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                  🤝
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Dual-Agent Representation Rules</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When one agent represents both buyer and seller (where permitted by state law), total commission is frequently reduced to 3.5%–4.5% since marketing and administrative overhead is halved.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                  📑
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Closing Costs vs. Commission</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real estate commissions constitute the largest seller expense (typically 5-6%), while title transfer fees, escrow, recording, and transfer taxes typically total an additional 1% to 2%.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                  🔒
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">100% Private &amp; Browser-Calculated</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All calculations run locally on your device. We do not track property addresses, sale values, or contact information. No lead capture forms or unsolicited agent phone calls.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="group bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer">
                    <summary className="flex justify-between items-center font-semibold text-slate-900 text-sm list-none">
                      <span>{i + 1}. {faq.q}</span>
                      <span className="transition group-open:rotate-180 text-blue-600 text-xs">▼</span>
                    </summary>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
