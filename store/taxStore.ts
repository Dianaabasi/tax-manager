import { create } from 'zustand';
import { TaxBuckets, TaxInput, OnboardingState, UserCategory, BusinessInput, CustomDeduction } from '@/utils/types';
import { calculateTaxBuckets } from '@/utils/taxCalculator';

interface TaxState {
    // Active profile category
    activeCategory: UserCategory;

    // Individual input values
    input: TaxInput;

    // Business input values
    businessInput: BusinessInput;

    // Custom non-taxable deductions
    customDeductions: CustomDeduction[];

    // Calculated buckets
    buckets: TaxBuckets;

    // Current tax year
    currentYear: number;

    // Actions
    setActiveCategory: (category: UserCategory) => void;
    setGrossIncome: (amount: number) => void;
    setRentPaid: (amount: number) => void;
    setPensionRate: (rate: number) => void;
    setHasNhf: (has: boolean) => void;
    setBusinessName: (name: string) => void;
    setAnnualTurnover: (amount: number) => void;
    setAssessableProfit: (amount: number) => void;

    // Custom deduction actions
    addCustomDeduction: () => void;
    updateCustomDeduction: (id: string, label: string, amount: number) => void;
    removeCustomDeduction: (id: string) => void;

    recalculate: () => void;
    setYear: (year: number) => void;
    reset: () => void;
}

interface OnboardingStore {
    state: OnboardingState;
    setStep: (step: number) => void;
    setCategory: (category: UserCategory) => void;
    setGrossIncome: (amount: number) => void;
    setRentPaid: (amount: number) => void;
    setHasPension: (has: boolean) => void;
    setPensionRate: (rate: number) => void;
    reset: () => void;
}

const defaultInput: TaxInput = {
    grossIncome: 0,
    rentPaid: 0,
    pensionRate: 8,
    hasNhf: false,
};

const defaultBusinessInput: BusinessInput = {
    businessName: '',
    annualTurnover: 0,
    assessableProfit: 0,
};

const defaultBuckets: TaxBuckets = {
    grossIncome: 0,
    statutoryDeductions: { pension: 0, nhf: 0 },
    reliefs: { cra: 0, rentRelief: 0, custom: 0 },
    taxableIncome: 0,
    totalTax: 0,
    netPay: 0,
};

const defaultOnboarding: OnboardingState = {
    step: 1,
    category: null,
    grossIncome: 0,
    rentPaid: 0,
    hasPension: true,
    pensionRate: 8,
};

export const useTaxStore = create<TaxState>((set, get) => ({
    activeCategory: 'individual',
    input: defaultInput,
    businessInput: defaultBusinessInput,
    customDeductions: [],
    buckets: defaultBuckets,
    currentYear: new Date().getFullYear(),

    setActiveCategory: (category: UserCategory) => {
        set({ activeCategory: category });
    },

    setGrossIncome: (amount: number) => {
        set((state) => ({ input: { ...state.input, grossIncome: amount } }));
        get().recalculate();
    },

    setRentPaid: (amount: number) => {
        set((state) => ({ input: { ...state.input, rentPaid: amount } }));
        get().recalculate();
    },

    setPensionRate: (rate: number) => {
        set((state) => ({ input: { ...state.input, pensionRate: rate } }));
        get().recalculate();
    },

    setHasNhf: (has: boolean) => {
        set((state) => ({ input: { ...state.input, hasNhf: has } }));
        get().recalculate();
    },

    setBusinessName: (name: string) => {
        set((state) => ({ businessInput: { ...state.businessInput, businessName: name } }));
    },

    setAnnualTurnover: (amount: number) => {
        set((state) => ({ businessInput: { ...state.businessInput, annualTurnover: amount } }));
    },

    setAssessableProfit: (amount: number) => {
        set((state) => ({ businessInput: { ...state.businessInput, assessableProfit: amount } }));
    },

    addCustomDeduction: () => {
        const newItem: CustomDeduction = {
            id: crypto.randomUUID(),
            label: '',
            amount: 0,
        };
        set((state) => ({ customDeductions: [...state.customDeductions, newItem] }));
    },

    updateCustomDeduction: (id: string, label: string, amount: number) => {
        set((state) => ({
            customDeductions: state.customDeductions.map((d) =>
                d.id === id ? { ...d, label, amount } : d
            ),
        }));
        get().recalculate();
    },

    removeCustomDeduction: (id: string) => {
        set((state) => ({
            customDeductions: state.customDeductions.filter((d) => d.id !== id),
        }));
        get().recalculate();
    },

    recalculate: () => {
        const { input, customDeductions } = get();
        const customTotal = customDeductions.reduce((sum, d) => sum + d.amount, 0);
        const buckets = calculateTaxBuckets(
            input.grossIncome,
            input.rentPaid,
            input.pensionRate,
            input.hasNhf,
            customTotal
        );
        set({ buckets });
    },

    setYear: (year: number) => {
        set({ currentYear: year });
    },

    reset: () => {
        set({
            input: defaultInput,
            businessInput: defaultBusinessInput,
            customDeductions: [],
            buckets: defaultBuckets,
        });
    },
}));

export const useOnboardingStore = create<OnboardingStore>((set) => ({
    state: defaultOnboarding,

    setStep: (step: number) => {
        set((s) => ({ state: { ...s.state, step } }));
    },

    setCategory: (category: UserCategory) => {
        set((s) => ({ state: { ...s.state, category } }));
    },

    setGrossIncome: (amount: number) => {
        set((s) => ({ state: { ...s.state, grossIncome: amount } }));
    },

    setRentPaid: (amount: number) => {
        set((s) => ({ state: { ...s.state, rentPaid: amount } }));
    },

    setHasPension: (has: boolean) => {
        set((s) => ({ state: { ...s.state, hasPension: has } }));
    },

    setPensionRate: (rate: number) => {
        set((s) => ({ state: { ...s.state, pensionRate: rate } }));
    },

    reset: () => {
        set({ state: defaultOnboarding });
    },
}));
