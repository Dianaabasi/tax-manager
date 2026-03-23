export const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export interface TaxBand {
    rate: number;
    limit: number;
}

// 2025 Tax Bands (Annual) based on user input
export const TAX_BANDS: TaxBand[] = [
    { rate: 0, limit: 800000 },       // First 800k is tax free
    { rate: 0.15, limit: 2200000 },   // Next 2.2m @ 15%
    { rate: 0.18, limit: 9000000 },   // Next 9m @ 18%
    { rate: 0.21, limit: 13000000 },  // Next 13m @ 21%
    { rate: 0.23, limit: 25000000 },  // Next 25m @ 23%
    { rate: 0.25, limit: Infinity },  // Above 50m @ 25%
];

export interface TaxBuckets {
    grossIncome: number;
    statutoryDeductions: {
        pension: number;
        nhf: number;
    };
    reliefs: {
        cra: number;
        rentRelief: number;
        custom: number;
    };
    taxableIncome: number;
    totalTax: number;
    netPay: number;
}

export const calculateTaxBuckets = (
    grossIncome: number,
    rentPaid: number,
    pensionRate: number = 8,
    hasNhf: boolean = false,
    customDeductionsTotal: number = 0
): TaxBuckets => {
    // 1. Statutory Deductions
    const pension = (grossIncome * pensionRate) / 100;
    const nhf = hasNhf ? (grossIncome * 2.5) / 100 : 0;

    // 2. Reliefs
    const cra = 0;
    const rentRelief = Math.min(rentPaid * 0.2, 500000); // 20% of rent, capped at 500k
    const custom = Math.max(0, customDeductionsTotal);

    // 3. Taxable Income — deduct everything tax exempt
    const totalReliefs = pension + nhf + cra + rentRelief + custom;
    const taxableIncome = Math.max(0, grossIncome - totalReliefs);

    // 4. Calculate Tax using progressive bands
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const band of TAX_BANDS) {
        if (remainingIncome <= 0) break;
        const taxableAmount = Math.min(remainingIncome, band.limit);
        tax += taxableAmount * band.rate;
        remainingIncome -= taxableAmount;
    }

    return {
        grossIncome,
        statutoryDeductions: { pension, nhf },
        reliefs: { cra, rentRelief, custom },
        taxableIncome,
        totalTax: tax,
        netPay: grossIncome - tax - pension - nhf,
    };
};

export const calculateReverseData = (
    targetNetPay: number,
    customDeductionsTotal: number = 0
): number => {
    // Binary search to find the gross that yields the target net pay
    let low = targetNetPay;
    let high = targetNetPay * 2;

    // Find upper bound
    while (true) {
        const res = calculateTaxBuckets(high, 0, 8, false, customDeductionsTotal);
        if (res.netPay >= targetNetPay) break;
        low = high;
        high *= 2;
    }

    // Binary search (20 iterations = accurate to within ₦1)
    for (let i = 0; i < 20; i++) {
        const guess = (low + high) / 2;
        const res = calculateTaxBuckets(guess, 0, 8, false, customDeductionsTotal);

        if (Math.abs(res.netPay - targetNetPay) < 1) {
            return guess;
        }

        if (res.netPay < targetNetPay) {
            low = guess;
        } else {
            high = guess;
        }
    }

    return (low + high) / 2;
};
