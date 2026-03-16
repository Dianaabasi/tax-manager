// User category enum matching Supabase
export type UserCategory = 'individual' | 'small_business' | 'large_business';

// Tax status enum matching Supabase
export type TaxStatus = 'compliant' | 'pending' | 'exempt';

// User profile from Supabase profiles table
export interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    category: UserCategory | null;
    onboarding_completed: boolean;
    created_at: string;
}

// Tax record from Supabase tax_records table
export interface TaxRecord {
    id: string;
    user_id: string;
    year: number;
    gross_income: number;
    rent_paid: number;
    pension_rate: number;
    bucket_shielded: number;
    bucket_taxable: number;
    bucket_gov_share: number;
    bucket_take_home: number;
    status: TaxStatus;
    updated_at: string;
}

// Tax buckets for visualization
export interface TaxBuckets {
    grossIncome: number;
    statutoryDeductions: {
        pension: number;
        nhf: number; // National Housing Fund (optional)
    };
    reliefs: {
        cra: number; // Consolidated Relief Allowance
        rentRelief: number;
    };
    taxableIncome: number;
    totalTax: number;
    netPay: number;
}

// Tax band structure for Nigerian progressive tax
export interface TaxBand {
    min: number;
    max: number;
    rate: number;
}

// Onboarding step state
export interface OnboardingState {
    step: number;
    category: UserCategory | null;
    grossIncome: number;
    rentPaid: number;
    hasPension: boolean;
    pensionRate: number;
}

// Input state for tax calculator
export interface TaxInput {
    grossIncome: number;
    rentPaid: number;
    pensionRate: number;
    hasNhf: boolean;
}
