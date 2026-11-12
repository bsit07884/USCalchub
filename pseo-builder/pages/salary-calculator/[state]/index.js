// pages/salary-calculator/[state]/index.js

import Head from 'next/head';
import { SALARY_CONFIG, calculateTakeHome, getStateComparison, getStateBySlug, getLiveStates } from '../../../lib/taxData';
import SalaryCalculatorPage from '../../../components/SalaryCalculatorPage';

export async function getStaticPaths() {
  const liveStates = getLiveStates();
  const paths = liveStates.map((s) => ({
    params: { state: s.slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { state } = params;
  const stateData = getStateBySlug(state);

  if (!stateData) {
    return { notFound: true };
  }

  // Default benchmark salary for state hub page: $75,000 (US median household benchmark)
  const amount = '75k';
  const salaryConfig = SALARY_CONFIG[amount];
  const calculation = calculateTakeHome(salaryConfig.amount, state);
  const comparisonData = getStateComparison(salaryConfig.amount);

  const isNoTax = stateData.incomeTax.type === "none";
  const formattedTakeHome = '$' + calculation.annualTakeHome.toLocaleString('en-US');

  const pageTitle = isNoTax
    ? `${stateData.name} Income Tax Calculator 2026: Take-Home Pay (0% State Tax)`
    : `${stateData.name} Paycheck & Salary Calculator (2026 After Tax Take-Home)`;

  const metaDescription = isNoTax
    ? `Calculate your 2026 take-home pay in ${stateData.name} with 0% state income tax. See exact federal tax, FICA deductions, and paycheck breakdown for any salary in ${stateData.name}.`
    : `Calculate your 2026 take-home pay in ${stateData.name} after ${stateData.incomeTax.type} state income tax, federal tax, and FICA. See biweekly and monthly paycheck breakdowns.`;

  const h1Text = `${stateData.name} Salary & Income Tax Calculator 2026`;

  return {
    props: {
      state,
      amount,
      stateData,
      salaryConfig,
      calculation,
      comparisonData,
      seo: {
        title: pageTitle,
        description: metaDescription,
        h1: h1Text,
        canonical: `https://uscalchub.com/salary-calculator/${state}/`,
        ogTitle: pageTitle,
        ogDescription: metaDescription,
      }
    }
  };
}

export default function StateSalaryHubPage({
  state, amount, stateData, salaryConfig,
  calculation, comparisonData, seo
}) {
  const isNoTax = stateData.incomeTax.type === "none";

  const faqs = [
    {
      q: `Does ${stateData.name} have a state income tax?`,
      a: isNoTax
        ? `No. ${stateData.name} has 0% state income tax under its state constitution. Workers in ${stateData.name} only pay Federal Income Tax and FICA (Social Security and Medicare).`
        : `Yes. ${stateData.name} levies a ${stateData.incomeTax.type} state income tax with rates up to ${stateData.incomeTax.topRate ? (stateData.incomeTax.topRate * 100).toFixed(1) + '%' : (stateData.incomeTax.flatRate * 100).toFixed(1) + '%'}.`
    },
    {
      q: `How is take-home pay calculated in ${stateData.name}?`,
      a: `Take-home pay in ${stateData.name} is calculated by subtracting Federal Income Tax (10% to 37% progressive brackets), FICA payroll taxes (6.2% Social Security + 1.45% Medicare), and applicable ${stateData.name} state withholdings from gross earnings.`
    },
    {
      q: `How much do you take home on a $75,000 salary in ${stateData.name}?`,
      a: `A single filer earning $75,000 in ${stateData.name} takes home approximately $${calculation.annualTakeHome.toLocaleString('en-US')} per year ($${calculation.monthlyTakeHome.toLocaleString('en-US')}/month or $${calculation.biweeklyTakeHome.toLocaleString('en-US')} biweekly) for the 2026 tax year.`
    }
  ];

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://uscalchub.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content="https://uscalchub.com/logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": `${stateData.name} Income Tax & Salary Calculator 2026`,
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
                      "name": "Salary Calculator",
                      "item": "https://uscalchub.com/salary-calculator/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": `${stateData.name} Calculator`,
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": faqs.map((f) => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": f.a
                    }
                  }))
                }
              ]
            })
          }}
        />
      </Head>

      <SalaryCalculatorPage
        state={state}
        amount={amount}
        stateData={stateData}
        salaryConfig={salaryConfig}
        calculation={calculation}
        comparisonData={comparisonData}
        h1={seo.h1}
      />
    </>
  );
}
