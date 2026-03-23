'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { TaxRecord } from '@/utils/types';
import HistoryChart from '@/components/HistoryChart';
import GlassCard from '@/components/ui/GlassCard';
import { formatNaira } from '@/utils/taxCalculator';
import { Calendar, Download, Search, FileBarChart, Clock } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
    compliant: { label: 'Compliant', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    filed: { label: 'Filed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    draft: { label: 'Draft', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
    exempt: { label: 'Exempt', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
};

function getStatusBadge(status: string) {
    const config = statusConfig[status] || statusConfig.draft;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
}

export default function HistoryPage() {
    const [records, setRecords] = useState<TaxRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchYear, setSearchYear] = useState('');

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

    const filteredRecords = searchYear
        ? records.filter((r) => r.year.toString().includes(searchYear))
        : records;

    const downloadRecordCSV = (record: TaxRecord) => {
        const rows = [
            ['Field', 'Value'],
            ['Year', record.year.toString()],
            ['Gross Income', record.gross_income.toString()],
            ['Rent Paid', record.rent_paid.toString()],
            ['Pension Rate (%)', record.pension_rate.toString()],
            ['Tax Shielded', record.bucket_shielded.toString()],
            ['Taxable Income', record.bucket_taxable.toString()],
            ['Tax Paid', record.bucket_gov_share.toString()],
            ['Take Home', record.bucket_take_home.toString()],
            ['Effective Rate (%)', record.gross_income > 0 ? ((record.bucket_gov_share / record.gross_income) * 100).toFixed(2) : '0'],
            ['Status', record.status],
            ['Last Updated', record.updated_at],
        ];
        const csv = rows.map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TaxFlow-Record-${record.year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
                <div className="h-80 rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <FileBarChart className="w-8 h-8 text-emerald-500" />
                        Tax History
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                        Track your tax records over the years
                    </p>
                </div>

                {/* Year Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search year..."
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                        className="pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-full sm:w-48"
                    />
                </div>
            </div>

            {/* Chart */}
            <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">
                    Overview
                </h2>
                <HistoryChart records={records} />
            </GlassCard>

            {/* Records Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-zinc-500" />
                    Records
                </h2>

                {filteredRecords.length === 0 ? (
                    <GlassCard className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <FileBarChart className="w-8 h-8 text-zinc-400" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                                {searchYear ? 'No records match your search' : 'No tax records found yet'}
                            </p>
                            <p className="text-sm text-zinc-400">
                                Your saved calculations will appear here
                            </p>
                        </div>
                    </GlassCard>
                ) : (
                    /* Data Table */
                    <div className="overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md">
                        {/* Desktop Table Header */}
                        <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/50 dark:border-zinc-700/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            <div>Year</div>
                            <div>Status</div>
                            <div className="text-right">Gross Income</div>
                            <div className="text-right">Tax Paid</div>
                            <div className="text-right">Effective Rate</div>
                            <div className="text-right">Take Home</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Table Body */}
                        {filteredRecords.map((record, idx) => (
                            <div
                                key={record.id}
                                className={`
                                    grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-4 px-6 py-4
                                    ${idx < filteredRecords.length - 1 ? 'border-b border-zinc-200/30 dark:border-zinc-700/30' : ''}
                                    hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-colors
                                `}
                            >
                                {/* Year */}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-500 md:hidden" />
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{record.year}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-end md:justify-start">
                                    {getStatusBadge(record.status)}
                                </div>

                                {/* Gross Income */}
                                <div className="md:text-right">
                                    <p className="text-xs text-zinc-500 md:hidden">Gross Income</p>
                                    <p className="font-semibold text-zinc-900 dark:text-white">{formatNaira(record.gross_income)}</p>
                                </div>

                                {/* Tax Paid */}
                                <div className="md:text-right">
                                    <p className="text-xs text-zinc-500 md:hidden">Tax Paid</p>
                                    <p className="font-semibold text-orange-600 dark:text-orange-400">{formatNaira(record.bucket_gov_share)}</p>
                                </div>

                                {/* Effective Rate */}
                                <div className="md:text-right">
                                    <p className="text-xs text-zinc-500 md:hidden">Effective Rate</p>
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                        {record.gross_income > 0 ? ((record.bucket_gov_share / record.gross_income) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>

                                {/* Take Home */}
                                <div className="md:text-right">
                                    <p className="text-xs text-zinc-500 md:hidden">Take Home</p>
                                    <p className="font-semibold text-purple-600 dark:text-purple-400">{formatNaira(record.bucket_take_home)}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end col-span-2 md:col-span-1">
                                    <button
                                        onClick={() => downloadRecordCSV(record)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        CSV
                                    </button>
                                </div>

                                {/* Last Updated (mobile only) */}
                                <div className="col-span-2 md:hidden text-xs text-zinc-400">
                                    Updated: {new Date(record.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
