// pages/salary-calculator/[state]/[amount].js

import Head from 'next/head';
import { SALARY_CONFIG, calculateTakeHome, getStateComparison, getAllChildPagePaths, getStateBySlug } from '../../../lib/taxData';
import SalaryCalculatorPage from '../../../components/SalaryCalculatorPage';

export async function getStaticPaths() {
  const paths = getAllChildPagePaths();

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { state, amount } = params;

  const stateData = getStateBySlug(state);
  const salaryConfig = SALARY_CONFIG[amount];

  if (!stateData || !salaryConfig) {
    return { notFound: true };
  }

  const calculation = calculateTakeHome(salaryConfig.amount, state);
  const comparisonData = getStateComparison(salaryConfig.amount);

  const pageTitle = `${salaryConfig.display} Salary in ${stateData.name} (2026 After Tax)`;
  const metaDescription = stateData.incomeTax.type === "none"
    ? `${salaryConfig.display} salary in ${stateData.name}? With zero state tax, your 2026 take-home pay is ~$${calculation.annualTakeHome.toLocaleString()}/yr. See full federal and FICA breakdown.`
    : `${salaryConfig.display} salary in ${stateData.name}? Your 2026 take-home pay is ~$${calculation.annualTakeHome.toLocaleString()}/yr after federal & ${calculation.effectiveStateRate}% state tax. See full breakdown.`;

  const h1Text = `${salaryConfig.short.charAt(0).toUpperCase() + salaryConfig.short.slice(1)} Salary After Taxes in ${stateData.name} 2026`;

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
        canonical: `https://uscalchub.com/salary-calculator/${state}/${amount}/`,
        ogTitle: pageTitle,
        ogDescription: metaDescription,
      }
    }
  };
}

export default function SalaryPage({
  state, amount, stateData, salaryConfig,
  calculation, comparisonData, seo
}) {
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />



        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "name": `${salaryConfig.display} Salary Calculator — ${stateData.name} 2026`,
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
                      "name": "Salary Calculator",
                      "item": "https://uscalchub.com/salary-calculator/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": stateData.name,
                      "item": `https://uscalchub.com/salary-calculator/${state}/`
                    },
                    {
                      "@type": "ListItem",
                      "position": 4,
                      "name": `${salaryConfig.display} in ${stateData.name}`,
                      "item": seo.canonical
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": `How much is ${salaryConfig.display} after taxes in ${stateData.name}?`,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `A ${salaryConfig.display} salary in ${stateData.name} yields approximately $${calculation.annualTakeHome.toLocaleString()} per year ($${calculation.monthlyTakeHome.toLocaleString()} per month) after federal income tax ($${calculation.federalTax.toLocaleString()}), FICA ($${calculation.ficaTotal.toLocaleString()}), and ${stateData.incomeTax.type === "none" ? 'zero state income tax' : `state income tax ($${calculation.stateTax.toLocaleString()})`}.`
                      }
                    },
                    {
                      "@type": "Question",
                      "name": `What is the monthly take-home for ${salaryConfig.display} in ${stateData.name}?`,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `A ${salaryConfig.display} annual salary in ${stateData.name} breaks down to approximately $${calculation.monthlyTakeHome.toLocaleString()} per month after all taxes, or $${calculation.biweeklyTakeHome.toLocaleString()} per biweekly paycheck.`
                      }
                    },
                    {
                      "@type": "Question",
                      "name": `Does ${stateData.name} have state income tax?`,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": stateData.incomeTax.type === "none"
                          ? `No. ${stateData.name} charges zero state income tax, making it one of the most tax-efficient states for workers at any salary level.`
                          : `Yes. ${stateData.name} has a progressive state income tax. On a ${salaryConfig.display} salary, the effective state tax rate is approximately ${calculation.effectiveStateRate}%, adding $${calculation.stateTax.toLocaleString()} to your annual tax burden.`
                      }
                    }
                  ]
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
