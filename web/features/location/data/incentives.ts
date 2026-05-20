// State EV purchase incentive programs
// Source: DOE AFDC afdc.energy.gov/laws/state + official program sites
// Verified May 2026. Amounts reflect standard (non-income-qualified) max unless noted.
// Programs change — always link to official source.

export interface EVIncentiveProgram {
  name: string;
  amount: number;           // max standard amount
  amountIncomeQualified?: number; // higher amount if income-qualified
  type: "tax_credit" | "rebate" | "instant_rebate";
  bevOnly: boolean;         // false = BEV + PHEV both eligible
  incomeOnly?: boolean;     // true = standard amount requires income verification
  msrpCap?: number;
  notes: string;
  url: string;
  expires?: string;
}

export interface StateIncentiveData {
  programs: EVIncentiveProgram[];
  noSalesTax?: boolean;     // state exempts EVs from sales tax
  noSalesTaxNote?: string;
}

export const STATE_INCENTIVES: Record<string, StateIncentiveData> = {
  CO: {
    programs: [{
      name: "Colorado EV Tax Credit",
      amount: 750,
      type: "tax_credit",
      bevOnly: false,
      msrpCap: 80000,
      notes: "State income tax credit. Stepped down from $3,500 in 2025 to $750 in 2026. Extra $2,500 if vehicle MSRP ≤$35K. Expires Jan 1, 2029.",
      url: "https://cdor.colorado.gov/taxes-and-filings/income-tax/ev-credits",
    }],
  },
  MA: {
    programs: [{
      name: "MOR-EV Rebate",
      amount: 3500,
      amountIncomeQualified: 5000,
      type: "rebate",
      bevOnly: true,
      msrpCap: 55000,
      notes: "BEV and FCEV only. Income-qualified (MOR-EV+) receive extra $1,500. $1,000 bonus for trade-in. Min 36-month ownership. Used EVs also eligible ($3,500, cap $40K).",
      url: "https://mor-ev.org",
    }],
  },
  NY: {
    programs: [{
      name: "Drive Clean Rebate",
      amount: 2000,
      type: "rebate",
      bevOnly: false,
      msrpCap: 42000,
      notes: "Tiered by electric range: >200 mi = $2,000; 40–199 mi = $1,000; <40 mi = $500. Point-of-sale at participating dealers. Vehicles above $42K cap receive $500 max.",
      url: "https://www.nyserda.ny.gov/All-Programs/Drive-Clean-Rebate",
    }],
  },
  IL: {
    programs: [{
      name: "Illinois EV Rebate (IEPA)",
      amount: 2000,
      amountIncomeQualified: 4000,
      type: "rebate",
      bevOnly: false,
      msrpCap: 80000,
      notes: "Base $2,000; income-qualified receive additional $2,000 (total $4,000). Apply within 90 days of purchase. One rebate per person per 10 years. Available July 2025–June 2028.",
      url: "https://illinoisEPA.illinois.gov/topics/energy/electric-vehicles.html",
    }],
  },
  OR: {
    programs: [{
      name: "Oregon Clean Vehicle Rebate",
      amount: 2500,
      amountIncomeQualified: 7500,
      type: "rebate",
      bevOnly: false,
      msrpCap: 50000,
      notes: "Battery ≥10 kWh = $2,500; <10 kWh = $1,500. Income-qualified stack Charge Ahead ($5,000) for up to $7,500 combined. MSRP cap $50K (EVs), $60K (FCEVs).",
      url: "https://www.oregon.gov/deq/aq/programs/pages/oregonevrebate.aspx",
    }],
  },
  NJ: {
    programs: [{
      name: "Charge Up New Jersey",
      amount: 1500,
      amountIncomeQualified: 4000,
      type: "rebate",
      bevOnly: true,
      msrpCap: 55000,
      notes: "BEV only — PHEVs not eligible. Standard: $1,500. Income-qualified (Charge Up+): additional $2,500 (total $4,000). No expiry stated.",
      url: "https://www.njcleanenergy.com/ev",
    }],
    noSalesTax: true,
    noSalesTaxNote: "New Jersey exempts EVs from the 6.625% state sales tax — saves $1,300–$4,600+ depending on vehicle price.",
  },
  WA: {
    programs: [{
      name: "WA EV Instant Rebate",
      amount: 9000,
      type: "instant_rebate",
      bevOnly: false,
      incomeOnly: true,
      notes: "Income-qualified only (≤300% federal poverty level). $9,000 new / $2,500 used. Point-of-sale at participating dealers. Max 3 per address.",
      url: "https://waevinstantrebates.org",
    }],
  },
  VT: {
    programs: [{
      name: "Drive Electric Vermont Incentive",
      amount: 2500,
      amountIncomeQualified: 5000,
      type: "rebate",
      bevOnly: false,
      msrpCap: 52500,
      notes: "Standard: $2,500 BEV / $1,500 PHEV (min 30-mile EV range). Enhanced (income-qualified): $5,000 BEV / $3,000 PHEV. One per individual/couple. MSRP cap $52,500.",
      url: "https://www.driveelectricvt.com",
    }],
  },
  TX: {
    programs: [{
      name: "TERP Light-Duty EV Rebate",
      amount: 2500,
      type: "rebate",
      bevOnly: false,
      notes: "TCEQ/TERP program. Application windows — check terptexas.com for current open window. New light-duty vehicles only. First-come, first-served.",
      url: "https://www.terptexas.com",
    }],
  },
  CT: {
    programs: [{
      name: "CHEAPR Rebate",
      amount: 1000,
      amountIncomeQualified: 4000,
      type: "rebate",
      bevOnly: false,
      msrpCap: 50000,
      notes: "Standard: $1,000 BEV / $500 PHEV. Rebate Plus (income-qualified + environmental justice municipality): $4,000 BEV / $2,000 PHEV. MSRP cap $50K.",
      url: "https://portal.ct.gov/cheapr",
    }],
  },
  ME: {
    programs: [{
      name: "Efficiency Maine EV Rebate",
      amount: 5000,
      amountIncomeQualified: 8000,
      type: "rebate",
      bevOnly: true,
      msrpCap: 55000,
      notes: "Moderate-income: $5,000 new / $2,000 used. Low-income: $7,000 + $1,000 bonus through Sep 2026. Must purchase Level 2 charger first. ME dealers only. BEV only.",
      url: "https://www.efficiencymaine.com/at-home/electric-vehicles/",
    }],
  },
  MD: {
    programs: [{
      name: "Maryland EV Tax Credit",
      amount: 3000,
      type: "tax_credit",
      bevOnly: false,
      msrpCap: 50000,
      notes: "Excise tax credit. Min 4 kWh battery (includes PHEVs). One per individual, 10 per business. First-come, first-served. Expires July 1, 2027.",
      url: "https://mva.maryland.gov/vehicles/Pages/electric-vehicle-excise-tax-credit.aspx",
    }],
  },
  RI: {
    programs: [{
      name: "DRIVE EV Rebate",
      amount: 1500,
      amountIncomeQualified: 3000,
      type: "rebate",
      bevOnly: false,
      msrpCap: 60000,
      notes: "Standard: $1,500 new BEV / $1,000 new PHEV / $1,000 used BEV / $750 used PHEV. DRIVE EV+ income-qualified bonus available. MSRP cap $60K new.",
      url: "https://energy.ri.gov/clean-transportation/drive-ev",
    }],
  },
};

/** Max standard (non-income-only) rebate for a state. Returns 0 if none. */
export function getStateMaxIncentive(stateCode: string): number {
  const data = STATE_INCENTIVES[stateCode];
  if (!data) return 0;
  return data.programs
    .filter((p) => !p.incomeOnly)
    .reduce((max, p) => Math.max(max, p.amount), 0);
}
