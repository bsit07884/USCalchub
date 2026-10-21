// pages/real-estate-calculator/[price].js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { REAL_ESTATE_PRICES, getPriceDataBySlug, getAllPriceSlugs, calculateRealEstateCommission } from '../../lib/realEstateData';

export async function getStaticPaths() {
  const slugs = getAllPriceSlugs();
  const paths = slugs.map((slug) => ({
    params: { price: slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { price } = params;
  const priceData = getPriceDataBySlug(price);

  if (!priceData) {
    return { notFound: true };
  }

  // Cross-linking: other prices excluding current
  const otherPrices = REAL_ESTATE_PRICES.filter((p) => p.slug !== priceData.slug);

  return {
    props: {
      priceData,
      otherPrices,
      seo: {
        title: priceData.title,
        description: priceData.metaDescription,
        h1: priceData.h1,
        canonical: `https://uscalchub.com/real-estate-calculator/${priceData.slug}/`
      }
    }
  };
}

export default function RealEstatePricePage({ priceData, otherPrices, seo }) {
  const [rate, setRate] = useState(priceData.defaultRate || 5.5);
  const [splitRatio, setSplitRatio] = useState(50); // Listing Agent gets 50%, Buyer Agent gets 50%

  // Calculations using shared logic
  const calc = calculateRealEstateCommission(priceData.price, rate, splitRatio);
  const {
    totalCommission,
    listingRate,
    buyerRate,
    listingCommission,
    buyerCommission,
    netProceeds,
    standard6Commission,
    savingsVs6
  } = calc;

  // Formatter helper
  const fmt = (val) => '$' + Math.round(val).toLocaleString('en-US');

  // Benchmark table rates
  const benchmarkRates = [4.0, 5.0, 5.5, 6.0, 7.0];

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
                  "name": priceData.slug === '1m'
                    ? `${priceData.displayPrice} Real Estate Commission Calculator 2026`
                    : priceData.title,
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
                      "item": "https://uscalchub.com/real-estate-calculator/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": `${priceData.displayPrice} Sale`,
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": priceData.faqs.map((faq) => ({
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

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
        <Navbar />

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          {/* Breadcrumb navigation */}
          <nav className="flex text-xs text-slate-500 mb-4 items-center space-x-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-400">/</span>
            <Link href="/real-estate-calculator/" className="hover:text-blue-600 transition-colors">Real Estate Calculator</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-medium">{priceData.displayPrice} Sale</span>
          </nav>

          {/* Header Section */}
          <header className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <i className="ti ti-home-check"></i>
              <span>2026 Home Seller Commission Guide · Post-NAR Rules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {seo.h1}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Interactive breakdown of real estate broker fees, listing vs. buyer agent splits, and estimated net proceeds on a {priceData.displayPrice} property sale.
            </p>
          </header>

          {/* AEO Direct Answer Lead Callout Box */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 mb-8 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <i className="ti ti-bulb text-lg"></i>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                  Direct Answer & Key Takeaway
                </div>
                <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                  {priceData.aeoDirectAnswer}
                </p>

                {/* Quick 3-metric snapshot bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-blue-200/60">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Typical Total Fee</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">
                      {fmt(priceData.price * (priceData.typicalRangeMin / 100))} – {fmt(priceData.price * (priceData.typicalRangeMax / 100))}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">({priceData.typicalRangeMin}% to {priceData.typicalRangeMax}%)</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Est. Net Proceeds</div>
                    <div className="text-emerald-700 font-bold text-sm mt-0.5">
                      {fmt(priceData.price * (1 - priceData.typicalRangeMax / 100))} – {fmt(priceData.price * (1 - priceData.typicalRangeMin / 100))}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">(Before mortgage & closing)</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Equal 50/50 Split</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">
                      {fmt((priceData.price * (priceData.typicalRangeMin / 100)) / 2)} – {fmt((priceData.price * (priceData.typicalRangeMax / 100)) / 2)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Per brokerage side</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="ti ti-calculator text-blue-600"></i>
                  Interactive Commission & Net Payout Calculator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust the total commission percentage or test custom broker splits to see exact dollar amounts.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Fixed Sale Price</span>
                <span className="text-xl font-black text-slate-900">{priceData.displayPrice}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Controls */}
              <div className="lg:col-span-6 space-y-6">
                {/* Commission Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="rate-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Total Commission Rate:
                    </label>
                    <span className="text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    id="rate-slider"
                    type="range"
                    min="3.0"
                    max="8.0"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>3.0% (Discount)</span>
                    <span>5.5% (National Avg)</span>
                    <span>8.0% (High Tier)</span>
                  </div>

                  {/* Quick Select Pills */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 mb-2">Quick Benchmark Presets:</div>
                    <div className="flex flex-wrap gap-2">
                      {[4.0, 5.0, 5.5, 6.0, 7.0].map((pillRate) => (
                        <button
                          key={pillRate}
                          type="button"
                          onClick={() => setRate(pillRate)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                            Math.abs(rate - pillRate) < 0.01
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {pillRate.toFixed(1)}% {pillRate === 6.0 ? '(Traditional)' : pillRate === 5.5 ? '(Avg)' : pillRate === 4.0 ? '(Discount)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Listing vs Buyer Split Slider */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="split-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Agent Fee Split Ratio:
                    </label>
                    <span className="text-xs font-bold text-slate-600">
                      {splitRatio}% Listing / {100 - splitRatio}% Buyer
                    </span>
                  </div>
                  <input
                    id="split-slider"
                    type="range"
                    min="30"
                    max="70"
                    step="5"
                    value={splitRatio}
                    onChange={(e) => setSplitRatio(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>30/70</span>
                    <button
                      type="button"
                      onClick={() => setSplitRatio(50)}
                      className={`text-[11px] font-bold ${splitRatio === 50 ? 'text-indigo-600 underline' : 'text-slate-500 hover:text-indigo-600'}`}
                    >
                      Reset 50/50 Equal Split
                    </button>
                    <span>70/30</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Results Card */}
              <div className="lg:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Calculated Commission Payout
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="text-3xl font-black text-slate-900">
                      {fmt(totalCommission)}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500">Total Fee Rate: </span>
                      <span className="text-sm font-bold text-slate-800">{rate.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Splits */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listing Agent Brokerage</div>
                      <div className="text-base font-bold text-slate-800 mt-0.5">{fmt(listingCommission)}</div>
                      <div className="text-[11px] text-slate-500">{listingRate.toFixed(2)}% of sale price</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyer's Agent Brokerage</div>
                      <div className="text-base font-bold text-slate-800 mt-0.5">{fmt(buyerCommission)}</div>
                      <div className="text-[11px] text-slate-500">{buyerRate.toFixed(2)}% of sale price</div>
                    </div>
                  </div>

                  {/* Net Proceeds */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5 mb-3">
                    <div className="flex justify-between items-baseline">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Estimated Net Sale Proceeds</div>
                      <span className="text-[11px] text-emerald-600 font-semibold">{(100 - rate).toFixed(1)}% of price</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-800 mt-0.5">{fmt(netProceeds)}</div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Gross payout before mortgage loan payoff, transfer taxes, and escrow closing fees.
                    </div>
                  </div>
                </div>

                {/* Comparison vs 6% standard banner */}
                <div className="pt-3 border-t border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Vs. Traditional 6.0% Fee:</span>
                  {savingsVs6 > 0 ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                      <i className="ti ti-circle-check"></i> Save {fmt(savingsVs6)} ({fmt(standard6Commission)} at 6%)
                    </span>
                  ) : savingsVs6 === 0 ? (
                    <span className="font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                      Equal to 6.0% standard ({fmt(standard6Commission)})
                    </span>
                  ) : (
                    <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      +{fmt(Math.abs(savingsVs6))} more than 6.0% standard
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-table text-blue-600"></i>
              Commission Comparison by Percentage ({priceData.displayPrice} Sale)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              See how different negotiated commission rates affect total fees, 50/50 broker allocations, and remaining seller equity.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Commission Rate</th>
                    <th className="py-2.5 px-3">Total Commission</th>
                    <th className="py-2.5 px-3">Listing Agent (50%)</th>
                    <th className="py-2.5 px-3">Buyer's Agent (50%)</th>
                    <th className="py-2.5 px-3">Net Sale Proceeds</th>
                    <th className="py-2.5 px-3 text-right">Savings vs. 6.0%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {benchmarkRates.map((benchRate) => {
                    const totalFee = (priceData.price * benchRate) / 100;
                    const halfFee = totalFee / 2;
                    const net = priceData.price - totalFee;
                    const savings = standard6Commission - totalFee;
                    const isSelected = Math.abs(rate - benchRate) < 0.05;

                    return (
                      <tr
                        key={benchRate}
                        className={`transition-colors ${
                          isSelected ? 'bg-blue-50/80 font-semibold' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{benchRate.toFixed(1)}%</span>
                            {benchRate === 6.0 && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                Traditional
                              </span>
                            )}
                            {benchRate === 5.5 && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                                Average
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{fmt(totalFee)}</td>
                        <td className="py-2.5 px-3 text-slate-600">{fmt(halfFee)}</td>
                        <td className="py-2.5 px-3 text-slate-600">{fmt(halfFee)}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-700">{fmt(net)}</td>
                        <td className="py-2.5 px-3 text-right">
                          {savings > 0 ? (
                            <span className="text-emerald-700 font-bold">+{fmt(savings)}</span>
                          ) : savings === 0 ? (
                            <span className="text-slate-400">$0 (Baseline)</span>
                          ) : (
                            <span className="text-rose-600 font-bold">-{fmt(Math.abs(savings))}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Post-NAR Settlement Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <i className="ti ti-gavel text-base"></i>
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  Post-NAR Settlement Rules: How They Apply to a {priceData.displayPrice} Home
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {priceData.narContext}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Editorial Angle Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 mb-8">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <i className="ti ti-chart-arrows text-base"></i>
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Market Tier Analysis
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {priceData.secondaryAngleTitle}
                </h2>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
              {priceData.secondaryAngleContent.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Hub Calculator Cross-link CTA Banner */}
          <div
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)' }}
            className="bg-blue-600 text-white rounded-xl p-5 mb-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-base font-bold mb-1 text-white">Need to Calculate a Custom Property Sale Price?</h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
                Use our full interactive Real Estate Commission Calculator to calculate custom property valuations, custom closing fee deductions, and dual-transaction net sheets.
              </p>
            </div>
            <Link
              href="/real-estate-calculator/"
              className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-xs"
            >
              Open Full Real Estate Hub <i className="ti ti-arrow-right ml-1"></i>
            </Link>
          </div>

          {/* Adjacent Price Tiers Cross-Linking */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i className="ti ti-arrows-left-right text-blue-600"></i>
              Explore Other Home Sale Price Tiers
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Compare commission payouts and net equity benchmarks across other popular US home price points:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {otherPrices.map((other) => (
                <Link
                  key={other.slug}
                  href={`/real-estate-calculator/${other.slug}/`}
                  className="block bg-slate-50 border border-slate-200 rounded-lg p-3.5 hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                    <span>{other.displayPrice} House Sale</span>
                    <i className="ti ti-chevron-right text-[10px] text-slate-400 group-hover:text-blue-600"></i>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {fmt(other.price * (other.typicalRangeMin / 100))} – {fmt(other.price * (other.typicalRangeMax / 100))} commission ({other.typicalRangeMin}-{other.typicalRangeMax}%)
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <i className="ti ti-help-circle text-blue-600"></i>
              Frequently Asked Questions ({priceData.displayPrice} Sale)
            </h2>
            <div className="divide-y divide-slate-100">
              {priceData.faqs.map((faq, i) => (
                <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
