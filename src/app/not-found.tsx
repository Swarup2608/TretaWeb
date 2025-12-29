'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center max-w-2xl mx-auto py-16">
                    {/* 404 Animation */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse-slow">
                            404
                        </h1>
                    </div>

                    {/* Error Message */}
                    <div className="mb-8 animate-slide-up animation-delay-200">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Oops! The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
                            </svg>
                            Back to Home
                        </Link>
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.back();
                            }}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Go Back
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 animate-slide-up animation-delay-600">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Looking for something specific?
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/#services" className="text-sm px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Our Services
                            </Link>
                            <Link href="/#about" className="text-sm px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                About Us
                            </Link>
                            <Link href="/#contact" className="text-sm px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
