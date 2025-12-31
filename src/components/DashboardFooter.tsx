'use client';

import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

export default function DashboardFooter() {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`mt-auto border-t transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>© {currentYear} Treta. All rights reserved.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Visit Site
                        </Link>
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
