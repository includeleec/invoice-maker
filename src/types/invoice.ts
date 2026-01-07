export interface ContactInfo {
    name?: string;
    phone?: string;
    email?: string;
}

export interface PaymentMethod {
    id: string;
    label: string;
    details: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Invoice {
    id: string;
    number: string;
    date: string; // ISO string YYYY-MM-DD
    dueDate: string;

    // Sender Details
    companyName: string;
    companyLogo?: string; // Data URL
    companyAddress?: string;
    companyWebsite?: string;
    companyContact?: ContactInfo;

    // Client Details
    clientName: string;
    clientAddress?: string;
    clientContact?: ContactInfo;

    // Items
    items: InvoiceItem[];

    // Payment Methods
    paymentMethods?: PaymentMethod[];

    // Meta
    currency: string;
    currencyPosition: 'before' | 'after';
    status: 'draft' | 'paid' | 'pending';
}

export interface InvoiceSettings {
    defaultCompanyName: string;
    defaultCompanyAddress: string;
    defaultCompanyLogo?: string;
    defaultCurrency: string;
}
