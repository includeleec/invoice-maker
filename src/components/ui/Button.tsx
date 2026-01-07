import React from 'react';
import { cn } from '@/lib/utils';
// import { Slot } from "@radix-ui/react-slot";
// Actually, I'll stick to simple props without Slot for now to avoid extra deps if not needed.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
            secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
            outline: "border-2 border-slate-200 bg-transparent hover:border-primary hover:text-primary transition-all duration-300",
            ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors",
            destructive: "bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs rounded-lg",
            md: "h-11 px-6 py-2 rounded-xl",
            lg: "h-14 px-10 text-lg rounded-2xl",
            icon: "h-10 w-10 p-2 rounded-xl",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
