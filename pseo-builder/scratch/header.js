/**
 * lib/taxData.js
 * USCalcHub — Master 50-State Tax Data for Salary Calculator pSEO
 */

export const FEDERAL_2026 = {
  standardDeduction: { single: 16100, marriedJointly: 32200 },
  fica: {
    socialSecurity: {
      rate: 0.062,           // employee share
      wageBase: 184500,      // 2026 SS wage base cap
      maxTax: 11439,         // 6.2% x 184,500
    },
    medicare: {
      rate: 0.0145,          // employee share, no wage cap
      additionalRate: 0.009, // Additional Medicare Tax
      additionalThreshold: { single: 200000, marriedJointly: 250000, marriedSeparately: 125000 },
    },
  },
  federalBracketsSingle2026: [
    { rate: 0.10, over: 0 },
    { rate: 0.12, over: 12400 },
    { rate: 0.22, over: 50400 },
    { rate: 0.24, over: 105475 },
    { rate: 0.32, over: 201775 },
    { rate: 0.35, over: 256225 },
    { rate: 0.37, over: 640600 },
  ],
};

export const SALARY_BRACKETS = [50000, 60000, 75000, 85000, 100000, 120000, 150000];

export const STATES = [
