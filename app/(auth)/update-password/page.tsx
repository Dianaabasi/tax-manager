'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import { KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        setDone(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => router.push('/dashboard'), 2000);
    };

    return (
        <GlassCard className="w-full max-w-md">
            {done ? (
                /* ── Success state ── */
                <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Password updated!</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Your password has been changed successfully. Redirecting you to the dashboard…
                    </p>
                </div>
            ) : (
                /* ── Form state ── */
                <>
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                            <KeyRound className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                            Set a new password
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Choose a strong password for your TaxFlow account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* New password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="At least 8 characters"
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {/* Strength indicator */}
                            {password.length > 0 && (
                                <div className="mt-2 flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors ${
                                                password.length >= i * 3
                                                    ? password.length >= 12 ? 'bg-emerald-500'
                                                        : password.length >= 8 ? 'bg-amber-400'
                                                            : 'bg-red-400'
                                                    : 'bg-zinc-200 dark:bg-zinc-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirm"
                                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirm"
                                type={showPassword ? 'text' : 'password'}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                placeholder="Re-enter your new password"
                                className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                                    confirm.length > 0 && confirm !== password
                                        ? 'border-red-400 dark:border-red-600'
                                        : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500'
                                }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                        >
                            {loading ? 'Updating password…' : 'Update Password'}
                        </button>
                    </form>
                </>
            )}
        </GlassCard>
    );
}
