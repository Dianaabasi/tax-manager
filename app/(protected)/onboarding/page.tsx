'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import InputSlider from '@/components/ui/InputSlider';
import { useOnboardingStore } from '@/store/taxStore';
import { UserCategory } from '@/utils/types';
import { formatNaira } from '@/utils/taxCalculator';
import { createClient } from '@/utils/supabase/client';

const categories = [
    {
        id: 'individual' as UserCategory,
        title: 'Individual',
        description: 'Employees, Freelancers, Self-employed',
        icon: '👤',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'small_business' as UserCategory,
        title: 'Small Business',
        description: 'Turnover < ₦100M annually',
        icon: '🏪',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'large_business' as UserCategory,
        title: 'Large Business',
        description: 'Turnover > ₦100M annually',
        icon: '🏢',
        color: 'from-purple-500 to-pink-500',
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { state, setStep, setCategory, setGrossIncome, setRentPaid, setHasPension, setPensionRate } = useOnboardingStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCategorySelect = (category: UserCategory) => {
        setCategory(category);
        setStep(2);
    };

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

            // Update profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    category: state.category,
                    onboarding_completed: true,
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // Create initial tax record
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
            setError(err.message || 'Something went wrong');
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (state.step) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Let&apos;s get started!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Select your category to personalize your experience
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {categories.map((cat) => (
                                <GlassCard
                                    key={cat.id}
                                    hover
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`cursor-pointer ${state.category === cat.id
                                            ? 'ring-2 ring-emerald-500 ring-offset-2'
                                            : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`
                        w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                        bg-gradient-to-br ${cat.color}
                      `}
                                        >
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-white">
                                                {cat.title}
                                            </h3>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {cat.description}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                What&apos;s your gross income?
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Enter your annual gross income before any deductions
                            </p>
                        </div>

                        <GlassCard>
                            <InputSlider
                                label="Annual Gross Income"
                                value={state.grossIncome}
                                min={0}
                                max={50000000}
                                step={100000}
                                onChange={setGrossIncome}
                                icon={<span>💵</span>}
                            />
                        </GlassCard>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={state.grossIncome === 0}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Do you pay rent?
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                You can get up to 20% rent relief (max ₦500,000)
                            </p>
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
                                    💡 Your rent relief: {formatNaira(Math.min(state.rentPaid * 0.2, 500000))}
                                </div>
                            )}
                        </GlassCard>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                Pension Contribution
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Do you contribute to a pension scheme?
                            </p>
                        </div>

                        <GlassCard>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        I contribute to pension
                                    </span>
                                    <button
                                        onClick={() => setHasPension(!state.hasPension)}
                                        className={`
                      relative w-14 h-8 rounded-full transition-colors
                      ${state.hasPension ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}
                    `}
                                    >
                                        <span
                                            className={`
                        absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform
                        ${state.hasPension ? 'left-7' : 'left-1'}
                      `}
                                        />
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
                                            💰 Your pension: {formatNaira(state.grossIncome * (state.pensionRate / 100))}
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

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Saving...' : 'Complete Setup'}
                            </button>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${step <= state.step
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                                }
              `}
                        >
                            {step}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${(state.step / 4) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
    );
}
