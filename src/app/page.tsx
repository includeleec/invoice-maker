"use client";

import React, { useState } from 'react';
import { InvoiceForm } from '@/components/InvoiceForm';
import { useInvoiceStorage } from '@/hooks/useInvoiceStorage';
import { Invoice } from '@/types/invoice';
import { InvoicePreview } from '@/components/InvoicePreview';
import { Plus, Clock, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export default function Home() {
  const { invoices, saveInvoice, deleteInvoice, loading } = useInvoiceStorage();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const handleSave = (invoice: Invoice) => {
    saveInvoice(invoice);
    setCurrentInvoice(invoice);
    setIsEditing(true);
    showToast('Invoice saved successfully!');
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setIsEditing(true);
    setCurrentInvoice(null);
  };

  const handleSaveAsNew = (invoice: Invoice) => {
    const newInvoice = {
      ...invoice,
      id: crypto.randomUUID(),
      number: `${invoice.number} (Copy)`
    };
    saveInvoice(newInvoice);
    setCurrentInvoice(newInvoice);
    setIsEditing(true);
  };

  const handlePreview = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsPreviewMode(true);
  };

  const startNewInvoice = () => {
    setCurrentInvoice(null);
    setIsEditing(true);
    setIsPreviewMode(false);
  };

  const editInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsEditing(true);
    setIsPreviewMode(false);
  };

  if (isPreviewMode && currentInvoice) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
          <InvoicePreview invoice={currentInvoice} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-85 bg-white border-r border-slate-200/60 flex flex-col hidden md:flex shadow-2xl shadow-slate-200/40 z-10">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="tracking-tight">Invoice Maker</span>
          </h1>
        </div>

        <div className="px-6 py-6">
          <button
            onClick={startNewInvoice}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-2xl py-4 font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/25 active:scale-[0.98] group"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            New Invoice
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 pb-6 custom-scrollbar">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6 px-2">
            <Clock className="w-3.5 h-3.5" />
            Recent Activity
          </div>

          <div className="space-y-1">
            {loading ? (
              <div className="space-y-2 px-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No invoices yet</p>
            ) : (
              invoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => editInvoice(inv)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group relative mb-2 ${currentInvoice?.id === inv.id
                    ? 'sidebar-item-active'
                    : 'hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-slate-800 truncate pr-4">
                      {inv.number || 'Untitled'}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-black">
                      {inv.currency}{inv.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium truncate">{inv.clientName || 'Draft'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${currentInvoice?.id === inv.id ? 'text-primary' : 'text-slate-300'
                      }`} />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          {isEditing || !invoices.length ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentInvoice ? 'Edit Invoice' : 'Create Invoice'}
                </h2>
              </div>
              <InvoiceForm
                key={currentInvoice?.id || 'new'}
                initialData={currentInvoice || {}}
                onSave={handleSave}
                onPreview={handlePreview}
                onDelete={currentInvoice ? () => handleDelete(currentInvoice.id) : undefined}
                onSaveAsNew={currentInvoice ? handleSaveAsNew : undefined}
              />
            </div>
          ) : (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-slate-200 border border-slate-100">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Focus on your business</h2>
              <p className="text-slate-500 max-w-sm mb-10 text-lg font-medium leading-relaxed">
                Create professional invoices in seconds and get paid faster.
              </p>
              <button
                onClick={startNewInvoice}
                className="inline-flex items-center gap-3 bg-primary text-white rounded-2xl px-10 py-4 font-bold hover:bg-primary-hover transition-all shadow-2xl shadow-primary/30 active:scale-[0.98]"
              >
                <Plus className="w-6 h-6" />
                Create New Invoice
              </button>
            </div>
          )}
        </div>
      </main>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};
