'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { MetaProvider } from '@/context/MetaContext';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MetaProvider>
                    {children}
                </MetaProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}