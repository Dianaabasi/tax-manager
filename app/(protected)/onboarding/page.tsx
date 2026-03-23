'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import InputSlider from '@/components/ui/InputSlider';
import { useOnboardingStore } from '@/store/taxStore';
import { formatNaira } from '@/utils/taxCalculator';
import { createClient } from '@/utils/supabase/client';

const STEPS = [
    { step: 1, label: 'Income' },
    { step: 2, label: 'Rent' },
    { step: 3, label: 'Pension' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const {
        state,
        setStep,
        setGrossIncome,
        setRentPaid,
        setHasPension,
        setPensionRate,
    } = useOnboardingStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = async () => {
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Session expired. Please log in again.');
                router.push('/login');
                return;
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ category: 'individual', onboarding_completed: true })
                .eq('id', user.id);

            if (profileError) throw profileError;

            const currentYear = new Date().getFullYear();
            const { error: recordError } = await supabase
                .from('tax_records')
                .upsert({
                    user_id: user.id,
                    year: currentYear,
                    gross_income: state.grossIncome,
                    rent_paid: state.rentPaid,
                    pension_rate: state.hasPension ? state.pensionRate : 0,
                    status: 'pending',
                });

            if (recordError) throw recordError;

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (state.step) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                        <div className="text-center">
                            <div className="text-5xl mb-4">💵</div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">What&apos;s your annual income?</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter your gross income before any deductions</p>
                        </div>
                        <GlassCard>
                            <InputSlider
                                label="Annual Gross Income"
                                value={state.grossIncome}
                                min={0}
                                max={100000000}
                                step={100000}
                                onChange={setGrossIncome}
                                icon={<span>💵</span>}
                            />
                        </GlassCard>
                        <button
                            onClick={() => setStep(2)}
                            disabled={state.grossIncome === 0}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Continue →
                        </button>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                        <div className="text-center">
                            <div className="text-5xl mb-4">🏠</div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Do you pay rent?</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Claim up to 20% rent relief (max ₦500,000)</p>
                        </div>
                        <GlassCard>
                            <InputSlider
                                label="Annual Rent Paid"
                                value={state.rentPaid}
                                min={0}
                                max={10000000}
                                step={50000}
                                onChange={setRentPaid}
                                icon={<span>🏠</span>}
                            />
                            {state.rentPaid > 0 && (
                                <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm">
                                    💡 Your rent relief: <strong>{formatNaira(Math.min(state.rentPaid * 0.2, 500000))}</strong>
                                </div>
                            )}
                        </GlassCard>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all"
                            >
                                Continue →
                            </button>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                        <div className="text-center">
                            <div className="text-5xl mb-4">📈</div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Pension Contribution</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your pension contributions reduce your taxable income</p>
                        </div>
                        <GlassCard>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-700 dark:text-zinc-300">I contribute to pension</span>
                                    <button
                                        onClick={() => setHasPension(!state.hasPension)}
                                        className={`relative w-14 h-8 rounded-full transition-colors ${state.hasPension ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                                    >
                                        <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${state.hasPension ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                {state.hasPension && (
                                    <div className="pt-4">
                                        <InputSlider
                                            label="Pension Rate (%)"
                                            value={state.pensionRate}
                                            min={0}
                                            max={20}
                                            step={0.5}
                                            onChange={setPensionRate}
                                            formatValue={(v) => `${v}%`}
                                            icon={<span>📈</span>}
                                        />
                                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
                                            💰 Annual pension: <strong>{formatNaira(state.grossIncome * (state.pensionRate / 100))}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Setting up...' : '🚀 Go to Dashboard'}
                            </button>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="TaxFlow" className="h-14 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">Just a couple of details to get started</p>
                </div>

                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        {STEPS.map(({ step, label }) => (
                            <div key={step} className="flex flex-col items-center gap-1">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${state.step > step ? 'bg-emerald-500 text-white' : state.step === step ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'}`}>
                                    {state.step > step ? '✓' : step}
                                </div>
                                <span className={`text-xs ${state.step >= step ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-zinc-400'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${((state.step - 1) / (STEPS.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>
        </div>
    );
}
