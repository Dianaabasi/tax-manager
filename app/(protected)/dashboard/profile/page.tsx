'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserProfile } from '@/utils/types';
import GlassCard from '@/components/ui/GlassCard';
import { signOut } from '@/utils/auth';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    Your Profile
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                    Manage your account settings
                </p>
            </div>

            <GlassCard className="space-y-6">
                {/* User Avatar Placeholder */}
                <div className="flex flex-col items-center pb-6 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg mb-4">
                        {profile?.full_name?.[0] || profile?.email?.[0] || 'U'}
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        {profile?.full_name || 'User'}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        {profile?.email}
                    </p>
                    <div className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 capitalize">
                        {profile?.category?.replace('_', ' ') || 'Individual'}
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                        Account Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <span className="text-xs text-zinc-50 uppercase tracking-wider">Account Type</span>
                            <p className="font-medium text-zinc-900 dark:text-white capitalize mt-1">
                                {profile?.category?.replace('_', ' ')}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <span className="text-xs text-zinc-50 uppercase tracking-wider">Member Since</span>
                            <p className="font-medium text-zinc-900 dark:text-white mt-1">
                                {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-NG', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout Action */}
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
}
