'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isDashboardOrAdmin = pathname.startsWith('/dashboard') || pathname === '/login';

    return (
        <>
            {!isDashboardOrAdmin && <Header />}
            <main className="">
                {children}
            </main>
            <Footer />
        </>
    );
}
