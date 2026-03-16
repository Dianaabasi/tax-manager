import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaxFlow - Master Your Money, Understand Your Tax",
  description: "Nigeria's smartest tax calculator and manager. Visualize where your money goes, maximize your reliefs, and stay compliant.",
  keywords: ["tax calculator", "Nigeria", "PAYE", "tax manager", "income tax", "tax relief"],
  authors: [{ name: "TaxFlow" }],
  openGraph: {
    title: "TaxFlow - Master Your Money, Understand Your Tax",
    description: "Nigeria's smartest tax calculator and manager.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
