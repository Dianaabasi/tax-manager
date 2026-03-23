'use client';

import { useTaxStore } from '@/store/taxStore';
import { Award, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatNaira } from '@/utils/taxCalculator';
import { motion } from 'framer-motion';

export default function CertificateGenerator() {
    const { activeCategory, businessInput } = useTaxStore();
    const [generating, setGenerating] = useState(false);

    if (activeCategory !== 'small_business' || businessInput.annualTurnover > 100_000_000) {
        return null;
    }

    const generateCertificate = async () => {
        setGenerating(true);

        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const W = doc.internal.pageSize.getWidth();   // 210
        const H = doc.internal.pageSize.getHeight();  // 297

        const businessName = businessInput.businessName || 'Unnamed Business';
        const turnover = formatNaira(businessInput.annualTurnover);
        const today = new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
        const year = new Date().getFullYear();
        const serialNo = `TF-${year}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // ═══════════════════════════════════════
        // 1. Background
        // ═══════════════════════════════════════
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, W, H, 'F');

        // ═══════════════════════════════════════
        // 2. Outer decorative border (double-line)
        // ═══════════════════════════════════════
        // Outer border
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(1.5);
        doc.rect(8, 8, W - 16, H - 16);
        // Inner border
        doc.setLineWidth(0.4);
        doc.setDrawColor(52, 211, 153);
        doc.rect(11, 11, W - 22, H - 22);

        // ═══════════════════════════════════════
        // 3. Header band
        // ═══════════════════════════════════════
        doc.setFillColor(16, 185, 129);
        doc.rect(11, 11, W - 22, 48, 'F');

        // Republic of Nigeria coat-of-arms placeholder (styled rectangle with ₦)
        doc.setFillColor(255, 255, 255, 0.15);
        doc.circle(W / 2, 35, 14, 'S');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('₦', W / 2, 38.5, { align: 'center' });

        // Subtitle under emblem
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(209, 250, 229);
        doc.text('FEDERAL REPUBLIC OF NIGERIA', W / 2, 52, { align: 'center' });

        // ═══════════════════════════════════════
        // 4. Certificate title block
        // ═══════════════════════════════════════
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(17);
        doc.setTextColor(15, 118, 110);
        doc.text('CERTIFICATE OF TAX EXEMPTION', W / 2, 76, { align: 'center' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('ISSUED UNDER THE NIGERIA TAX ACT 2026 — SMALL COMPANY EXEMPTION', W / 2, 84, { align: 'center' });

        // Thin separator line
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.5);
        doc.line(30, 89, W - 30, 89);

        // ═══════════════════════════════════════
        // 5. "This certifies that" intro
        // ═══════════════════════════════════════
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(82, 82, 91);
        doc.text('This is to certify that:', W / 2, 98, { align: 'center' });

        // Business name — large, prominent
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(24, 24, 27);
        doc.text(businessName.toUpperCase(), W / 2, 112, { align: 'center' });

        // Underline the business name
        const nameWidth = doc.getTextWidth(businessName.toUpperCase());
        const nameX = (W - nameWidth) / 2;
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.4);
        doc.line(nameX, 114, nameX + nameWidth, 114);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.setTextColor(82, 82, 91);
        doc.text('has been assessed and found eligible for ZERO PERCENT (0%) Company Income Tax', W / 2, 123, { align: 'center' });
        doc.text(`for the tax year ending ${year}, under the provisions cited below.`, W / 2, 130, { align: 'center' });

        // ═══════════════════════════════════════
        // 6. Details table
        // ═══════════════════════════════════════
        const tableTop = 141;
        const col1 = 22;
        const col2 = 90;
        const rowH = 9;

        const rows = [
            ['Business Name', businessName],
            ['Annual Turnover', turnover],
            ['Company Classification', 'Small Company'],
            ['Applicable CIT Rate', '0% (Zero Percent)'],
            ['Tax Year', `${year}`],
            ['Date of Issuance', today],
            ['Certificate Serial No.', serialNo],
        ];

        rows.forEach(([label, value], i) => {
            const rowY = tableTop + i * rowH;
            // Alternating row background
            if (i % 2 === 0) {
                doc.setFillColor(240, 253, 244);
                doc.rect(col1 - 2, rowY - 5.5, W - (col1 - 2) * 2, rowH, 'F');
            }
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(82, 82, 91);
            doc.text(label, col1, rowY);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(24, 24, 27);
            doc.text(value, col2, rowY);
        });

        // Table outer border
        doc.setDrawColor(187, 247, 208);
        doc.setLineWidth(0.3);
        doc.rect(col1 - 2, tableTop - 5.5, W - (col1 - 2) * 2, rows.length * rowH, 'S');

        // ═══════════════════════════════════════
        // 7. Legal declaration box
        // ═══════════════════════════════════════
        const declY = tableTop + rows.length * rowH + 12;
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(134, 239, 172);
        doc.setLineWidth(0.35);
        doc.roundedRect(20, declY, W - 40, 36, 2.5, 2.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 118, 110);
        doc.text('LEGAL BASIS & DECLARATION', W / 2, declY + 8, { align: 'center' });

        const declaration =
            `Pursuant to Section 23(1)(n) of the Nigeria Tax Act 2026, companies with an annual gross turnover ` +
            `not exceeding ₦100,000,000 (One Hundred Million Naira) are exempt from payment of Company Income Tax. ` +
            `This certificate is issued as prima facie evidence of such exemption for the stated tax year.`;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(82, 82, 91);
        const dLines = doc.splitTextToSize(declaration, W - 54);
        doc.text(dLines, W / 2, declY + 16, { align: 'center' });

        // ═══════════════════════════════════════
        // 8. Signature area
        // ═══════════════════════════════════════
        const sigY = declY + 48;
        // Left signature block – Tax Authority
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.4);
        doc.line(25, sigY + 14, 80, sigY + 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(24, 24, 27);
        doc.text('Authorised Officer', 52, sigY + 19, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('Federal Inland Revenue Service', 52, sigY + 25, { align: 'center' });

        // Center stamp-like circle
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.6);
        doc.circle(W / 2, sigY + 14, 14, 'S');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(16, 185, 129);
        doc.text('TAXFLOW', W / 2, sigY + 12, { align: 'center' });
        doc.text('VERIFIED', W / 2, sigY + 17, { align: 'center' });

        // Right signature block – TaxFlow System
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.4);
        doc.line(W - 80, sigY + 14, W - 25, sigY + 14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(24, 24, 27);
        doc.text('Taxpayer / Representative', W - 52, sigY + 19, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text(businessName, W - 52, sigY + 25, { align: 'center' });

        // ═══════════════════════════════════════
        // 9. Footer
        // ═══════════════════════════════════════
        const footerY = H - 22;
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.4);
        doc.line(20, footerY - 4, W - 20, footerY - 4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(161, 161, 170);
        doc.text(
            'This document is computer-generated by TaxFlow and is for reference purposes only. It does not replace official compliance filings.',
            W / 2, footerY + 2, { align: 'center' }
        );
        doc.text(`Serial: ${serialNo}  |  Generated: ${today}  |  Powered by TaxFlow`, W / 2, footerY + 8, { align: 'center' });

        doc.save(`TaxFlow-Zero-Tax-Certificate-${year}.pdf`);
        setGenerating(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 p-6 backdrop-blur-md"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            Zero-Tax Certificate
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Your business qualifies for 0% CIT
                        </p>
                    </div>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                    Under the Nigeria Tax Act 2026, small companies with annual turnover not exceeding ₦100,000,000 are exempt from Company Income Tax. Generate your professionally formatted certificate below.
                </p>

                <button
                    onClick={generateCertificate}
                    disabled={generating || !businessInput.businessName}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                    {generating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    {generating ? 'Generating PDF...' : 'Download Certificate (PDF)'}
                </button>

                {!businessInput.businessName && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 text-center">
                        ⚠ Please enter your business name above to generate the certificate
                    </p>
                )}
            </div>
        </motion.div>
    );
}
