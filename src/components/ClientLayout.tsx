'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <Header />
            <main className="">
                {children}
            </main>
            <Footer />
        </ThemeProvider>
    );
}
