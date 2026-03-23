# TaxFlow 🇳🇬

> **Nigerian Tax Management SaaS** — Calculate, understand, and manage your taxes under the Nigeria Tax Act 2026.

TaxFlow is a modern, full-stack web application that makes Nigerian personal income tax and business tax transparent and interactive. Whether you're a salaried individual, a small business owner, or a large corporate, TaxFlow gives you a real-time view of your tax obligations, deductions, and take-home pay.

---

## ✨ Features

### 👤 Individual (PAYE)

- **Real-time tax calculator** — Income sliders that instantly update your tax breakdown using the 2026 progressive bands
- **Visual BucketFlow** — Animated visualization showing where your money goes (gross → deductions → taxable → tax → take-home)
- **Rent Relief** — Automatic 20% deduction on rent paid (capped at ₦500,000)
- **Pension deduction** — Configurable pension rate (default 8%)
- **NHF toggle** — National Housing Fund 2.5% deduction
- **Custom Deductions** — Add any named non-taxable relief (NHIS, union dues, etc.) and watch the calculation update live
- **Raise Negotiator** — Enter your target take-home pay and instantly see what gross salary you'd need to negotiate for
- **CSV Export** — Download a full breakdown of your tax calculation

### 🏢 Small Business

- **Business tax summary** — Turnover + Assessable Profit inputs with CIT rate applied
- **Zero-Tax Certificate** — Businesses with turnover ≤ ₦100m can generate a professionally formatted A4 PDF certificate (Section 23(1)(n), Nigeria Tax Act 2026)
- **CSV Export** — Business tax breakdown download

### 🏗️ Large Business

- **High-range turnover calculator** — Up to ₦5bn+
- **30% CIT applied to assessable profit**
- **CSV Export** — Full business breakdown

### 📁 Document Vault

- Upload and store tax-related documents (receipts, financial statements, pension slips)
- Drag-and-drop or click-to-upload
- Organised per-user, per-year in Supabase Storage
- Secure — RLS-protected, only the owner can access their files

### 📜 Tax History

- View all past tax records in a responsive data table
- Status badges (Compliant, Pending, Draft)
- Per-record CSV export
- Year search filter

### 📚 Tax Guide

- Plain-English breakdown of the Nigeria Tax Act 2026
- Tax band table with colour-coded rate badges
- All available deductions explained
- Worked example (step-by-step calculation)
- Business CIT rates at a glance

---

## 🛠 Tech Stack

| Layer            | Technology                                                      |
| ---------------- | --------------------------------------------------------------- |
| Framework        | [Next.js 14+](https://nextjs.org/) (App Router)                 |
| Styling          | [Tailwind CSS](https://tailwindcss.com/)                        |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/)                        |
| Animations       | [Framer Motion](https://www.framer.com/motion/)                 |
| Backend / Auth   | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| Icons            | [Lucide React](https://lucide.dev/)                             |
| PDF Generation   | [jsPDF](https://github.com/parallax/jsPDF)                      |
| Language         | TypeScript                                                      |

---

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧮 Tax Calculation Logic

TaxFlow uses the **2026 progressive PAYE bands** as defined in the Nigeria Tax Act 2026:

| Band              | Rate |
| ----------------- | ---- |
| First ₦800,000    | 0%   |
| Next ₦2,200,000   | 15%  |
| Next ₦9,000,000   | 18%  |
| Next ₦13,000,000  | 21%  |
| Next ₦25,000,000  | 23%  |
| Above ₦50,000,000 | 25%  |

**Core formula:**

```
Taxable Income = Gross Income
              − Pension (default 8%)
              − NHF (2.5%, if applicable)
              − Rent Relief (20% of rent, max ₦500,000)
              − Custom Deductions (user-defined)

Tax = Progressive bands applied to Taxable Income
Net Pay = Gross Income − Tax − Pension − NHF
```

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/           # Login, signup pages
│   ├── (protected)/
│   │   ├── dashboard/    # Main dashboard (individual, small biz, large biz)
│   │   │   ├── guide/    # Tax guide page
│   │   │   ├── history/  # Tax history & records
│   │   │   └── profile/  # User profile
│   │   └── onboarding/   # First-time setup flow
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # GlassCard, InputSlider, etc.
│   ├── BucketFlow.tsx    # Tax visualization
│   ├── CategorySwitcher.tsx
│   ├── CertificateGenerator.tsx
│   ├── CustomDeductionsEditor.tsx
│   ├── DocumentVault.tsx
│   └── RaiseNegotiator.tsx
├── store/
│   └── taxStore.ts       # Zustand global state
└── utils/
    ├── taxCalculator.ts  # Core tax calculation logic
    └── types.ts          # TypeScript interfaces
```

---

## 📄 Licence

MIT — feel free to use, adapt, and build on this project.

---

> Built with ❤️ for Nigerian taxpayers by DnobledotDev. _Know your tax. Own your numbers._
