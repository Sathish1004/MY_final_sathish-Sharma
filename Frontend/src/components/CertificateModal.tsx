import React, { useRef } from 'react';
import { X, Download, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    courseTitle: string;
    instructor: string;
    date: string;
    certId: string;
}

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateModal: React.FC<CertificateModalProps> = ({
    isOpen,
    onClose,
    studentName,
    courseTitle,
    instructor,
    date,
    certId
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            // Capture the certificate
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher resolution
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 1024 // Ensure landscape width capture
            });

            // Calculate PDF dimensions
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // A4 dimensions in mm: 297 x 210
            const pdfWidth = 297;
            const pdfHeight = 210;

            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Save
            pdf.save(`Certificate - ${studentName} - ${courseTitle}.pdf`);

        } catch (err) {
            console.error("Failed to generate PDF", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            {/* No print CSS needed for canvas download */}

            <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Header Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Button onClick={handleDownload} variant="outline" className="gap-2 bg-white/90 hover:bg-white text-slate-800 border-slate-200">
                        <Download className="h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={onClose} variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-full">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Certificate Content */}
                <div ref={certificateRef} className="relative w-full aspect-[1.414/1] bg-white text-slate-900 flex flex-col items-center justify-center p-12 md:p-16 border-[16px] border-double border-slate-100 print:border-none print:w-screen print:h-screen print:absolute print:inset-0 print:m-0">

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-br-full -z-0" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-tl-full -z-0" />
                    <div className="absolute inset-8 border border-slate-200/50 pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto w-full">

                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3 text-xl font-bold text-slate-800 tracking-wider uppercase mb-12">
                                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <Award className="h-6 w-6" />
                                </div>
                                <span>Prolync Learning Platform</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-wide">Certificate of Completion</h1>
                            <p className="text-lg text-slate-500 font-light uppercase tracking-widest pt-2">This is to certify that</p>
                        </div>

                        {/* Student Name */}
                        <div className="py-2">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-emerald-700 italic border-b-2 border-emerald-100 pb-4 inline-block min-w-[300px] px-8">
                                {studentName}
                            </h2>
                        </div>

                        {/* Course Details */}
                        <div className="space-y-2">
                            <p className="text-lg text-slate-600">has successfully completed the course</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 max-w-2xl mx-auto leading-tight py-2">
                                {courseTitle}
                            </h3>
                            <p className="text-slate-500 italic">with dedication and hard work</p>
                        </div>

                        {/* Footer / Signatures */}
                        <div className="flex flex-col md:flex-row items-end justify-between w-full pt-16 mt-8">
                            <div className="text-center space-y-2">
                                <div className="text-lg font-serif italic text-slate-800 border-b border-slate-300 pb-1 px-8 min-w-[200px] font-signature">
                                    {instructor}
                                </div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Instructor</p>
                            </div>

                            <div className="text-center mb-2 md:mb-0">
                                <div className="h-24 w-24 mx-auto rounded-full border-4 border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-emerald-600 shadow-inner">
                                    <CheckCircle2 className="h-8 w-8 mb-1" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="text-lg font-serif text-slate-800 border-b border-slate-300 pb-1 px-8 min-w-[200px]">
                                    {date}
                                </div>
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Date Issued</p>
                            </div>
                        </div>

                        {/* Verification Code */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <p className="text-[10px] text-slate-300 font-mono tracking-widest uppercase">
                                Certificate ID: {certId} • Valid & Verifiable
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;
