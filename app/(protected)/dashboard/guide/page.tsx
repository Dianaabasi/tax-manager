import GlassCard from '@/components/ui/GlassCard';
import {
    ShieldCheck,
    TrendingUp,
    Home,
    Heart,
    Building2,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    Plus,
} from 'lucide-react';

const TAX_BANDS = [
    { step: 1, band: 'First ₦800,000', rate: '0%', color: 'emerald', desc: 'Completely tax-free — you keep every kobo.' },
    { step: 2, band: 'Next ₦2,200,000', rate: '15%', color: 'yellow', desc: '₦15 on every ₦100 earned in this bracket.' },
    { step: 3, band: 'Next ₦9,000,000', rate: '18%', color: 'amber', desc: 'Slightly higher as income grows.' },
    { step: 4, band: 'Next ₦13,000,000', rate: '21%', color: 'orange', desc: 'Mid-to-high income range.' },
    { step: 5, band: 'Next ₦25,000,000', rate: '23%', color: 'orange', desc: 'High income bracket.' },
    { step: 6, band: 'Above ₦50,000,000', rate: '25%', color: 'red', desc: 'Maximum rate — only on income above ₦50m.' },
];

const RATE_COLORS: Record<string, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
};

const DEDUCTIONS = [
    {
        icon: TrendingUp,
        color: 'blue',
        title: 'Pension Contribution',
        detail: '8% of your gross income is deducted before tax is calculated. You can adjust this rate in the calculator.',
    },
    {
        icon: Home,
        color: 'teal',
        title: 'Rent Relief',
        detail: '20% of your annual rent is deductible, capped at ₦500,000. If you pay ₦2,500,000 rent, you deduct ₦500,000.',
    },
    {
        icon: Building2,
        color: 'indigo',
        title: 'NHF (National Housing Fund)',
        detail: '2.5% of your basic salary contributed to the NHF is tax-exempt. Toggle this in the calculator if applicable.',
    },
    {
        icon: Heart,
        color: 'rose',
        title: 'NHIS / Health Insurance',
        detail: 'Premiums paid for the National Health Insurance Scheme are deductible. Add it as a custom deduction.',
    },
    {
        icon: ShieldCheck,
        color: 'purple',
        title: 'Custom / Other Reliefs',
        detail: 'Union dues, professional subscriptions, and other approved non-taxable allowances can be added as custom deductions in the calculator.',
    },
    {
        icon: Plus,
        color: 'emerald',
        title: 'More Reliefs',
        detail: 'The law may allow additional deductions (life assurance premiums, etc.). Consult a certified tax consultant for your specific situation.',
    },
];

const COLOR_MAP: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
};

export default function TaxGuidePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10">

            {/* ── Hero Header ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 md:p-10 text-white shadow-xl shadow-emerald-900/20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-emerald-200 text-sm font-semibold tracking-widest uppercase mb-1">Nigeria Tax Act 2026</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                            The New Tax Law,<br />Simply Explained
                        </h1>
                        <p className="text-emerald-100 text-base max-w-xl">
                            Everything you need to know about the 2026 tax reforms — the new income bands, what you can deduct, and exactly how your tax is calculated.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Good News Highlights ── */}
            <section>
                <SectionHeader emoji="🎉" label="The Good News" title="What Changed in Your Favour" />
                <div className="grid sm:grid-cols-3 gap-4 mt-5">
                    <HighlightCard
                        color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50"
                        emoji="💵"
                        title="First ₦800k is Tax-Free"
                        body="Every Nigerian earner gets to keep the first ₦800,000 completely untaxed. Earn ₦800k or less? You pay zero tax."
                    />
                    <HighlightCard
                        color="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50"
                        emoji="🏠"
                        title="Rent Relief Introduced"
                        body="Claim 20% of your annual rent as a deduction (capped at ₦500,000). This directly lowers the income your tax is calculated on."
                    />
                    <HighlightCard
                        color="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50"
                        emoji="⚖️"
                        title="Progressive & Fair"
                        body="Lower earners pay significantly less. Only income above ₦50m attracts the 25% top rate — and only on that excess."
                    />
                </div>
            </section>

            {/* ── Tax Bands Table ── */}
            <section>
                <SectionHeader emoji="🪜" label="Income Bands" title='The New "Tax Ladder"' />
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
                    Your tax is calculated in steps. You move up the ladder only for income in that bracket — not your entire salary.
                </p>
                <GlassCard className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Step</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Income Band</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Rate</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500 min-w-[220px]">Plain English</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                                {TAX_BANDS.map(({ step, band, rate, color, desc }) => (
                                    <tr key={step} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500">
                                                {step}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">{band}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${RATE_COLORS[color]}`}>
                                                {rate}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
                <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 text-sm text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                        <strong>Important:</strong> The bands are cumulative. If you earn ₦51m, you don&apos;t pay 25% on all of it — only on the ₦1m above ₦50m.
                    </span>
                </div>
            </section>

            {/* ── Deductions ── */}
            <section>
                <SectionHeader emoji="🛡️" label="Deductions & Reliefs" title="What Can You Deduct?" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
                    These items are subtracted from your gross income before tax is applied, reducing what you owe.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {DEDUCTIONS.map(({ icon: Icon, color, title, detail }) => (
                        <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 backdrop-blur-sm">
                            <div className={`p-2 rounded-lg shrink-0 ${COLOR_MAP[color]}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-zinc-900 dark:text-white mb-0.5">{title}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Worked Example ── */}
            <section>
                <SectionHeader emoji="🧮" label="Worked Example" title="Step-by-Step Calculation" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
                    Let&apos;s walk through how Emeka&apos;s tax is calculated.
                </p>
                <GlassCard>
                    {/* Scenario banner */}
                    <div className="flex flex-wrap items-center gap-4 px-5 py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shrink-0">E</div>
                        <div>
                            <p className="font-bold text-zinc-900 dark:text-white">Emeka</p>
                            <p className="text-sm text-zinc-500">Earns <strong className="text-zinc-700 dark:text-zinc-200">₦3,000,000/yr</strong> · Pays <strong className="text-zinc-700 dark:text-zinc-200">₦500,000</strong> rent · 8% pension</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Step 1 */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Step 1 — Remove Deductions</p>
                            <div className="space-y-2 text-sm">
                                <CalcRow label="Gross Income" value="₦3,000,000" />
                                <CalcRow label="Pension (8%)" value="−₦240,000" negative />
                                <CalcRow label="Rent Relief (20% of ₦500k)" value="−₦100,000" negative />
                                <div className="pt-3 mt-1 border-t border-zinc-200 dark:border-zinc-700">
                                    <CalcRow label="Taxable Income" value="₦2,660,000" bold />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Step 2 — Apply the Ladder</p>
                            <div className="space-y-2 text-sm">
                                <CalcRow label="First ₦800,000 @ 0%" value="₦0" muted />
                                <CalcRow label="Next ₦1,860,000 @ 15%" value="₦279,000" orange />
                                <div className="pt-3 mt-1 border-t border-zinc-200 dark:border-zinc-700">
                                    <CalcRow label="Total Tax Due" value="₦279,000" bold orange />
                                </div>
                            </div>
                            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        Emeka pays ~₦23,250/month in tax — just 9.3% effective rate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </section>

            {/* ── Business Tax Brief ── */}
            <section>
                <SectionHeader emoji="🏢" label="For Businesses" title="Company Income Tax (CIT) at a Glance" />
                <div className="mt-5 grid sm:grid-cols-3 gap-4">
                    <HighlightCard
                        color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50"
                        emoji="🟢"
                        title="Small Company (≤₦100m)"
                        body="0% CIT — fully exempt from Company Income Tax. Eligible for a Zero-Tax Certificate via TaxFlow."
                    />
                    <HighlightCard
                        color="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50"
                        emoji="🟡"
                        title="Medium Company (₦100m–₦1bn)"
                        body="20% CIT applied to your assessable profit (net profit after allowable expenses)."
                    />
                    <HighlightCard
                        color="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50"
                        emoji="🔴"
                        title="Large Company (›₦1bn)"
                        body="30% CIT applied to your assessable profit. Requires full audited accounts to determine liability."
                    />
                </div>
                <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 text-center">
                    CIT rates under the Nigeria Tax Act 2026 — consult a certified tax consultant for filing obligations.
                </p>
            </section>

        </div>
    );
}

/* ── Helpers ── */

function SectionHeader({ emoji, label, title }: { emoji: string; label: string; title: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{label}</p>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
            </div>
        </div>
    );
}

function HighlightCard({ color, emoji, title, body }: { color: string; emoji: string; title: string; body: string }) {
    return (
        <div className={`p-5 rounded-xl border ${color}`}>
            <div className="text-3xl mb-3">{emoji}</div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">{title}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{body}</p>
        </div>
    );
}

function CalcRow({
    label, value, negative, bold, muted, orange,
}: {
    label: string;
    value: string;
    negative?: boolean;
    bold?: boolean;
    muted?: boolean;
    orange?: boolean;
}) {
    return (
        <div className="flex justify-between items-center">
            <span className={`${muted ? 'text-zinc-400' : 'text-zinc-600 dark:text-zinc-400'}`}>{label}</span>
            <span className={`
                ${bold ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium'}
                ${negative ? 'text-red-500' : ''}
                ${orange ? 'text-orange-600 dark:text-orange-400' : ''}
                ${muted ? 'text-zinc-400' : ''}
            `}>
                {value}
            </span>
        </div>
    );
}
