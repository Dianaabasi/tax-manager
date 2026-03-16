import { create } from 'zustand';
import { TaxBuckets, TaxInput, OnboardingState, UserCategory } from '@/utils/types';
import { calculateTaxBuckets } from '@/utils/taxCalculator';

interface TaxState {
    // Input values
    input: TaxInput;

    // Calculated buckets
    buckets: TaxBuckets;

    // Current tax year
    currentYear: number;

    // Actions
    setGrossIncome: (amount: number) => void;
    setRentPaid: (amount: number) => void;
    setPensionRate: (rate: number) => void;
    setHasNhf: (has: boolean) => void;
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

const defaultBuckets: TaxBuckets = {
    grossIncome: 0,
    statutoryDeductions: { pension: 0, nhf: 0 },
    reliefs: { cra: 0, rentRelief: 0 },
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
    input: defaultInput,
    buckets: defaultBuckets,
    currentYear: new Date().getFullYear(),

    setGrossIncome: (amount: number) => {
        set((state) => ({
            input: { ...state.input, grossIncome: amount },
        }));
        get().recalculate();
    },

    setRentPaid: (amount: number) => {
        set((state) => ({
            input: { ...state.input, rentPaid: amount },
        }));
        get().recalculate();
    },

    setPensionRate: (rate: number) => {
        set((state) => ({
            input: { ...state.input, pensionRate: rate },
        }));
        get().recalculate();
    },

    setHasNhf: (has: boolean) => {
        set((state) => ({
            input: { ...state.input, hasNhf: has },
        }));
        get().recalculate();
    },

    recalculate: () => {
        const { input } = get();
        const buckets = calculateTaxBuckets(
            input.grossIncome,
            input.rentPaid,
            input.pensionRate,
            input.hasNhf
        );
        set({ buckets });
    },

    setYear: (year: number) => {
        set({ currentYear: year });
    },

    reset: () => {
        set({
            input: defaultInput,
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
