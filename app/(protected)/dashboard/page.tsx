'use client';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useTaxStore } from '@/store/taxStore';
import { createClient } from '@/utils/supabase/client';
import { TaxRecord } from '@/utils/types';
import { calculateTaxBuckets, formatNaira } from '@/utils/taxCalculator';
import GlassCard from '@/components/ui/GlassCard';
import InputSlider from '@/components/ui/InputSlider';
import BucketFlow from '@/components/BucketFlow';

export default function DashboardPage() {
    const { input, buckets, setGrossIncome, setRentPaid, setPensionRate, recalculate } = useTaxStore();
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [currentRecord, setCurrentRecord] = useState<TaxRecord | null>(null);

    // Load existing tax record on mount
    useEffect(() => {
        const loadRecord = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const currentYear = new Date().getFullYear();
            const { data: record } = await supabase
                .from('tax_records')
                .select('*')
                .eq('user_id', user.id)
                .eq('year', currentYear)
                .single();

            if (record) {
                setCurrentRecord(record);
                setGrossIncome(record.gross_income);
                setRentPaid(record.rent_paid);
                setPensionRate(record.pension_rate);
            }
        };

        loadRecord();
    }, [setGrossIncome, setRentPaid, setPensionRate]);

    // Auto-save when values change (debounced)
    useEffect(() => {
        const saveTimer = setTimeout(async () => {
            if (input.grossIncome === 0) return;

            setSaving(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setSaving(false);
                return;
            }

            const currentYear = new Date().getFullYear();
            const calculatedBuckets = calculateTaxBuckets(
                input.grossIncome,
                input.rentPaid,
                input.pensionRate,
                input.hasNhf
            );

            const totalShielded =
                calculatedBuckets.statutoryDeductions.pension +
                calculatedBuckets.statutoryDeductions.nhf +
                calculatedBuckets.reliefs.cra +
                calculatedBuckets.reliefs.rentRelief;

            await supabase
                .from('tax_records')
                .upsert({
                    user_id: user.id,
                    year: currentYear,
                    gross_income: input.grossIncome,
                    rent_paid: input.rentPaid,
                    pension_rate: input.pensionRate,
                    bucket_shielded: totalShielded,
                    bucket_taxable: calculatedBuckets.taxableIncome,
                    bucket_gov_share: calculatedBuckets.totalTax,
                    bucket_take_home: calculatedBuckets.netPay,
                    status: 'pending',
                    updated_at: new Date().toISOString(),
                });

            setSaving(false);
            setLastSaved(new Date());
        }, 1000);

        return () => clearTimeout(saveTimer);
    }, [input]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Tax Dashboard
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                        {new Date().getFullYear()} Tax Year
                    </p>
                </div>
                <div className="text-right">
                    {saving ? (
                        <span className="text-sm text-amber-600 dark:text-amber-400">
                            Saving...
                        </span>
                    ) : lastSaved ? (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">
                            ✓ Last saved {lastSaved.toLocaleTimeString()}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Input Controls */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard>
                    <InputSlider
                        label="Annual Gross Income"
                        value={input.grossIncome}
                        min={0}
                        max={100000000}
                        step={100000}
                        onChange={setGrossIncome}
                        icon={<span className="text-lg">💵</span>}
                    />
                </GlassCard>

                <GlassCard>
                    <InputSlider
                        label="Annual Rent Paid"
                        value={input.rentPaid}
                        min={0}
                        max={20000000}
                        step={50000}
                        onChange={setRentPaid}
                        icon={<span className="text-lg">🏠</span>}
                    />
                </GlassCard>

                <GlassCard>
                    <InputSlider
                        label="Pension Rate"
                        value={input.pensionRate}
                        min={0}
                        max={20}
                        step={0.5}
                        onChange={setPensionRate}
                        formatValue={(v) => `${v}%`}
                        icon={<span className="text-lg">📈</span>}
                    />
                </GlassCard>
            </div>

            {/* Bucket Flow Visualization */}
            <GlassCard className="p-8">
                <BucketFlow buckets={buckets} />
            </GlassCard>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard variant="income">
                    <div className="text-center">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                            Gross Income
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatNaira(buckets.grossIncome)}
                        </p>
                    </div>
                </GlassCard>

                <GlassCard variant="shielded">
                    <div className="text-center">
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                            Tax Shielded
                        </p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {formatNaira(
                                buckets.statutoryDeductions.pension +
                                buckets.reliefs.cra +
                                buckets.reliefs.rentRelief
                            )}
                        </p>
                    </div>
                </GlassCard>

                <GlassCard variant="tax">
                    <div className="text-center">
                        <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">
                            Total Tax
                        </p>
                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                            {formatNaira(buckets.totalTax)}
                        </p>
                    </div>
                </GlassCard>

                <GlassCard variant="netpay">
                    <div className="text-center">
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                            Take Home
                        </p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {formatNaira(buckets.netPay)}
                        </p>
                    </div>
                </GlassCard>


            </div>

            <GlassCard className="p-6 col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">📚</span> Understanding Your Tax
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
                            Confused about how the 2025 Finance Act affects you? We've broken down the new tax bands, reliefs, and exemptions in simple terms.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/guide"
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                    >
                        Read the Guide
                    </Link>
                </div>
            </GlassCard>

            {/* Monthly Breakdown */}
            <GlassCard>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
                    Monthly Breakdown
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            Monthly Gross
                        </p>
                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatNaira(buckets.grossIncome / 12)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                            Monthly Tax
                        </p>
                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                            {formatNaira(buckets.totalTax / 12)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                            Monthly Net
                        </p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                            {formatNaira(buckets.netPay / 12)}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div >
    );
}
