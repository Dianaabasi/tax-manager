import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const categories = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'Employees, Freelancers, Self-employed professionals',
    icon: '👤',
    color: 'from-blue-500 to-cyan-500',
    features: ['PAYE Calculator', 'Rent Relief', 'Pension Tracking'],
  },
  {
    id: 'small_business',
    title: 'Small Business',
    description: 'Businesses with turnover under ₦100M',
    icon: '🏪',
    color: 'from-emerald-500 to-teal-500',
    features: ['Zero-Tax Certificate', 'Compliance Tracker', 'Filing Reminders'],
  },
  {
    id: 'large_business',
    title: 'Large Business',
    description: 'Corporations with turnover over ₦100M',
    icon: '🏢',
    color: 'from-purple-500 to-pink-500',
    features: ['Corporate Tax', 'Withholding Tax', 'Multi-Year Planning'],
  },
];

export default async function HomePage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Check onboarding status
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      redirect('/dashboard');
    } else {
      redirect('/onboarding');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="TaxFlow" className="h-16 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
            Master Your Money.
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Understand Your Tax.
            </span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Nigeria&apos;s smartest tax calculator and manager. Visualize where your money goes,
            maximize your reliefs, and stay compliant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all"
            >
              Calculate My Tax →
            </Link>
            <Link
              href="#categories"
              className="px-8 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Bucket Animation Preview */}
            <div className="flex justify-center items-end gap-6 md:gap-12">
              {[
                { label: 'Income', fill: '80%', color: 'from-emerald-400 to-teal-500' },
                { label: 'Shielded', fill: '45%', color: 'from-blue-400 to-cyan-500' },
                { label: 'Taxable', fill: '35%', color: 'from-amber-400 to-yellow-500' },
                { label: 'Tax', fill: '15%', color: 'from-orange-400 to-red-500' },
                { label: 'Take Home', fill: '65%', color: 'from-purple-400 to-pink-500' },
              ].map((bucket, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {bucket.label}
                  </span>
                  <div className="relative w-16 h-24 rounded-b-xl rounded-t-md bg-white/30 dark:bg-zinc-800/30 border border-white/40 dark:border-zinc-700/40 backdrop-blur-sm overflow-hidden shadow-lg">
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${bucket.color}`}
                      style={{ height: bucket.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
              Watch your income flow through the tax system in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Choose Your Category
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Select the category that best describes you to get a personalized tax experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href="/register"
                className="group relative backdrop-blur-md bg-white/30 dark:bg-zinc-900/30 rounded-2xl border border-white/40 dark:border-zinc-700/50 p-8 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${cat.color} mb-6`}
                >
                  {cat.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {cat.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  {cat.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {cat.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="text-emerald-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xl">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-emerald-50/50 dark:to-emerald-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              More Than a Calculator
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We help you manage your taxes all year round
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Visual Tax Flow', desc: 'See exactly where your money goes with animated bucket visualizations' },
              { icon: '🛡️', title: 'Maximize Reliefs', desc: 'Never miss a relief – rent, pension, CRA all calculated automatically' },
              { icon: '📅', title: 'Compliance Tracker', desc: 'Get reminders for filing deadlines and stay compliant' },
              { icon: '📈', title: 'Historical Data', desc: 'Track your tax over multiple years and spot trends' },
              { icon: '🎯', title: 'Salary Negotiator', desc: 'Reverse calculate what gross salary you need for your target net pay' },
              { icon: '📄', title: 'Generate Certificates', desc: 'Get zero-tax certificates and other documents instantly' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-zinc-900/50 border border-white/40 dark:border-zinc-700/50"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Join thousands of Nigerians who understand their taxes better
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transition-all"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/logo.png" alt="TaxFlow" className="h-16 w-auto" />
          </div>
          <p className="text-sm text-zinc-500">
            © 2025 TaxFlow. Master your money, understand your tax.
          </p>
        </div>
      </footer>
    </div>
  );
}
