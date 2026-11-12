// pseo-builder/lib/hourlySalaryData.js
// Single Source of Truth for Hourly-to-Salary Programmatic Hub (Phase 2)

export const HOURLY_RATES = [
  15, 18, 20, 22, 25, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100
];

export function getHourlySlug(rate) {
  return `${rate}-an-hour`;
}

export function parseRateFromSlug(slug) {
  const match = slug.match(/^(\d+)-an-hour$/);
  return match ? parseInt(match[1], 10) : null;
}

export function calculateHourlyBreakdown(rate) {
  const hoursPerWeek = 40;
  const weeksPerYear = 52;
  const totalHours = hoursPerWeek * weeksPerYear; // 2,080

  const annualGross = rate * totalHours;
  const monthlyGross = Math.round(annualGross / 12);
  const biweeklyGross = Math.round(annualGross / 26);
  const weeklyGross = Math.round(annualGross / 52);
  const dailyGross = rate * 8;

  // Vacation variations (Unpaid time off)
  const paidHolidaysAnnual = annualGross; // 52 weeks (2,080 hrs)
  const twoWeeksUnpaidAnnual = rate * 2000; // 50 weeks (2,000 hrs)
  const fourWeeksUnpaidAnnual = rate * 1920; // 48 weeks (1,920 hrs)

  // 2026 Baseline Tax Calculation (Single Filer, Standard Deduction)
  const standardDeduction = 14600;
  const taxableIncome = Math.max(0, annualGross - standardDeduction);

  // 2026 Federal Progressive Brackets (Single)
  let federalTax = 0;
  if (taxableIncome > 0) {
    const b1 = Math.min(taxableIncome, 11925);
    federalTax += b1 * 0.10;
  }
  if (taxableIncome > 11925) {
    const b2 = Math.min(taxableIncome - 11925, 48475 - 11925);
    federalTax += b2 * 0.12;
  }
  if (taxableIncome > 48475) {
    const b3 = Math.min(taxableIncome - 48475, 103350 - 48475);
    federalTax += b3 * 0.22;
  }
  if (taxableIncome > 103350) {
    const b4 = Math.min(taxableIncome - 103350, 197300 - 103350);
    federalTax += b4 * 0.24;
  }
  if (taxableIncome > 197300) {
    const b5 = Math.min(taxableIncome - 197300, 250525 - 197300);
    federalTax += b5 * 0.32;
  }
  federalTax = Math.round(federalTax);

  // FICA
  const ssWageCap = 184500;
  const socialSecurity = Math.round(Math.min(annualGross, ssWageCap) * 0.062);
  const medicare = Math.round(annualGross * 0.0145 + Math.max(0, annualGross - 200000) * 0.009);
  const ficaTotal = socialSecurity + medicare;

  // Net Take-Home (Zero-state-tax benchmark like TX, FL, NV)
  const netTakeHomeZeroTax = annualGross - federalTax - ficaTotal;
  const netMonthlyZeroTax = Math.round(netTakeHomeZeroTax / 12);
  const netBiweeklyZeroTax = Math.round(netTakeHomeZeroTax / 26);
  const netWeeklyZeroTax = Math.round(netTakeHomeZeroTax / 52);

  // Estimated California Net (effective state tax ~3% to 5.5%)
  let caEstimatedStateTax = 0;
  if (annualGross < 50000) caEstimatedStateTax = Math.round(annualGross * 0.025);
  else if (annualGross < 80000) caEstimatedStateTax = Math.round(annualGross * 0.04);
  else if (annualGross < 120000) caEstimatedStateTax = Math.round(annualGross * 0.055);
  else caEstimatedStateTax = Math.round(annualGross * 0.07);

  const netTakeHomeCA = netTakeHomeZeroTax - caEstimatedStateTax;

  // Estimated New York Net (effective state tax ~3% to 5%)
  let nyEstimatedStateTax = 0;
  if (annualGross < 50000) nyEstimatedStateTax = Math.round(annualGross * 0.03);
  else if (annualGross < 80000) nyEstimatedStateTax = Math.round(annualGross * 0.045);
  else if (annualGross < 120000) nyEstimatedStateTax = Math.round(annualGross * 0.055);
  else nyEstimatedStateTax = Math.round(annualGross * 0.06);

  const netTakeHomeNY = netTakeHomeZeroTax - nyEstimatedStateTax;

  return {
    rate,
    totalHours,
    annualGross,
    monthlyGross,
    biweeklyGross,
    weeklyGross,
    dailyGross,
    paidHolidaysAnnual,
    twoWeeksUnpaidAnnual,
    fourWeeksUnpaidAnnual,
    federalTax,
    socialSecurity,
    medicare,
    ficaTotal,
    netTakeHomeZeroTax,
    netMonthlyZeroTax,
    netBiweeklyZeroTax,
    netWeeklyZeroTax,
    caEstimatedStateTax,
    netTakeHomeCA,
    nyEstimatedStateTax,
    netTakeHomeNY
  };
}

export function getAllHourlySlugs() {
  return HOURLY_RATES.map((r) => getHourlySlug(r));
}

export function getHourlyData(rate) {
  const calc = calculateHourlyBreakdown(rate);
  const formattedAnnual = '$' + calc.annualGross.toLocaleString('en-US');
  const formattedMonthly = '$' + calc.monthlyGross.toLocaleString('en-US');
  const formattedBiweekly = '$' + calc.biweeklyGross.toLocaleString('en-US');
  const formattedWeekly = '$' + calc.weeklyGross.toLocaleString('en-US');
  const formattedNetAnnual = '$' + calc.netTakeHomeZeroTax.toLocaleString('en-US');
  const formattedNetMonthly = '$' + calc.netMonthlyZeroTax.toLocaleString('en-US');

  return {
    rate,
    slug: getHourlySlug(rate),
    calc,
    title: `$${rate} an Hour is How Much a Year? (${formattedAnnual} Salary in 2026)`,
    metaDescription: `$${rate} an hour is ${formattedAnnual} per year before taxes, or ${formattedMonthly}/mo and ${formattedBiweekly} biweekly for a 40-hour work week. See exact take-home pay after 2026 taxes.`,
    h1: `$${rate} an Hour is How Much a Year?`,
    aeoDirectAnswer: `Working 40 hours per week at **$${rate} an hour** equals an annual gross salary of **${formattedAnnual} per year** (${formattedMonthly} per month, ${formattedBiweekly} biweekly, or ${formattedWeekly} per week). After standard 2026 Federal Income Tax ($${calc.federalTax.toLocaleString()}) and FICA ($${calc.ficaTotal.toLocaleString()}), your estimated net take-home pay is approximately **${formattedNetAnnual} per year** (${formattedNetMonthly}/month) in zero-income-tax states like Texas or Florida.`,
    faqs: [
      {
        q: `$${rate} an hour is how much a year?`,
        a: `$${rate} an hour is ${formattedAnnual} per year for a full-time employee working 40 hours per week (2,080 working hours in 52 weeks). If you take 2 weeks of unpaid vacation (2,000 hours), your annual gross earnings are $${calc.twoWeeksUnpaidAnnual.toLocaleString()}.`
      },
      {
        q: `How much is $${rate} an hour monthly?`,
        a: `At $${rate} per hour, your gross monthly pay is approximately ${formattedMonthly} per month before taxes and deductions.`
      },
      {
        q: `What is $${rate} an hour biweekly?`,
        a: `For employees paid every two weeks (26 paychecks per year), $${rate} an hour results in a gross biweekly paycheck of ${formattedBiweekly} (80 regular hours).`
      },
      {
        q: `How much is $${rate} an hour after taxes?`,
        a: `After subtracting 2026 Federal Income Tax ($${calc.federalTax.toLocaleString()}) and FICA taxes ($${calc.ficaTotal.toLocaleString()}), a single filer takes home approximately ${formattedNetAnnual} annually ($${calc.netMonthlyZeroTax.toLocaleString()}/month or $${calc.netBiweeklyZeroTax.toLocaleString()} biweekly) in states with no state income tax. In states like California or New York, state income tax will reduce net pay by an additional $${calc.caEstimatedStateTax.toLocaleString()} to $${calc.nyEstimatedStateTax.toLocaleString()} per year.`
      }
    ]
  };
}
