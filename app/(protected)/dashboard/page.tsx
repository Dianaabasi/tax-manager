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
import CategorySwitcher from '@/components/CategorySwitcher';
import DocumentVault from '@/components/DocumentVault';
import CertificateGenerator from '@/components/CertificateGenerator';
import RaiseNegotiator from '@/components/RaiseNegotiator';
import CustomDeductionsEditor from '@/components/CustomDeductionsEditor';
import { Building2, DollarSign, FileText, Briefcase, Download, Info } from 'lucide-react';

export default function DashboardPage() {
    const {
        activeCategory,
        input,
        businessInput,
        customDeductions,
        buckets,
        setGrossIncome,
        setRentPaid,
        setPensionRate,
        setBusinessName,
        setAnnualTurnover,
        setAssessableProfit,
    } = useTaxStore();

    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showProfitInfo, setShowProfitInfo] = useState(false);

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
                setGrossIncome(record.gross_income);
                setRentPaid(record.rent_paid);
                setPensionRate(record.pension_rate);
            }
        };

        loadRecord();
    }, [setGrossIncome, setRentPaid, setPensionRate]);

    // Auto-save when values change (debounced) — only for individual category
    useEffect(() => {
        if (activeCategory !== 'individual') return;

        const saveTimer = setTimeout(async () => {
            if (input.grossIncome === 0) return;

            setSaving(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setSaving(false);
                return;
            }

            const customTotal = customDeductions.reduce((sum, d) => sum + d.amount, 0);
            const currentYear = new Date().getFullYear();
            const calculatedBuckets = calculateTaxBuckets(
                input.grossIncome,
                input.rentPaid,
                input.pensionRate,
                input.hasNhf,
                customTotal
            );

            const totalShielded =
                calculatedBuckets.statutoryDeductions.pension +
                calculatedBuckets.statutoryDeductions.nhf +
                calculatedBuckets.reliefs.cra +
                calculatedBuckets.reliefs.rentRelief +
                calculatedBuckets.reliefs.custom;

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
    }, [input, customDeductions, activeCategory]);

    // Business CSV download
    const downloadBusinessCSV = () => {
        const isSmall = activeCategory === 'small_business';
        const citRate = isSmall
            ? (businessInput.annualTurnover <= 100_000_000 ? 0 : 0.20)
            : 0.30;
        const citAmount = businessInput.assessableProfit * citRate;
        const netProfit = businessInput.assessableProfit - citAmount;
        const effectiveRate = businessInput.annualTurnover > 0
            ? ((citAmount / businessInput.annualTurnover) * 100).toFixed(2)
            : '0.00';

        const rows = [
            ['Field', 'Value'],
            ['Business Name', businessInput.businessName || 'N/A'],
            ['Category', isSmall ? 'Small Business' : 'Large Business'],
            ['Annual Turnover (NGN)', businessInput.annualTurnover.toString()],
            ['Assessable Profit (NGN)', businessInput.assessableProfit.toString()],
            ['CIT Rate (%)', (citRate * 100).toFixed(0)],
            ['Company Income Tax (NGN)', citAmount.toFixed(0)],
            ['Net Profit After Tax (NGN)', netProfit.toFixed(0)],
            ['Effective Tax Rate (%)', effectiveRate],
            ['Tax Year', new Date().getFullYear().toString()],
            ['Generated', new Date().toLocaleDateString('en-NG')],
        ];

        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TaxFlow-Business-Breakdown-${new Date().getFullYear()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

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

            {/* Category Switcher */}
            <CategorySwitcher />

            {/* ============ INDIVIDUAL CATEGORY ============ */}
            {activeCategory === 'individual' && (
                <>
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

                    {/* Custom Deductions */}
                    <GlassCard>
                        <CustomDeductionsEditor />
                    </GlassCard>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <GlassCard variant="income">
                            <div className="text-center">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Gross Income</p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatNaira(buckets.grossIncome)}</p>
                            </div>
                        </GlassCard>
                        <GlassCard variant="shielded">
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Tax Shielded</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {formatNaira(buckets.statutoryDeductions.pension + buckets.reliefs.cra + buckets.reliefs.rentRelief)}
                                </p>
                            </div>
                        </GlassCard>
                        <GlassCard variant="tax">
                            <div className="text-center">
                                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Tax</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{formatNaira(buckets.totalTax)}</p>
                            </div>
                        </GlassCard>
                        <GlassCard variant="netpay">
                            <div className="text-center">
                                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Take Home</p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatNaira(buckets.netPay)}</p>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Raise Negotiator */}
                    <GlassCard>
                        <RaiseNegotiator />
                    </GlassCard>

                    {/* Monthly Breakdown */}
                    <GlassCard>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
                            Monthly Breakdown
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">Monthly Gross</p>
                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatNaira(buckets.grossIncome / 12)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <p className="text-sm text-orange-600 dark:text-orange-400">Monthly Tax</p>
                                <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{formatNaira(buckets.totalTax / 12)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <p className="text-sm text-purple-600 dark:text-purple-400">Monthly Net</p>
                                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{formatNaira(buckets.netPay / 12)}</p>
                            </div>
                        </div>
                    </GlassCard>
                </>
            )}

            {/* ============ SMALL BUSINESS CATEGORY ============ */}
            {activeCategory === 'small_business' && (
                <>
                    <div className="grid md:grid-cols-3 gap-6">
                        <GlassCard>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={businessInput.businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Enter business name"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <InputSlider
                                label="Annual Turnover"
                                value={businessInput.annualTurnover}
                                min={0}
                                max={500000000}
                                step={500000}
                                onChange={setAnnualTurnover}
                                icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                            />
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between mb-1">
                                <span />
                                <button
                                    onClick={() => setShowProfitInfo((v) => !v)}
                                    className={`p-1 rounded-lg transition-colors ${showProfitInfo ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                                    title="What is Assessable Profit?"
                                >
                                    <Info className="w-4 h-4" />
                                </button>
                            </div>
                            <InputSlider
                                label="Assessable Profit"
                                value={businessInput.assessableProfit}
                                min={0}
                                max={200000000}
                                step={100000}
                                onChange={setAssessableProfit}
                                icon={<FileText className="w-4 h-4 text-emerald-500" />}
                            />
                            {showProfitInfo && (
                                <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                                    Your net profit after allowable business expenses. Get this figure from your audited financial statements or accountant — the app cannot derive it without your full expense records.
                                </p>
                            )}
                        </GlassCard>
                    </div>

                    {/* Business Summary Card */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Business Tax Summary</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">Annual Turnover</p>
                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatNaira(businessInput.annualTurnover)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm text-blue-600 dark:text-blue-400">Assessable Profit</p>
                                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatNaira(businessInput.assessableProfit)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-sm text-amber-600 dark:text-amber-400">CIT Rate</p>
                                <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                    {businessInput.annualTurnover <= 100_000_000 ? '0%' : '20%'}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1">
                                    {businessInput.annualTurnover <= 100_000_000 ? 'Small company exemption' : 'Medium company rate'}
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Certificate Generator */}
                    <CertificateGenerator />

                    {/* CSV Download */}
                    {businessInput.annualTurnover > 0 && (
                        <div className="flex justify-center">
                            <button
                                onClick={downloadBusinessCSV}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm hover:shadow-md"
                            >
                                <Download className="w-4 h-4" />
                                Download Breakdown (CSV)
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ============ LARGE BUSINESS CATEGORY ============ */}
            {activeCategory === 'large_business' && (
                <>
                    <div className="grid md:grid-cols-3 gap-6">
                        <GlassCard>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={businessInput.businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Enter business name"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <InputSlider
                                label="Annual Turnover"
                                value={businessInput.annualTurnover}
                                min={0}
                                max={5000000000}
                                step={5000000}
                                onChange={setAnnualTurnover}
                                icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                            />
                        </GlassCard>

                        <GlassCard>
                            <div className="flex items-center justify-between mb-1">
                                <span />
                                <button
                                    onClick={() => setShowProfitInfo((v) => !v)}
                                    className={`p-1 rounded-lg transition-colors ${showProfitInfo ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                                    title="What is Assessable Profit?"
                                >
                                    <Info className="w-4 h-4" />
                                </button>
                            </div>
                            <InputSlider
                                label="Assessable Profit"
                                value={businessInput.assessableProfit}
                                min={0}
                                max={2000000000}
                                step={1000000}
                                onChange={setAssessableProfit}
                                icon={<FileText className="w-4 h-4 text-emerald-500" />}
                            />
                            {showProfitInfo && (
                                <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                                    Your net profit after allowable business expenses. Get this figure from your audited financial statements or accountant — the app cannot derive it without your full expense records.
                                </p>
                            )}
                        </GlassCard>
                    </div>

                    {/* Large Business Summary */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Business Tax Summary</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">Annual Turnover</p>
                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatNaira(businessInput.annualTurnover)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm text-blue-600 dark:text-blue-400">Assessable Profit</p>
                                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatNaira(businessInput.assessableProfit)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-600 dark:text-red-400">CIT Rate</p>
                                <p className="text-xl font-bold text-red-700 dark:text-red-300">30%</p>
                                <p className="text-xs text-zinc-500 mt-1">Large company rate</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* CSV Download */}
                    {businessInput.annualTurnover > 0 && (
                        <div className="flex justify-center">
                            <button
                                onClick={downloadBusinessCSV}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm hover:shadow-md"
                            >
                                <Download className="w-4 h-4" />
                                Download Breakdown (CSV)
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Document Vault — Available for all categories */}
            <GlassCard>
                <DocumentVault />
            </GlassCard>

            {/* Tax Guide CTA */}
            <GlassCard className="p-6 col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">📚</span> Understanding Your Tax
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
                            Confused about how the 2025 Finance Act affects you? We&apos;ve broken down the new tax bands, reliefs, and exemptions in simple terms.
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
        </div>
    );
}
