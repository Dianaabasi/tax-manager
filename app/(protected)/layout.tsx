import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/utils/auth';

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getProfile();

    if (!profile) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white"
                        >
                            <img src="/logo.png" alt="TaxFlow" className="h-16 w-auto" />
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/history"
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                History
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-zinc-900 dark:text-white leading-none">
                                        {profile.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                        {profile.email}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {profile.full_name?.[0] || profile.email?.[0] || 'U'}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <img src="/logo.png" alt="TaxFlow" className="h-16 w-auto" />

                        <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                            <Link href="/dashboard/guide" className="hover:text-emerald-500 transition-colors">
                                2025 Tax Guide
                            </Link>
                            <Link href="/dashboard/history" className="hover:text-emerald-500 transition-colors">
                                History
                            </Link>
                            <Link href="/dashboard/profile" className="hover:text-emerald-500 transition-colors">
                                Profile
                            </Link>
                        </div>

                        <p className="text-sm text-zinc-500">
                            © {new Date().getFullYear()} TaxFlow
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
