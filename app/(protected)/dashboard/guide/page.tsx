import GlassCard from '@/components/ui/GlassCard';

export default function TaxGuidePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    The New Nigeria Tax Law (Simplified)
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    Everything you need to know about the 2025 Tax Reforms and how they affect your wallet.
                </p>
            </div>

            <GlassCard className="prose dark:prose-invert max-w-none p-8">
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                        <span>🎉</span> The "Good News" Highlights
                    </h2>
                    <div className="grid gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                            <h3 className="font-bold text-lg mb-1">You Keep the First ₦800k</h3>
                            <p className="text-sm">The first ₦800,000 you earn every year is completely <strong>Tax-Free</strong>. If you earn ₦800,000 or less, you pay Zero Tax.</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <h3 className="font-bold text-lg mb-1">Rent Relief is Here</h3>
                            <p className="text-sm">You can now claim a tax deduction of <strong>20% of your annual rent</strong> (capped at ₦500,000). This lowers your taxable income, saving you money.</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50">
                            <h3 className="font-bold text-lg mb-1">Simple "Fairness" System</h3>
                            <p className="text-sm">Lower earners pay less. Higher earners (above ₦50m) contribute more.</p>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                        <span>🪜</span> The New "Tax Ladder" (Income Bands)
                    </h2>
                    <p className="mb-4">
                        Think of your income like climbing a ladder. You pay a different rate for each step you climb.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                    <th className="py-3 px-4 font-bold text-sm uppercase text-zinc-500 text-nowrap">Step</th>
                                    <th className="py-3 px-4 font-bold text-sm uppercase text-zinc-500 text-nowrap">Income Segment (Band)</th>
                                    <th className="py-3 px-4 font-bold text-sm uppercase text-zinc-500 text-nowrap">Tax Rate</th>
                                    <th className="py-3 px-4 font-bold text-sm uppercase text-zinc-500 min-w-[200px]">What it Means</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 1</td>
                                    <td className="py-3 px-4">First ₦800,000</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">0%</td>
                                    <td className="py-3 px-4">Tax Free. You keep all of this.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 2</td>
                                    <td className="py-3 px-4">Next ₦2,200,000</td>
                                    <td className="py-3 px-4 font-bold text-amber-600">15%</td>
                                    <td className="py-3 px-4">You pay 15k on every 100k in this step.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 3</td>
                                    <td className="py-3 px-4">Next ₦9,000,000</td>
                                    <td className="py-3 px-4 font-bold text-amber-600">18%</td>
                                    <td className="py-3 px-4">Rate increases slightly as you earn more.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 4</td>
                                    <td className="py-3 px-4">Next ₦13,000,000</td>
                                    <td className="py-3 px-4 font-bold text-orange-600">21%</td>
                                    <td className="py-3 px-4">For mid-to-high income earners.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 5</td>
                                    <td className="py-3 px-4">Next ₦25,000,000</td>
                                    <td className="py-3 px-4 font-bold text-orange-600">23%</td>
                                    <td className="py-3 px-4">High income bracket.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Step 6</td>
                                    <td className="py-3 px-4">Above ₦50,000,000</td>
                                    <td className="py-3 px-4 font-bold text-red-600">25%</td>
                                    <td className="py-3 px-4">The maximum rate for the wealthy.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-200 dark:border-yellow-800/30">
                        <strong>Note:</strong> The bands are cumulative. You don't pay 25% on your whole salary just because you earn ₦51m. You only pay 25% on the amount ABOVE ₦50m.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                        <span>🛡️</span> What Deductions Can I Claim?
                    </h2>
                    <p className="mb-4">
                        Before we calculate your tax, we remove "Tax-Exempt" items. These lower your chargeable income.
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-4">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 text-xl">✓</span>
                            <div>
                                <strong>Pension:</strong> 8% of your income goes to your future. This is tax-free.
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 text-xl">✓</span>
                            <div>
                                <strong>Rent Relief:</strong> 20% of your rent (max ₦500k) is deducted.
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 text-xl">✓</span>
                            <div>
                                <strong>NHF (Housing Fund):</strong> 2.5% of your income (if applicable) is tax-free.
                            </div>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500 text-xl">✓</span>
                            <div>
                                <strong>Health Insurance:</strong> Premiums paid for NHIS are tax-free.
                            </div>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                        Example Calculation (Real World)
                    </h2>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className="mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                            <h3 className="font-semibold text-lg">Scenario: Emeka</h3>
                            <p>Emeka earns <strong>₦3,000,000</strong> per year and pays <strong>₦500,000</strong> rent.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-sm uppercase text-zinc-500 mb-2">Step 1: Deductions</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Gross Income:</span>
                                        <span className="font-medium">₦3,000,000</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Pension (8%):</span>
                                        <span>-₦240,000</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Rent Relief (20% of 500k):</span>
                                        <span>-₦100,000</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold">
                                        <span>Taxable Income:</span>
                                        <span>₦2,660,000</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm uppercase text-zinc-500 mb-2">Step 2: Applying the Ladder</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>First ₦800,000 (0%):</span>
                                        <span className="font-medium">₦0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Next ₦1,860,000 (15%):</span>
                                        <span className="text-orange-600 font-medium">₦279,000</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold text-lg">
                                        <span>Total Tax Payable:</span>
                                        <span className="text-orange-600">₦279,000</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 text-right mt-1">Approx ₦23,250 per month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </GlassCard>
        </div>
    );
}
