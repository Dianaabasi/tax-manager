'use client';

import { motion } from 'framer-motion';
import TaxBucket from './TaxBucket';
import { TaxBuckets } from '@/utils/types';
import { formatNaira } from '@/utils/taxCalculator';

interface BucketFlowProps {
    buckets: TaxBuckets;
}

export default function BucketFlow({ buckets }: BucketFlowProps) {
    const maxAmount = buckets.grossIncome || 1;
    const totalShielded =
        buckets.statutoryDeductions.pension +
        buckets.statutoryDeductions.nhf +
        buckets.reliefs.cra +
        buckets.reliefs.rentRelief;

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
                {/* Gross Income */}
                <TaxBucket
                    label="Gross Income"
                    amount={buckets.grossIncome}
                    maxAmount={maxAmount}
                    variant="income"
                    delay={0}
                />

                {/* Flow Arrow */}
                <motion.div
                    className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </motion.div>

                {/* Shielded Bucket */}
                <TaxBucket
                    label="Tax Shielded"
                    amount={totalShielded}
                    maxAmount={maxAmount}
                    variant="shielded"
                    delay={0.3}
                />

                {/* Flow Arrow */}
                <motion.div
                    className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </motion.div>

                {/* Taxable Income */}
                <TaxBucket
                    label="Taxable"
                    amount={buckets.taxableIncome}
                    maxAmount={maxAmount}
                    variant="taxable"
                    delay={0.6}
                />

                {/* Flow Arrow */}
                <motion.div
                    className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </motion.div>

                {/* Tax */}
                <TaxBucket
                    label="Government Cut"
                    amount={buckets.totalTax}
                    maxAmount={maxAmount}
                    variant="tax"
                    delay={0.9}
                />

                {/* Flow Arrow */}
                <motion.div
                    className="hidden md:flex items-center text-zinc-400 dark:text-zinc-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </motion.div>

                {/* Net Pay */}
                <TaxBucket
                    label="Take Home"
                    amount={buckets.netPay}
                    maxAmount={maxAmount}
                    variant="netpay"
                    delay={1.2}
                />
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
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm text-orange-600 dark:text-orange-400">Effective Rate</p>
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {buckets.grossIncome > 0
                            ? ((buckets.totalTax / buckets.grossIncome) * 100).toFixed(1)
                            : '0.0'}
                        %
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
