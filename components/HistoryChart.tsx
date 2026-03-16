'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { TaxRecord } from '@/utils/types';
import { formatNaira } from '@/utils/taxCalculator';

interface HistoryChartProps {
    records: TaxRecord[];
}

export default function HistoryChart({ records }: HistoryChartProps) {
    // Transform records for chart
    const chartData = records
        .sort((a, b) => a.year - b.year)
        .map((record) => ({
            year: record.year.toString(),
            income: record.gross_income,
            shielded: record.bucket_shielded,
            tax: record.bucket_gov_share,
            takeHome: record.bucket_take_home,
        }));

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
                No historical data yet. Your tax records will appear here.
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                    <p className="font-semibold text-zinc-900 dark:text-white mb-2">
                        Year {label}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name}: {formatNaira(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorShielded" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorTakeHome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis
                        dataKey="year"
                        stroke="#9ca3af"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                    />
                    <Area
                        type="monotone"
                        dataKey="shielded"
                        name="Shielded"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#colorShielded)"
                    />
                    <Area
                        type="monotone"
                        dataKey="takeHome"
                        name="Take Home"
                        stroke="#a855f7"
                        fillOpacity={1}
                        fill="url(#colorTakeHome)"
                    />
                    <Area
                        type="monotone"
                        dataKey="tax"
                        name="Tax"
                        stroke="#f97316"
                        fillOpacity={1}
                        fill="url(#colorTax)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
