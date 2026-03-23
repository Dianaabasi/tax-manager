'use client';

import { motion } from 'framer-motion';
import { useTaxStore } from '@/store/taxStore';
import { UserCategory } from '@/utils/types';
import { User, Building2, Landmark } from 'lucide-react';

const categories: { key: UserCategory; label: string; icon: typeof User }[] = [
    { key: 'individual', label: 'Individual', icon: User },
    { key: 'small_business', label: 'Small Business', icon: Building2 },
    { key: 'large_business', label: 'Large Business', icon: Landmark },
];

export default function CategorySwitcher() {
    const { activeCategory, setActiveCategory } = useTaxStore();

    return (
        <div className="relative flex p-1 rounded-2xl bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-white/30 dark:border-zinc-700/50 shadow-lg shadow-black/5">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;

                return (
                    <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`
                            relative flex-1 flex items-center justify-center gap-2
                            px-4 py-3 rounded-xl text-sm font-medium
                            transition-colors duration-200 z-10
                            ${isActive
                                ? 'text-white'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }
                        `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeCategoryBg"
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <span className="relative flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{cat.label}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
