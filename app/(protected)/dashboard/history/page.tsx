'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { TaxRecord } from '@/utils/types';
import HistoryChart from '@/components/HistoryChart';
import GlassCard from '@/components/ui/GlassCard';
import { formatNaira } from '@/utils/taxCalculator';

export default function HistoryPage() {
    const [records, setRecords] = useState<TaxRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecords = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('tax_records')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('year', { ascending: false });

                setRecords(data || []);
            }
            setLoading(false);
        };

        loadRecords();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    Tax History
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    Track your tax records over the years
                </p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">
                    Overview
                </h2>
                <HistoryChart records={records} />
            </GlassCard>

            <div className="grid gap-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mt-4">
                    Records
                </h2>
                {records.length === 0 ? (
                    <GlassCard className="text-center py-12 text-zinc-500">
                        No tax records found yet.
                    </GlassCard>
                ) : (
                    records.map((record) => (
                        <GlassCard key={record.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {record.year}
                                    </span>
                                    <span className={`
                    text-xs px-2 py-1 rounded-full capitalize
                    ${record.status === 'compliant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                  `}>
                                        {record.status}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-1">
                                    Last updated: {new Date(record.updated_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 flex-1 md:justify-end">
                                <div>
                                    <p className="text-xs text-zinc-500">Gross Income</p>
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                        {formatNaira(record.gross_income)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Tax Paid</p>
                                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                                        {formatNaira(record.bucket_gov_share)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Effective Rate</p>
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                        {record.gross_income > 0 ? ((record.bucket_gov_share / record.gross_income) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Take Home</p>
                                    <p className="font-semibold text-purple-600 dark:text-purple-400">
                                        {formatNaira(record.bucket_take_home)}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
}
