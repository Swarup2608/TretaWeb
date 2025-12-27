'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <Header />
            <main className="">
                {children}
            </main>
        </ThemeProvider>
    );
}
