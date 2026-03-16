'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'income' | 'shielded' | 'tax' | 'netpay';
    hover?: boolean;
    onClick?: () => void;
}

const variantStyles = {
    default: 'bg-white/30 dark:bg-zinc-900/30 border-white/20 dark:border-zinc-700/30',
    income: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    shielded: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    tax: 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30',
    netpay: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30',
};

export default function GlassCard({
    children,
    className = '',
    variant = 'default',
    hover = false,
    onClick,
}: GlassCardProps) {
    const baseStyles = `
    backdrop-blur-md
    rounded-2xl
    border
    shadow-lg
    shadow-black/5
    p-6
    transition-all
    duration-300
  `;

    const hoverStyles = hover
        ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 cursor-pointer'
        : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
