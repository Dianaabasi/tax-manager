'use client';

import { useState, useMemo } from 'react';
import { useTaxStore } from '@/store/taxStore';
import { calculateReverseData, formatNaira, calculateTaxBuckets } from '@/utils/taxCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, ArrowRight } from 'lucide-react';
import InputSlider from '@/components/ui/InputSlider';

export default function RaiseNegotiator() {
    const { activeCategory } = useTaxStore();
    const [targetMonthlyNet, setTargetMonthlyNet] = useState(0);

    // Only show for individuals
    if (activeCategory !== 'individual') return null;

    const targetAnnualNet = targetMonthlyNet * 12;
    const requiredGross = useMemo(() => {
        if (targetAnnualNet <= 0) return 0;
        return calculateReverseData(targetAnnualNet);
    }, [targetAnnualNet]);

    const resultBuckets = useMemo(() => {
        if (requiredGross <= 0) return null;
        return calculateTaxBuckets(requiredGross, 0, 8, false);
    }, [requiredGross]);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Raise Negotiator</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Find out the gross salary you need to hit your target take-home
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <InputSlider
                    label="Target Monthly Take-Home"
                    value={targetMonthlyNet}
                    min={0}
                    max={10000000}
                    step={50000}
                    onChange={setTargetMonthlyNet}
                    icon={<Target className="w-4 h-4 text-amber-500" />}
                />
            </div>

            <AnimatePresence mode="wait">
                {targetMonthlyNet > 0 && requiredGross > 0 && resultBuckets && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15 border border-amber-500/30 p-6 backdrop-blur-md"
                    >
                        {/* Decorative bg */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                        <div className="relative space-y-5">
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                💡 Here&apos;s your negotiation insight
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {/* Target */}
                                <div className="flex-1 text-center p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                                    <p className="text-xs text-zinc-500 mb-1">Target Take-Home</p>
                                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                        {formatNaira(targetMonthlyNet)}
                                        <span className="text-sm font-normal text-zinc-500">/mo</span>
                                    </p>
                                </div>

                                <ArrowRight className="w-6 h-6 text-amber-500 rotate-90 sm:rotate-0 shrink-0" />

                                {/* Required Gross */}
                                <div className="flex-1 text-center p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 backdrop-blur-sm">
                                    <p className="text-xs text-zinc-500 mb-1">Negotiate This Gross Salary</p>
                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatNaira(Math.round(requiredGross / 12))}
                                        <span className="text-sm font-normal text-zinc-500">/mo</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 rounded-xl bg-white/40 dark:bg-zinc-800/40">
                                    <p className="text-xs text-zinc-500">Annual Gross</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {formatNaira(Math.round(requiredGross))}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/40 dark:bg-zinc-800/40">
                                    <p className="text-xs text-zinc-500">Annual Tax</p>
                                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                        {formatNaira(Math.round(resultBuckets.totalTax))}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/40 dark:bg-zinc-800/40">
                                    <p className="text-xs text-zinc-500">Effective Rate</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {((resultBuckets.totalTax / requiredGross) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
