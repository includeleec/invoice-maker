import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white border border-green-100 shadow-2xl rounded-xl px-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300",
            isVisible ? "opacity-100" : "opacity-0"
        )}>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-900">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
