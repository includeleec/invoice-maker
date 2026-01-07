import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, Upload, Save, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // I need to install uuid or just use crypto.randomUUID

export const InvoiceForm = ({
    initialData,
    onSave,
    onPreview,
    onDelete,
    onSaveAsNew
}: {
    initialData?: Partial<Invoice>,
    onSave: (invoice: Invoice) => void,
    onPreview: (invoice: Invoice) => void,
    onDelete?: () => void,
    onSaveAsNew?: (invoice: Invoice) => void
}) => {
    const [invoice, setInvoice] = useState<Invoice>({
        id: initialData?.id || crypto.randomUUID(),
        number: initialData?.number || 'INV-001',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        dueDate: initialData?.dueDate || '',
        companyName: initialData?.companyName || '',
        companyLogo: initialData?.companyLogo || '',
        companyAddress: initialData?.companyAddress || '',
        companyWebsite: initialData?.companyWebsite || '',
        companyContact: initialData?.companyContact || { name: '', phone: '', email: '' },
        clientName: initialData?.clientName || '',
        clientAddress: initialData?.clientAddress || '',
        clientContact: initialData?.clientContact || { name: '', phone: '', email: '' },
        items: initialData?.items || [{ id: crypto.randomUUID(), description: '', quantity: 1, price: 0 }],
        paymentMethods: initialData?.paymentMethods || [],
        currency: initialData?.currency || '$',
        currencyPosition: initialData?.currencyPosition || 'before',
        status: initialData?.status || 'draft',
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoice(prev => ({ ...prev, companyLogo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...invoice.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setInvoice(prev => ({
            ...prev,
            items: [...prev.items, { id: crypto.randomUUID(), description: '', quantity: 1, price: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        setInvoice(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const addPaymentMethod = () => {
        setInvoice(prev => ({
            ...prev,
            paymentMethods: [
                ...(prev.paymentMethods || []),
                { id: crypto.randomUUID(), label: '', details: '' }
            ]
        }));
    };

    const updatePaymentMethod = (index: number, field: 'label' | 'details', value: string) => {
        const newMethods = [...(invoice.paymentMethods || [])];
        newMethods[index] = { ...newMethods[index], [field]: value };
        setInvoice(prev => ({ ...prev, paymentMethods: newMethods }));
    };

    const removePaymentMethod = (index: number) => {
        setInvoice(prev => ({
            ...prev,
            paymentMethods: (prev.paymentMethods || []).filter((_, i) => i !== index)
        }));
    };

    // Calculate Total
    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 rounded-3xl">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                        {invoice.number || 'Draft'}
                    </h2>
                    <p className="text-slate-500 font-medium">Last updated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => onPreview(invoice)} className="rounded-2xl">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    {onSaveAsNew && (
                        <Button variant="outline" onClick={() => onSaveAsNew(invoice)} className="border-primary/20 text-primary hover:bg-primary/5 rounded-2xl">
                            <Plus className="w-4 h-4 mr-2" />
                            Clone
                        </Button>
                    )}
                    <Button onClick={() => onSave(invoice)} className="rounded-2xl">
                        <Save className="w-4 h-4 mr-2" />
                        Save Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Details */}
                <div className="md:col-span-2 glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-2 h-6 bg-primary rounded-full" />
                            Sender Details
                        </h3>
                        <div className="flex items-center gap-4">
                            {invoice.companyLogo && (
                                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                    <img src={invoice.companyLogo} alt="Logo" className="w-12 h-12 object-contain" />
                                </div>
                            )}
                            <label className="cursor-pointer group">
                                <div className="flex items-center gap-2 text-sm text-primary font-bold bg-primary/5 px-4 py-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    {invoice.companyLogo ? 'Update Logo' : 'Upload Logo'}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Company Name"
                            value={invoice.companyName}
                            onChange={e => setInvoice({ ...invoice, companyName: e.target.value })}
                            placeholder="Arkham Intelligence"
                        />
                        <Input
                            label="Website"
                            value={invoice.companyWebsite}
                            onChange={e => setInvoice({ ...invoice, companyWebsite: e.target.value })}
                            placeholder="www.arkham.io"
                        />
                    </div>
                    <Input
                        label="Address"
                        value={invoice.companyAddress}
                        onChange={e => setInvoice({ ...invoice, companyAddress: e.target.value })}
                        placeholder="123 Financial District, Gotham City"
                    />

                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Name"
                                value={invoice.companyContact?.name}
                                onChange={e => setInvoice({ ...invoice, companyContact: { ...invoice.companyContact, name: e.target.value } })}
                            />
                            <Input
                                placeholder="Phone"
                                value={invoice.companyContact?.phone}
                                onChange={e => setInvoice({ ...invoice, companyContact: { ...invoice.companyContact, phone: e.target.value } })}
                            />
                            <Input
                                placeholder="Email"
                                value={invoice.companyContact?.email}
                                onChange={e => setInvoice({ ...invoice, companyContact: { ...invoice.companyContact, email: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                {/* Invoice Meta */}
                <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                            <div className="w-2 h-6 bg-slate-200 rounded-full" />
                            Invoice Meta
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Currency</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={invoice.currency}
                                            onChange={e => setInvoice({ ...invoice, currency: e.target.value })}
                                            placeholder="$"
                                            className="min-w-0"
                                        />
                                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                                            <button
                                                onClick={() => setInvoice({ ...invoice, currencyPosition: 'before' })}
                                                className={`px-3 text-xs font-bold rounded-lg transition-all ${invoice.currencyPosition === 'before' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                Before
                                            </button>
                                            <button
                                                onClick={() => setInvoice({ ...invoice, currencyPosition: 'after' })}
                                                className={`px-3 text-xs font-bold rounded-lg transition-all ${invoice.currencyPosition === 'after' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                After
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Input
                                    label="Invoice #"
                                    value={invoice.number}
                                    onChange={e => setInvoice({ ...invoice, number: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Issue Date"
                                    type="date"
                                    value={invoice.date}
                                    onChange={e => setInvoice({ ...invoice, date: e.target.value })}
                                />
                                <Input
                                    label="Due Date"
                                    type="date"
                                    value={invoice.dueDate}
                                    onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 p-6 bg-slate-950 rounded-2xl text-white">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Grand Total</p>
                        <p className="text-4xl font-black tabular-nums">
                            <span className="text-slate-500 text-2xl mr-1">
                                {invoice.currencyPosition === 'before' ? invoice.currency : ''}
                            </span>
                            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            <span className="text-slate-500 text-2xl ml-1">
                                {invoice.currencyPosition === 'after' ? invoice.currency : ''}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Client Details */}
            <div className="glass-card p-8 rounded-3xl space-y-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary/40 rounded-full" />
                    Recipient Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Input
                            label="Client Name"
                            value={invoice.clientName}
                            onChange={e => setInvoice({ ...invoice, clientName: e.target.value })}
                            placeholder="Wayne Enterprises"
                        />
                        <Input
                            label="Client Address"
                            value={invoice.clientAddress}
                            onChange={e => setInvoice({ ...invoice, clientAddress: e.target.value })}
                            placeholder="1 Mountain Drive, Gotham City"
                        />
                    </div>
                    <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recipient Contact</p>
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                placeholder="Contact Name"
                                value={invoice.clientContact?.name}
                                onChange={e => setInvoice({ ...invoice, clientContact: { ...invoice.clientContact, name: e.target.value } })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Phone"
                                    value={invoice.clientContact?.phone}
                                    onChange={e => setInvoice({ ...invoice, clientContact: { ...invoice.clientContact, phone: e.target.value } })}
                                />
                                <Input
                                    placeholder="Email"
                                    value={invoice.clientContact?.email}
                                    onChange={e => setInvoice({ ...invoice, clientContact: { ...invoice.clientContact, email: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Items */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-6 bg-success rounded-full" />
                        Invoice Items
                    </h3>
                    <Button variant="outline" size="sm" onClick={addItem} className="rounded-xl border-dashed">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Item
                    </Button>
                </div>
                <div className="space-y-4">
                    {invoice.items.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
                            <div className="flex-grow">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Description</label>
                                <Input
                                    value={item.description}
                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                    placeholder="Consultancy Services"
                                    className="bg-transparent border-transparent hover:border-slate-100 focus:bg-white"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Qty</label>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                    className="bg-transparent border-transparent hover:border-slate-100 focus:bg-white text-center"
                                />
                            </div>
                            <div className="w-40">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Unit Price</label>
                                <div className={`flex items-center bg-white rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 px-3 h-12 ${invoice.currencyPosition === 'after' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-slate-400 font-bold whitespace-nowrap select-none">
                                        {invoice.currency}
                                    </span>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={e => updateItem(index, 'price', Number(e.target.value))}
                                        className={`w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium ${invoice.currencyPosition === 'after' ? 'text-right pr-2' : 'pl-2'}`}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-300 hover:text-danger hover:bg-danger/5 transition-colors mb-1"
                                onClick={() => removeItem(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Payment Methods */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-6 bg-warning rounded-full" />
                    Payment Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {invoice.paymentMethods?.map((method, index) => (
                        <div key={method.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-lg">
                            <div className="space-y-4">
                                <Input
                                    label="Method Name"
                                    value={method.label}
                                    onChange={e => updatePaymentMethod(index, 'label', e.target.value)}
                                    placeholder="Wire Transfer"
                                />
                                <Input
                                    label="Account Details"
                                    value={method.details}
                                    onChange={e => updatePaymentMethod(index, 'details', e.target.value)}
                                    placeholder="IBAN: GB..."
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-300 hover:text-danger hover:bg-danger/5 absolute top-4 right-4 transition-colors"
                                onClick={() => removePaymentMethod(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <button
                        onClick={addPaymentMethod}
                        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all group text-slate-400 hover:text-primary"
                    >
                        <Plus className="w-8 h-8 mb-2 transition-transform group-hover:scale-110" />
                        <span className="font-bold text-sm">Add Payment Method</span>
                    </button>
                </div>
            </div>

            {/* Footer / Totals */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                            {invoice.currencyPosition === 'before' && invoice.currency}
                            {total.toFixed(2)}
                            {invoice.currencyPosition === 'after' && ` ${invoice.currency}`}
                        </span>
                    </div>
                </div>
            </div>

            {onDelete && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="ghost"
                        className="text-slate-400 hover:text-danger hover:bg-danger/5 rounded-2xl font-bold py-6 px-12 transition-all"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this invoice?')) {
                                onDelete();
                            }
                        }}
                    >
                        <Trash2 className="w-5 h-5 mr-3" />
                        Delete Permanently
                    </Button>
                </div>
            )}
        </div>
    );
};
