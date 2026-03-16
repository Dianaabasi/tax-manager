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
    };
    taxableIncome: number;
    totalTax: number;
    netPay: number;
}

export const calculateTaxBuckets = (
    grossIncome: number,
    rentPaid: number,
    pensionRate: number = 8,
    hasNhf: boolean = false
): TaxBuckets => {
    // 1. Statutory Deductions
    const pension = (grossIncome * pensionRate) / 100;
    const nhf = hasNhf ? (grossIncome * 2.5) / 100 : 0;

    // 2. Reliefs
    // CRA Calculation - Note: The user prompt for the guide page didn't explicitly mention the old "200k + 20%" CRA equation in the "Deductions" section.
    // Ideally, if the Tax Shield section mentioned "CRA" we would use it.
    // However, the example calculation ONLY deducted Pension and Rent Relief.
    // It listed: "Total Deductions: 340,000" (Pension 240k + Rent 100k).
    // This implies the specific CRA (Consolidated Relief Allowance) might have been replaced or simplified or is just not part of this specific "Simple" explanation.
    // BUT the previous implementation included CRA. 
    // Given the explicit example provided by the user:
    // "Scenario: Emeka earns 3m... Minus Deductions: Pension (8%): -240k, Rent Relief: -100k. Total Deductions: 340k. Taxable: 2,660,000"
    // This MATCHES EXACTLY: 3m - 240k - 100k = 2.66m.
    // If CRA (200k + 20% of gross) existed, it would be another huge deduction.
    // Thus, in this new 2025 Reform logic provided by the user, the standard CRA seems to be REMOVED or replaced by the 0% band.
    // I will REMOVE CRA to match the user's specific calculation example.

    const cra = 0;

    const rentRelief = Math.min(rentPaid * 0.2, 500000); // 20% of rent, capped at 500k

    // 3. Taxable Income
    // Deduct everything tax exempt
    const totalReliefs = pension + nhf + cra + rentRelief;
    const taxableIncome = Math.max(0, grossIncome - totalReliefs);

    // 4. Calculate Tax
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
        statutoryDeductions: {
            pension,
            nhf,
        },
        reliefs: {
            cra,
            rentRelief,
        },
        taxableIncome,
        totalTax: tax,
        netPay: grossIncome - tax - pension - nhf,
    };
};

export const calculateReverseData = (targetNetPay: number): number => {
    // Simple approximation for reverse calculation
    // This is computationally expensive to solve exactly due to progressive bands
    // Using binary search approach
    let low = targetNetPay;
    let high = targetNetPay * 2; // Initial upper bound guess
    let guess = 0;

    // Find upper bound first
    while (true) {
        const res = calculateTaxBuckets(high, 0, 8, false);
        if (res.netPay >= targetNetPay) break;
        low = high;
        high *= 2;
    }

    // Binary search
    for (let i = 0; i < 20; i++) {
        guess = (low + high) / 2;
        const res = calculateTaxBuckets(guess, 0, 8, false);

        if (Math.abs(res.netPay - targetNetPay) < 100) {
            return guess;
        }

        if (res.netPay < targetNetPay) {
            low = guess;
        } else {
            high = guess;
        }
    }

    return guess;
};
