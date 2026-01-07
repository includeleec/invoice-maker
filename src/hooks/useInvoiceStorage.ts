import { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';

const STORAGE_KEY = 'invoice-app-data';

export function useInvoiceStorage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                setInvoices(JSON.parse(data));
            } catch (e) {
                console.error('Failed to parse invoice data', e);
            }
        }
        setLoading(false);
    }, []);

    const saveInvoice = (invoice: Invoice) => {
        const newInvoices = [...invoices];
        const index = newInvoices.findIndex((i) => i.id === invoice.id);

        if (index >= 0) {
            newInvoices[index] = invoice;
        } else {
            newInvoices.push(invoice);
        }

        setInvoices(newInvoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices));
    };

    const deleteInvoice = (id: string) => {
        const newInvoices = invoices.filter((i) => i.id !== id);
        setInvoices(newInvoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices));
    };

    const getInvoice = (id: string) => {
        return invoices.find((i) => i.id === id);
    };

    return {
        invoices,
        loading,
        saveInvoice,
        deleteInvoice,
        getInvoice
    };
}
