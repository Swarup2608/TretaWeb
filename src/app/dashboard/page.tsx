'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import UserManagement from '@/components/UserManagement';
import DashboardHeader from '@/components/DashboardHeader';
import { getTotalVisits, getUniqueVisitors, getTopPages, getBounceRate, getAvgSessionDuration, trackPageVisit } from '@/utils/analytics';

interface Section {
    name: string;
    file: string;
    description: string;
}

const sections: Section[] = [
    { name: 'Hero', file: 'hero.json', description: 'Main hero section content' },
    { name: 'About', file: 'about.json', description: 'About section information' },
    { name: 'Services', file: 'services.json', description: 'Services offered' },
    { name: 'Numbers', file: 'numbersHome.json', description: 'Statistics and numbers' },
    { name: 'Values', file: 'values.json', description: 'Company values' },
    { name: 'Case Studies', file: 'caseStudies.json', description: 'Case studies showcase' },
    { name: 'FAQ', file: 'faq.json', description: 'Frequently asked questions' },
    { name: 'Footer', file: 'footer.json', description: 'Footer content' },
    { name: 'Header', file: 'header.json', description: 'Navigation and header' },
    { name: 'CTA', file: 'cta.json', description: 'Call to action content' },
    { name: 'Meta', file: 'meta.json', description: 'Global site settings, colors, SEO, fonts' },
    { name: 'Users', file: 'users.json', description: 'Manage admin users and permissions' },
];

export default function DashboardPage() {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [analytics, setAnalytics] = useState({
        totalVisits: 0,
        uniqueVisitors: 0,
        topPages: [] as { page: string; visits: number }[],
        bounceRate: '0%',
        avgSessionDuration: '0s'
    });

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            trackPageVisit('/dashboard');
            // Load real analytics data
            setAnalytics({
                totalVisits: getTotalVisits(),
                uniqueVisitors: getUniqueVisitors(),
                topPages: getTopPages(),
                bounceRate: getBounceRate(),
                avgSessionDuration: getAvgSessionDuration()
            });
        }
    }, [token, router]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900'}`}>
            <DashboardHeader title="Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`group p-6 rounded-2xl shadow-lg card-hover animate-fade-in ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} border-2 border-transparent hover:border-indigo-500/50 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium mb-2 opacity-70">Total Visits</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{analytics.totalVisits.toLocaleString()}</p>
                                <p className="text-xs mt-2 text-green-500 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +12.5%
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`group p-6 rounded-2xl shadow-lg card-hover animate-fade-in animate-delay-100 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} border-2 border-transparent hover:border-emerald-500/50 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium mb-2 opacity-70">Unique Visitors</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{analytics.uniqueVisitors.toLocaleString()}</p>
                                <p className="text-xs mt-2 text-green-500 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +8.2%
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`group p-6 rounded-2xl shadow-lg card-hover animate-fade-in animate-delay-200 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} border-2 border-transparent hover:border-orange-500/50 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium mb-2 opacity-70">Bounce Rate</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{analytics.bounceRate}</p>
                                <p className="text-xs mt-2 text-green-500 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    -5.3% Better
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`group p-6 rounded-2xl shadow-lg card-hover animate-fade-in animate-delay-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} border-2 border-transparent hover:border-blue-500/50 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium mb-2 opacity-70">Avg Session</h3>
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{analytics.avgSessionDuration}</p>
                                <p className="text-xs mt-2 text-green-500 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    +15.7%
                                </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Pages */}
                <div className={`p-6 rounded-xl shadow-lg mb-8 card-hover animate-fade-in animate-delay-400 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <span style={{ color: 'var(--primary)' }}>Top 5 Pages</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Page</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Visits</th>
                                    <th className="text-left py-4 px-4 font-semibold text-sm uppercase tracking-wider opacity-70">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topPages.map((page: any, index: number) => (
                                    <tr key={index} className={`border-b ${theme === 'dark' ? 'border-gray-700/50 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors duration-200`}>
                                        <td className="py-4 px-4 font-medium">{page.page}</td>
                                        <td className="py-4 px-4 text-lg font-semibold" style={{ color: 'var(--primary)' }}>{page.visits.toLocaleString()}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                                +12%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Content Sections */}
                <div className={`p-6 rounded-xl shadow-lg mb-8 card-hover animate-fade-in animate-delay-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span style={{ color: 'var(--primary)' }}>Content Sections</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sections.map((section, idx) => (
                            <Link
                                key={section.name}
                                href={`/dashboard/${section.name.toLowerCase().replace(' ', '-')}`}
                                className={`group p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in ${theme === 'dark'
                                    ? 'border-gray-700 bg-gray-900 hover:border-[var(--primary)] hover:bg-gray-800'
                                    : 'border-gray-200 bg-gray-50 hover:border-[var(--primary)] hover:bg-white'
                                    }`}
                                style={{ animationDelay: `${0.6 + idx * 0.05}s` }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-lg transition-colors" style={{ color: theme === 'dark' ? 'inherit' : 'inherit' }}>{section.name}</h4>
                                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-colors`}>
                                    {section.description}
                                </p>
                                <div className="flex items-center text-xs font-semibold transition-colors" style={{ color: 'var(--primary)' }}>
                                    <span>Edit Content</span>
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* User Management Section */}
                <div className="mb-8">
                    <UserManagement />
                </div>

                {/* Navigation Links */}
                <div className="mt-8 flex gap-4 animate-fade-in animate-delay-600">
                    <Link href="/" className="group text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-semibold flex items-center gap-3" style={{ backgroundColor: 'var(--primary)' }}>
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
                        </svg>
                        <span>View Home Page</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0"
                        onClick={() => setShowLogoutModal(false)}
                    />
                    <div className={`relative z-10 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold">Confirm Logout</h3>
                        </div>
                        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Are you sure you want to logout?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className={`px-4 py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}