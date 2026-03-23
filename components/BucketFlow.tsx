'use client';

import { motion } from 'framer-motion';
import TaxBucket from './TaxBucket';
import { TaxBuckets } from '@/utils/types';
import { formatNaira } from '@/utils/taxCalculator';
import { Download } from 'lucide-react';
import { useTaxStore } from '@/store/taxStore';

interface BucketFlowProps {
    buckets: TaxBuckets;
}

export default function BucketFlow({ buckets }: BucketFlowProps) {
    const maxAmount = buckets.grossIncome || 1;
    const { customDeductions } = useTaxStore();
    const totalShielded =
        buckets.statutoryDeductions.pension +
        buckets.statutoryDeductions.nhf +
        buckets.reliefs.cra +
        buckets.reliefs.rentRelief +
        buckets.reliefs.custom;

    const downloadCSV = () => {
        const effectiveRate = buckets.grossIncome > 0
            ? ((buckets.totalTax / buckets.grossIncome) * 100).toFixed(2)
            : '0.00';

        const rows = [
            ['Category', 'Amount (NGN)'],
            ['Gross Income', buckets.grossIncome.toString()],
            ['Pension Deduction', buckets.statutoryDeductions.pension.toString()],
            ['NHF Deduction', buckets.statutoryDeductions.nhf.toString()],
            ['Rent Relief', buckets.reliefs.rentRelief.toString()],
            ...customDeductions.map((d) => [d.label || 'Custom Deduction', d.amount.toString()]),
            ['Total Shielded', totalShielded.toString()],
            ['Taxable Income', buckets.taxableIncome.toString()],
            ['Total Tax', buckets.totalTax.toString()],
            ['Net Pay (Take Home)', buckets.netPay.toString()],
            ['Effective Tax Rate (%)', effectiveRate],
        ];

        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TaxFlow-Breakdown-${new Date().getFullYear()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full">
            {/* Flow Header */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Your Tax Flow
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Watch how your income flows through the tax system
                </p>
            </div>

            {/* Buckets Container */}
            <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8">
                <TaxBucket label="Gross Income" amount={buckets.grossIncome} maxAmount={maxAmount} variant="income" delay={0} />

                <motion.div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </motion.div>

                <TaxBucket label="Tax Shielded" amount={totalShielded} maxAmount={maxAmount} variant="shielded" delay={0.3} />

                <motion.div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </motion.div>

                <TaxBucket label="Taxable" amount={buckets.taxableIncome} maxAmount={maxAmount} variant="taxable" delay={0.6} />

                <motion.div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </motion.div>

                <TaxBucket label="Government Cut" amount={buckets.totalTax} maxAmount={maxAmount} variant="tax" delay={0.9} />

                <motion.div className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </motion.div>

                <TaxBucket label="Take Home" amount={buckets.netPay} maxAmount={maxAmount} variant="netpay" delay={1.2} />
            </div>

            {/* Summary Cards */}
            <motion.div
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
            >
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Pension</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {formatNaira(buckets.statutoryDeductions.pension)}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <p className="text-sm text-teal-600 dark:text-teal-400">Rent Relief</p>
                    <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
                        {formatNaira(buckets.reliefs.rentRelief)}
                    </p>
                </div>
                {buckets.reliefs.custom > 0 && (
                    <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                        <p className="text-sm text-sky-600 dark:text-sky-400">Custom Reliefs</p>
                        <p className="text-lg font-bold text-sky-700 dark:text-sky-300">
                            {formatNaira(buckets.reliefs.custom)}
                        </p>
                    </div>
                )}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm text-orange-600 dark:text-orange-400">Effective Rate</p>
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {buckets.grossIncome > 0
                            ? ((buckets.totalTax / buckets.grossIncome) * 100).toFixed(1)
                            : '0.0'}%
                    </p>
                </div>
            </motion.div>

            {/* CSV Download */}
            {buckets.grossIncome > 0 && (
                <motion.div
                    className="mt-6 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                >
                    <button
                        onClick={downloadCSV}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm hover:shadow-md"
                    >
                        <Download className="w-4 h-4" />
                        Download Breakdown (CSV)
                    </button>
                </motion.div>
            )}
        </div>
    );
}
