import React from 'react';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import { downloadPdf } from '@/lib/downloadPdf';

export const InvoicePreview = ({ invoice }: { invoice: Invoice }) => {

    const handleDownload = () => {
        downloadPdf('invoice-preview-content', `Invoice-${invoice.number}`);
    };

    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    return (
        <div className="flex flex-col items-center gap-10">
            <div className="w-full max-w-4xl flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white/20 shadow-lg">
                <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview Mode</p>
                        <p className="text-sm font-black text-slate-900">{invoice.number || 'Draft'}</p>
                    </div>
                </div>
                <Button onClick={handleDownload} className="shadow-xl shadow-primary/20 rounded-2xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </Button>
            </div>

            {/* Scale Wrapper for Preview */}
            <div className="w-full max-w-[210mm] bg-white shadow-[0_0_100px_-20px_rgba(0,0,0,0.1)] min-h-[297mm] relative rounded-[20px] overflow-hidden" id="invoice-preview-content">
                <div className="p-10 md:p-12 h-full flex flex-col justify-start gap-12 min-h-[297mm]">
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10 relative">
                            <div className="space-y-6">
                                {invoice.companyLogo && (
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                                        <img src={invoice.companyLogo} alt="Logo" className="h-12 w-auto object-contain" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{invoice.companyName || 'Arkham Intelligence'}</h2>
                                    <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase">{invoice.companyWebsite}</p>
                                    <p className="text-slate-400 text-xs max-w-xs">{invoice.companyAddress}</p>
                                </div>
                                {/* Sender Info Moved Here */}
                                <div className="space-y-1 pt-4">
                                    <p className="font-bold text-slate-900 text-base">{invoice.companyContact?.name}</p>
                                    <p className="text-slate-500 text-sm">{invoice.companyContact?.email}</p>
                                    <p className="text-slate-500 text-sm">{invoice.companyContact?.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-5xl font-black text-slate-100 leading-none mb-4 select-none">INVOICE</h1>
                                <div className="space-y-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                    <p>Invoice #: <span className="text-slate-900 ml-2">{invoice.number}</span></p>
                                    <p>Issue Date: <span className="text-slate-900 ml-2">{invoice.date}</span></p>
                                    <p>Due Date: <span className="text-slate-900 ml-2">{invoice.dueDate}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            {/* Bill To */}
                            <div className="space-y-2">
                                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Recipient</h3>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-900 text-xl">{invoice.clientName || 'Client Name'}</p>
                                    <p className="text-slate-500 text-sm whitespace-pre-wrap leading-relaxed">{invoice.clientAddress}</p>
                                </div>
                                <div className="pt-2 space-y-1">
                                    {invoice.clientContact?.email && (
                                        <p className="text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            {invoice.clientContact.email}
                                        </p>
                                    )}
                                    {invoice.clientContact?.phone && (
                                        <p className="text-xs text-slate-400 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            {invoice.clientContact.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-900">
                                        <th className="text-left py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Description</th>
                                        <th className="text-center py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-20">Qty</th>
                                        <th className="text-right py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Price</th>
                                        <th className="text-right py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.items.map((item) => (
                                        <tr key={item.id} className="group">
                                            <td className="py-3">
                                                <p className="font-bold text-slate-900 text-sm whitespace-pre-wrap">{item.description}</p>
                                            </td>
                                            <td className="py-3 text-center text-slate-500 font-bold text-sm h-fit align-top">{item.quantity}</td>
                                            <td className="py-3 text-right text-slate-500 font-bold text-sm h-fit align-top">
                                                {invoice.currencyPosition === 'before' && invoice.currency}
                                                {item.price.toLocaleString()}
                                                {invoice.currencyPosition === 'after' && ` ${invoice.currency}`}
                                            </td>
                                            <td className="py-3 text-right font-black text-slate-900 text-sm h-fit align-top">
                                                {invoice.currencyPosition === 'before' && invoice.currency}
                                                {(item.quantity * item.price).toLocaleString()}
                                                {invoice.currencyPosition === 'after' && ` ${invoice.currency}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Info & Totals */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-t-2 border-slate-900 pt-8">
                            <div className="flex-1 mr-8">
                                <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Payment Info</h4>
                                <div className="flex flex-col gap-4">
                                    {invoice.paymentMethods?.map((method) => (
                                        <div key={method.id} className="grid grid-cols-[100px_1fr] gap-4">
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest pt-0.5">{method.label}</p>
                                            <p className="text-xs font-bold text-slate-700 whitespace-pre-wrap">{method.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Amount Due</p>
                                <p className="text-5xl font-black tracking-tight tabular-nums text-slate-900">
                                    <span className={`text-slate-300 text-2xl ${invoice.currencyPosition === 'before' ? 'mr-2' : 'hidden'}`}>{invoice.currency}</span>
                                    {total.toLocaleString()}
                                    <span className={`text-slate-300 text-2xl ${invoice.currencyPosition === 'after' ? 'ml-2' : 'hidden'}`}>{invoice.currency}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-auto">
                        <p>Thank you for your business</p>
                        <p>© {new Date().getFullYear()} {invoice.companyName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
