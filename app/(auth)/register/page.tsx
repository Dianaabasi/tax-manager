'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '@/utils/auth';
import GlassCard from '@/components/ui/GlassCard';

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);

        // Validate passwords match
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const result = await signUp(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        const result = await signInWithGoogle();
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <GlassCard className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Create Account
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Start managing your taxes today
                </p>
            </div>

            {/* Google Sign In Button */}
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="
          w-full py-3 px-4 rounded-xl mb-6
          bg-white dark:bg-zinc-800
          border border-zinc-200 dark:border-zinc-700
          text-zinc-700 dark:text-zinc-300
          font-medium
          flex items-center justify-center gap-3
          hover:bg-zinc-50 dark:hover:bg-zinc-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
        "
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/30 dark:bg-zinc-900/30 text-zinc-500">
                        or continue with email
                    </span>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="
              w-full px-4 py-3 rounded-xl
              bg-white/50 dark:bg-zinc-800/50
              border border-zinc-200 dark:border-zinc-700
              text-zinc-900 dark:text-white
              placeholder-zinc-400
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
              transition-all
            "
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="
              w-full px-4 py-3 rounded-xl
              bg-white/50 dark:bg-zinc-800/50
              border border-zinc-200 dark:border-zinc-700
              text-zinc-900 dark:text-white
              placeholder-zinc-400
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
              transition-all
            "
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            className="
                w-full px-4 py-3 pr-12 rounded-xl
                bg-white/50 dark:bg-zinc-800/50
                border border-zinc-200 dark:border-zinc-700
                text-zinc-900 dark:text-white
                placeholder-zinc-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                transition-all
              "
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            className="
                w-full px-4 py-3 pr-12 rounded-xl
                bg-white/50 dark:bg-zinc-800/50
                border border-zinc-200 dark:border-zinc-700
                text-zinc-900 dark:text-white
                placeholder-zinc-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                transition-all
              "
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="
            w-full py-3 px-4 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-white font-semibold
            shadow-lg shadow-emerald-500/30
            hover:shadow-xl hover:shadow-emerald-500/40
            hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            transition-all duration-300
          "
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Creating account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                    Sign in
                </Link>
            </div>
        </GlassCard>
    );
}
