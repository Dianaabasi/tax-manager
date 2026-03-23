'use client';

import { useState, useCallback } from 'react';
import { useTaxStore } from '@/store/taxStore';
import { formatNaira } from '@/utils/taxCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, ShieldCheck, Pencil, Check } from 'lucide-react';

export default function CustomDeductionsEditor() {
    const { customDeductions, addCustomDeduction, updateCustomDeduction, removeCustomDeduction } = useTaxStore();
    const [editingId, setEditingId] = useState<string | null>(null);

    const totalCustom = customDeductions.reduce((sum, d) => sum + d.amount, 0);

    const handleLabelChange = useCallback((id: string, label: string) => {
        const item = customDeductions.find((d) => d.id === id);
        if (item) updateCustomDeduction(id, label, item.amount);
    }, [customDeductions, updateCustomDeduction]);

    const handleAmountChange = useCallback((id: string, rawValue: string) => {
        const item = customDeductions.find((d) => d.id === id);
        if (!item) return;
        const amount = rawValue === '' ? 0 : Number(rawValue.replace(/[^0-9]/g, ''));
        updateCustomDeduction(id, item.label, amount);
    }, [customDeductions, updateCustomDeduction]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Custom Deductions</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Add any non-taxable allowances or reliefs</p>
                    </div>
                </div>
                <button
                    onClick={addCustomDeduction}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all border border-sky-200 dark:border-sky-800"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add
                </button>
            </div>

            <AnimatePresence initial={false}>
                {customDeductions.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50/60 dark:bg-sky-900/10 border border-sky-200/50 dark:border-sky-800/30 group">
                            {/* Label input */}
                            <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                                placeholder="e.g. Health Insurance, NHF…"
                                className="flex-1 min-w-0 px-2 py-1 text-sm bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                            />

                            {/* Amount input */}
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="text-xs text-zinc-400">₦</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={item.amount === 0 ? '' : item.amount.toLocaleString()}
                                    onChange={(e) => handleAmountChange(item.id, e.target.value)}
                                    placeholder="Amount"
                                    className="w-28 px-2 py-1 text-right text-sm font-semibold text-zinc-900 dark:text-white bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-sky-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Remove button */}
                            <button
                                onClick={() => removeCustomDeduction(item.id)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Total */}
            {customDeductions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20"
                >
                    <span className="text-sm text-sky-700 dark:text-sky-300 font-medium">Total Custom Deductions</span>
                    <span className="text-sm font-bold text-sky-700 dark:text-sky-300">{formatNaira(totalCustom)}</span>
                </motion.div>
            )}

            {customDeductions.length === 0 && (
                <p className="text-center text-xs text-zinc-400 py-2">
                    No custom deductions yet — click &quot;Add&quot; to include NHIS, Union Dues, or any other non-taxable relief
                </p>
            )}
        </div>
    );
}
