'use client';

import { motion } from 'framer-motion';
import { formatNaira } from '@/utils/taxCalculator';

interface TaxBucketProps {
    label: string;
    amount: number;
    maxAmount: number;
    variant: 'income' | 'shielded' | 'taxable' | 'tax' | 'netpay';
    delay?: number;
}

const gradients = {
    income: 'from-emerald-400 to-teal-500',
    shielded: 'from-blue-400 to-cyan-500',
    taxable: 'from-amber-400 to-yellow-500',
    tax: 'from-orange-400 to-red-500',
    netpay: 'from-purple-400 to-pink-500',
};

const glowColors = {
    income: 'shadow-emerald-500/30',
    shielded: 'shadow-blue-500/30',
    taxable: 'shadow-amber-500/30',
    tax: 'shadow-orange-500/30',
    netpay: 'shadow-purple-500/30',
};

export default function TaxBucket({
    label,
    amount,
    maxAmount,
    variant,
    delay = 0,
}: TaxBucketProps) {
    const fillPercentage = maxAmount > 0 ? Math.min((amount / maxAmount) * 100, 100) : 0;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Label */}
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {label}
            </span>

            {/* Bucket Container */}
            <div
                className={`
          relative w-24 h-32 rounded-b-2xl rounded-t-lg
          bg-white/20 dark:bg-zinc-800/30
          border-2 border-white/30 dark:border-zinc-700/50
          backdrop-blur-sm
          overflow-hidden
          shadow-xl ${glowColors[variant]}
        `}
            >
                {/* Water Fill */}
                <motion.div
                    className={`
            absolute bottom-0 left-0 right-0
            bg-gradient-to-t ${gradients[variant]}
          `}
                    initial={{ height: 0 }}
                    animate={{ height: `${fillPercentage}%` }}
                    transition={{
                        duration: 1.5,
                        delay,
                        ease: [0.43, 0.13, 0.23, 0.96],
                    }}
                >
                    {/* Water Surface Wave Effect */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-3"
                        animate={{
                            y: [-2, 2, -2],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <svg
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                        >
                            <path
                                d="M0 5 Q25 0 50 5 T100 5 V10 H0 Z"
                                fill="rgba(255,255,255,0.3)"
                            />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Bucket Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            {/* Amount */}
            <motion.span
                className="text-lg font-bold text-zinc-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay + 0.5 }}
            >
                {formatNaira(amount)}
            </motion.span>
        </div>
    );
}
