import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col">
            {/* Header */}
            <header className="p-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white"
                >
                    <img src="/logo.png" alt="TaxFlow" className="h-8 w-auto" />
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-sm text-zinc-500">
                © 2026 TaxFlow. Master your money, understand your tax.
            </footer>
        </div>
    );
}
