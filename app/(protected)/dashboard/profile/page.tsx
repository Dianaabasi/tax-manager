'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserProfile } from '@/utils/types';
import GlassCard from '@/components/ui/GlassCard';
import { signOut } from '@/utils/auth';
import { LogOut, Tag, Calendar, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

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

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Your Profile</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">Manage your account settings</p>
                </div>

                <GlassCard className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center pb-6 border-b border-zinc-200 dark:border-zinc-700">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg mb-4">
                            {profile?.full_name?.[0] || profile?.email?.[0] || 'U'}
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            {profile?.full_name || 'User'}
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400">{profile?.email}</p>
                        <div className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 capitalize">
                            {profile?.category?.replace('_', ' ') || 'Individual'}
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                    <Tag className="w-3 h-3" /> Account Type
                                </div>
                                <p className="font-medium text-zinc-900 dark:text-white capitalize mt-1">
                                    {profile?.category?.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider mb-1">
                                    <Calendar className="w-3 h-3" /> Member Since
                                </div>
                                <p className="font-medium text-zinc-900 dark:text-white mt-1">
                                    {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-NG', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={() => setShowSignOutModal(true)}
                            className="w-full py-3 px-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </GlassCard>
            </div>

            {/* ── Sign Out Confirmation Modal ── */}
            <AnimatePresence>
                {showSignOutModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSignOutModal(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                            Sign Out
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowSignOutModal(false)}
                                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 pb-6">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                                        Are you sure you want to sign out of TaxFlow? Your data is safely saved and you can sign back in anytime.
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowSignOutModal(false)}
                                            disabled={signingOut}
                                            className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSignOut}
                                            disabled={signingOut}
                                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {signingOut ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Signing out...
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="w-4 h-4" />
                                                    Yes, sign out
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
