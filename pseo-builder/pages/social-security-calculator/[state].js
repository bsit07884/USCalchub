// pages/social-security-calculator/[state].js
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { SS_TAXING_STATES, getStateSSInfo, DISCLAIMER } from '../../lib/ssData';

export async function getStaticPaths() {
  const paths = SS_TAXING_STATES.map((state) => ({
    params: { state: state.slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { state } = params;
  const stateData = getStateSSInfo(state);

  if (!stateData) {
    return { notFound: true };
  }

  // Related taxing states for cross-linking
  const otherTaxingStates = SS_TAXING_STATES
    .filter(s => s.slug !== state)
    .slice(0, 3);

  // Meta details tailored strictly within character limits
  const pageTitle = `Is Social Security Taxed in ${stateData.name}? (2026 Rules)`;
  
  let metaDescription = "";
  if (stateData.slug === "colorado") {
    metaDescription = "Is Social Security taxed in Colorado in 2026? Yes, but benefits are 100% exempt at age 65+ with partial deductions for ages 55-64. See CO rules & thresholds.";
  } else if (stateData.slug === "montana") {
    metaDescription = "Is Social Security taxed in Montana in 2026? Yes. Montana uses federal taxable income with up to $5,500 deduction for filers 65+. See exact MT tax rules.";
  } else if (stateData.slug === "utah") {
    metaDescription = "Is Social Security taxed in Utah in 2026? Yes, but Utah offers a nonrefundable retirement tax credit to reduce or eliminate tax. See 2026 income caps.";
  } else if (stateData.slug === "connecticut") {
    metaDescription = "Is Social Security taxed in Connecticut in 2026? Yes, but filers under $75k single ($100k joint) pay zero tax. Max 25% taxed above caps. See full guide.";
  } else if (stateData.slug === "minnesota") {
    metaDescription = "Is Social Security taxed in Minnesota in 2026? Yes, but single filers under $84,490 (joint $108,320) receive full exemptions. See MN phaseout details.";
  } else if (stateData.slug === "new-mexico") {
    metaDescription = "Is Social Security taxed in New Mexico in 2026? Yes, but generous exemptions cover singles up to $100k and couples up to $150k. See 2026 NM guidelines.";
  } else if (stateData.slug === "rhode-island") {
    metaDescription = "Is Social Security taxed in Rhode Island in 2026? Yes, but filers at Full Retirement Age under $107k single ($133,750 joint) are 100% exempt. See rules.";
  } else if (stateData.slug === "vermont") {
    metaDescription = "Is Social Security taxed in Vermont in 2026? Yes, but benefits are fully exempt below $50k single ($65k joint), with partial phaseouts. See VT rules.";
  } else {
    metaDescription = `Is Social Security taxed in ${stateData.name} in 2026? Yes. Learn ${stateData.name}'s income exemption thresholds, filing rules, and retirement tax impact.`;
  }

  const h1Text = `Is Social Security Taxed in ${stateData.name} in 2026?`;

  return {
    props: {
      stateData,
      otherTaxingStates,
      seo: {
        title: pageTitle,
        description: metaDescription,
        h1: h1Text,
        canonical: `https://uscalchub.com/social-security-calculator/${stateData.slug}/`,
      }
    }
  };
}

export default function SocialSecurityStatePage({ stateData, otherTaxingStates, seo }) {
  // AEO Direct Answer Lead Sentence
  let directAnswer = "";
  if (stateData.slug === "colorado") {
    directAnswer = "Yes, but benefits are 100% exempt for taxpayers aged 65 and older, and partially exempt for those aged 55 to 64 below state AGI limits.";
  } else if (stateData.slug === "montana") {
    directAnswer = "Yes. Montana does not offer a flat income exemption; instead, it taxes the federally taxable portion of Social Security and allows a deduction of up to $5,500 (single) or $11,000 (joint) for filers 65+.";
  } else if (stateData.slug === "utah") {
    directAnswer = "Yes, but Utah provides a nonrefundable retirement tax credit that effectively zeroes out Social Security tax for moderate-income retirees before phasing out.";
  } else if (stateData.slug === "connecticut") {
    directAnswer = "Yes, but Social Security benefits are 100% tax-free for single filers with an AGI of $75,000 or less ($100,000 for joint filers), with no more than 25% taxable above those levels.";
  } else if (stateData.slug === "minnesota") {
    directAnswer = "Yes, but Minnesota allows a substantial Social Security exemption for single filers earning under $84,490 ($108,320 for joint filers), which phases out gradually.";
  } else if (stateData.slug === "new-mexico") {
    directAnswer = "Yes, but New Mexico provides one of the nation's most generous exemptions, shielding Social Security completely for single filers with AGI up to $100,000 ($150,000 for joint filers).";
  } else if (stateData.slug === "rhode-island") {
    directAnswer = "Yes, but filers who have reached Full Retirement Age (FRA) are fully exempt if their AGI is under $107,000 for single filers ($133,750 for joint filers).";
  } else if (stateData.slug === "vermont") {
    directAnswer = "Yes, but Vermont completely exempts Social Security benefits for single filers earning under $50,000 ($65,000 for joint filers), with a partial phaseout above those limits.";
  } else {
    directAnswer = `Yes, Social Security is subject to state taxation in ${stateData.name}, subject to specific statutory exemptions and income thresholds.`;
  }

  // FAQs
  const faqs = [
    {
      q: `Is Social Security taxed in ${stateData.name}?`,
      a: `Yes, ${stateData.name} is one of only 8 states that levy state income tax on Social Security benefits in 2026. However, ${directAnswer}`
    },
    {
      q: `What is the top state income tax rate in ${stateData.name}?`,
      a: `${stateData.name}'s top marginal income tax rate for 2026 is ${(stateData.topRate * 100).toFixed(2)}%. The actual tax paid on Social Security benefits depends on your taxable threshold and eligible deductions.`
    },
    {
      q: `How can retirees in ${stateData.name} minimize Social Security tax?`,
      a: `Retirees can minimize state tax on benefits by managing their Modified Adjusted Gross Income (MAGI) through strategic Roth IRA distributions, timing traditional retirement account withdrawals, and maximizing age-specific deductions.`
    }
  ];

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": `${stateData.name} Social Security Tax Calculator 2026`,
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
                      "item": "https://uscalchub.com"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Social Security Calculator",
                      "item": "https://uscalchub.com/social-security-calculator/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": stateData.name,
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

      <div className="bg-white min-h-screen font-sans flex flex-col">
        <Navbar />

        <main className="flex-grow w-full max-w-3xl mx-auto border-x border-slate-100">
          
          {/* Top Breadcrumbs & Title */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 pt-5 pb-5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-[10px] flex-wrap">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span className="text-slate-300">›</span>
              <Link href="/social-security-calculator/" className="hover:text-blue-600 transition-colors">Social Security Calculator</Link>
              <span className="text-slate-300">›</span>
              <span className="text-slate-600 font-medium">{stateData.name}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
                <i className="ti ti-alert-triangle text-[11px]"></i>
                1 of 8 Taxing States
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-slate-500 text-xs font-medium">Updated for 2026 Tax Year</span>
            </div>

            <h1 className="text-[22px] font-medium text-slate-900 leading-[1.3] mb-1">
              {seo.h1}
            </h1>
          </div>

          <div className="px-6 py-5">
            
            {/* AEO Direct Answer Box */}
            <div className="bg-blue-50 border-l-[3px] border-blue-600 rounded-r-xl p-4 mb-6">
              <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <i className="ti ti-bolt text-[13px]"></i>
                Direct Answer
              </div>
              <p className="text-[14px] text-slate-900 leading-relaxed">
                <strong>Is Social Security taxed in {stateData.name} in 2026? </strong>
                <span className="text-blue-700 font-bold">Yes.</span> {directAnswer}
              </p>
            </div>

            {/* MANDATORY PROMINENT INFLATION DISCLAIMER */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <i className="ti ti-info-circle text-amber-600 text-[18px] mt-0.5 flex-shrink-0"></i>
              <div>
                <div className="text-xs font-semibold text-amber-900 mb-0.5 uppercase tracking-wide">
                  Important Statutory Notice
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {DISCLAIMER}
                </p>
              </div>
            </div>

            {/* State Mechanism Deep-Dive Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
              <h2 className="text-[16px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <i className="ti ti-scale text-blue-600"></i>
                How {stateData.name}'s Social Security Tax Rule Works
              </h2>
              
              <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                {stateData.summary}
              </p>

              {/* Specific Mechanism Custom Box */}
              {stateData.slug === 'colorado' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Colorado Age-Based Exemption Tiers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="font-semibold text-green-700 mb-1">Age 65 & Older</div>
                      <div className="text-slate-600 font-medium">100% Tax-Exempt</div>
                      <div className="text-[11px] text-slate-400 mt-1">No income cap applies</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="font-semibold text-blue-700 mb-1">Ages 55 – 64</div>
                      <div className="text-slate-600 font-medium">Exempt if AGI ≤ $75k ($95k Joint)</div>
                      <div className="text-[11px] text-slate-400 mt-1">Max $20,000 deduction if above cap</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="font-semibold text-red-700 mb-1">Under Age 55</div>
                      <div className="text-slate-600 font-medium">Fully Taxable</div>
                      <div className="text-[11px] text-slate-400 mt-1">No special SS exemption</div>
                    </div>
                  </div>
                  {stateData.note && (
                    <div className="mt-3 text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                      💡 <strong>2026 Legislative Update:</strong> {stateData.note}
                    </div>
                  )}
                </div>
              )}

              {stateData.slug === 'montana' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Montana Federal-Method Deduction Rules
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Montana is one of the few states that does not use an AGI cutoff. Instead, Montana calculates tax using the federally taxable portion of your Social Security benefits:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filer (Age 65+)</div>
                      <div className="text-slate-900 font-semibold text-sm">$5,500 Deduction</div>
                      <div className="text-[11px] text-slate-400 mt-1">Direct subtraction from taxable benefits</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly (Age 65+)</div>
                      <div className="text-slate-900 font-semibold text-sm">$11,000 Deduction</div>
                      <div className="text-[11px] text-slate-400 mt-1">Direct subtraction from taxable benefits</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-100">
                    <strong>Key Takeaway:</strong> Because Montana begins from federal taxable benefits and applies a capped deduction, most middle- and upper-income Montana retirees will owe some state income tax on their benefits.
                  </div>
                </div>
              )}

              {stateData.slug === 'utah' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Utah Nonrefundable Retirement Tax Credit
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Utah does not provide a traditional exemption. Instead, Utah taxes Social Security at its flat 4.55% rate, but offers a <strong>nonrefundable Social Security tax credit</strong> that offsets tax liability:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">Phases out above $54,000 MAGI</div>
                      <div className="text-[11px] text-slate-400 mt-1">Credit reduces by $0.025 per dollar over cap</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">Phases out above $90,000 MAGI</div>
                      <div className="text-[11px] text-slate-400 mt-1">Credit reduces by $0.025 per dollar over cap</div>
                    </div>
                  </div>
                </div>
              )}

              {stateData.slug === 'connecticut' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Connecticut AGI Exemption Thresholds
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $75,000: 100% Exempt</div>
                      <div className="text-[11px] text-slate-400 mt-1">Above $75,000: max 25% of taxable benefits taxed</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $100,000: 100% Exempt</div>
                      <div className="text-[11px] text-slate-400 mt-1">Above $100,000: max 25% of taxable benefits taxed</div>
                    </div>
                  </div>
                </div>
              )}

              {stateData.slug === 'minnesota' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Minnesota Gradual Phaseout Subtraction
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">Full Exemption ≤ $84,490</div>
                      <div className="text-[11px] text-slate-400 mt-1">Phases out 10% per $4,000 over threshold</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">Full Exemption ≤ $108,320</div>
                      <div className="text-[11px] text-slate-400 mt-1">Phases out 10% per $4,000 over threshold</div>
                    </div>
                  </div>
                </div>
              )}

              {stateData.slug === 'new-mexico' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    New Mexico High-Cap Exemption
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $100,000: 100% Tax-Free</div>
                      <div className="text-[11px] text-slate-400 mt-1">Most retirees pay zero state tax</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $150,000: 100% Tax-Free</div>
                      <div className="text-[11px] text-slate-400 mt-1">Most generous flat cutoff of all 8 states</div>
                    </div>
                  </div>
                </div>
              )}

              {stateData.slug === 'rhode-island' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Rhode Island Age + Income Dual Requirement
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $107,000 & Full Retirement Age</div>
                      <div className="text-[11px] text-slate-400 mt-1">Must have reached FRA (approx. 66-67)</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $133,750 & Full Retirement Age</div>
                      <div className="text-[11px] text-slate-400 mt-1">Must have reached FRA (approx. 66-67)</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 italic">
                    *Filers below full retirement age do not qualify for this exemption regardless of income.
                  </div>
                </div>
              )}

              {stateData.slug === 'vermont' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                    Vermont Threshold & Phaseout Rules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Single Filers</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $50,000: 100% Exempt</div>
                      <div className="text-[11px] text-slate-400 mt-1">Partial exemption phases out at higher incomes</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-slate-200">
                      <div className="text-slate-500 font-medium mb-1">Married Filing Jointly</div>
                      <div className="text-slate-900 font-semibold text-sm">AGI ≤ $65,000: 100% Exempt</div>
                      <div className="text-[11px] text-slate-400 mt-1">Partial exemption phases out at higher incomes</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Top State Tax Rate: <strong className="text-slate-800">{(stateData.topRate * 100).toFixed(2)}%</strong></span>
                <span>Data Confidence: <strong className="capitalize text-slate-800">{stateData.sourceConfidence}</strong></span>
              </div>
            </div>

            {/* Hub Calculator CTA Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold mb-1">Calculate Your Federal Taxable Benefits</h3>
                <p className="text-xs text-blue-100 leading-relaxed max-w-md">
                  State taxes on Social Security start with your federally taxable benefits. Use our free interactive tool to compute your Combined Income threshold.
                </p>
              </div>
              <Link
                href="/social-security-calculator/"
                className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-sm"
              >
                Launch Calculator <i className="ti ti-arrow-right ml-1"></i>
              </Link>
            </div>

            {/* Cross-linking to other taxing states */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
              <h3 className="text-[14px] font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <i className="ti ti-map-pin text-blue-600"></i>
                Compare With Other Social Security Taxing States
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Only 8 states in the US tax Social Security in 2026. Explore how other taxing states structure their exemptions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherTaxingStates.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/social-security-calculator/${other.slug}/`}
                    className="block bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                      <span>{other.name}</span>
                      <i className="ti ti-chevron-right text-[10px] text-slate-400 group-hover:text-blue-600"></i>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 capitalize">
                      {other.ruleType.replace('-', ' ')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
              <h2 className="text-[15px] font-semibold text-slate-900 mb-3">
                Frequently Asked Questions ({stateData.name})
              </h2>
              <div className="divide-y divide-slate-100">
                {faqs.map((faq, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0">
                    <h3 className="text-xs font-semibold text-slate-800 mb-1">
                      {faq.q}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
