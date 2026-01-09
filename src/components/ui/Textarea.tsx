import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, value, ...props }, ref) => {
        const textareaRef = React.useRef<HTMLTextAreaElement>(null);
        const combinedRef = (node: HTMLTextAreaElement) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        };

        React.useEffect(() => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to calculate scrollHeight
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        }, [value]);

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex min-h-[50px] w-full rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-slate-200 resize-none overflow-hidden",
                        className
                    )}
                    ref={combinedRef}
                    value={value}
                    {...props}
                />
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
