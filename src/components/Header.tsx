'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import * as LucideIcons from 'lucide-react';

interface DropdownItem {
    label: string;
    link: string;
}

interface NavItem {
    label: string;
    link: string;
    hasDropdown?: boolean;
    dropdownItems?: DropdownItem[];
}

interface HeaderData {
    logo: {
        text: string;
        link: string;
    };
    navigation: NavItem[];
    cta: {
        label: string;
        link: string;
        icon: string;
    };
}

export default function Header() {
    const [headerData, setHeaderData] = useState<HeaderData | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        fetch('/SiteContent/header.json')
            .then((res) => res.json())
            .then((data) => setHeaderData(data))
            .catch((error) => console.error('Error loading header data:', error));
    }, []);

    if (!headerData) {
        return null;
    }

    return (
        <>
            <header className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
                <div
                    className="header-bg rounded-3xl px-6 lg:px-8 relative border border-white/60 dark:border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300"
                    style={{
                        backdropFilter: 'blur(40px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(200%)'
                    }}
                >
                    <div className="flex items-center justify-between h-20 relative z-10">
                        {/* Logo */}
                        <Link
                            href={headerData.logo.link}
                            className="header-logo text-2xl font-bold transition-colors"
                        >
                            {headerData.logo.text}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {headerData.navigation.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                                    onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.link}
                                        className="header-text flex items-center gap-1 hover:opacity-80 transition-colors font-medium py-2"
                                    >
                                        {item.label}
                                        {item.hasDropdown && (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {item.hasDropdown && activeDropdown === item.label && (
                                        <div
                                            className="absolute top-full left-0 pt-2 w-48 z-100"
                                            onMouseEnter={() => setActiveDropdown(item.label)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <div className="dropdown-bg rounded-2xl py-3 border shadow-2xl transition-all duration-300">
                                                {item.dropdownItems?.map((dropdownItem) => (
                                                    <Link
                                                        key={dropdownItem.label}
                                                        href={dropdownItem.link}
                                                        className="dropdown-text block px-4 py-2.5 font-medium rounded-lg mx-2"
                                                    >
                                                        {dropdownItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="header-text p-2 hover:opacity-80 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <Link
                                href={headerData.cta.link}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition-all duration-300 font-medium"
                            >
                                {headerData.cta.label}
                                {(() => {
                                    const IconComponent = (LucideIcons as any)[headerData.cta.icon];
                                    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                                })()}
                            </Link>
                        </div>

                        {/* Mobile Theme Toggle and Menu Button */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="header-text p-2 hover:opacity-80 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                className="header-text p-2 hover:opacity-80 transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </header >

            {/* Backdrop Overlay */}
            {
                isMobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileDropdownOpen(null);
                        }}
                    />
                )
            }

            {/* Mobile Menu at Bottom */}
            <div
                className={`lg:hidden fixed inset-x-0 bottom-0 z-70 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                <div className={`backdrop-blur-xl rounded-t-3xl mx-2 sm:mx-4 max-h-[85vh] overflow-hidden flex flex-col border-t shadow-[0_-8px_32px_0_rgba(0,0,0,0.12)] ${theme === 'dark'
                    ? 'bg-gray-900/95 border-gray-800 shadow-[0_-8px_32px_0_rgba(0,0,0,0.5)]'
                    : 'bg-white/95 border-gray-200'
                    }`}>
                    {/* Mobile Menu Header */}
                    <div className={`flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
                        }`}>
                        <Link
                            href={headerData.logo.link}
                            className="header-logo text-xl sm:text-2xl font-bold"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {headerData.logo.text}
                        </Link>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setMobileDropdownOpen(null);
                            }}
                            className="header-text hover:opacity-70 transition-opacity p-1"
                            aria-label="Close menu"
                        >
                            <svg
                                className="w-7 h-7 sm:w-8 sm:h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
                        <nav className="flex flex-col space-y-4 sm:space-y-5">
                            {headerData.navigation.map((item) => (
                                <div key={item.label}>
                                    {item.hasDropdown ? (
                                        <>
                                            <button
                                                className="flex items-center justify-between w-full header-text hover:opacity-70 transition-opacity font-medium text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() =>
                                                    setMobileDropdownOpen(
                                                        mobileDropdownOpen === item.label ? null : item.label
                                                    )
                                                }
                                            >
                                                {item.label}
                                                <svg
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${mobileDropdownOpen === item.label ? 'rotate-180' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                            {mobileDropdownOpen === item.label && (
                                                <div className="mt-2 ml-3 sm:ml-4 space-y-2 pl-3 border-l-2 border-gray-300 dark:border-gray-700">
                                                    {item.dropdownItems?.map((dropdownItem) => (
                                                        <Link
                                                            key={dropdownItem.label}
                                                            href={dropdownItem.link}
                                                            className="dropdown-text block py-2 px-3 rounded-lg text-sm sm:text-base"
                                                            onClick={() => {
                                                                setIsMobileMenuOpen(false);
                                                                setMobileDropdownOpen(null);
                                                            }}
                                                        >
                                                            {dropdownItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.link}
                                            className="flex items-center justify-between header-text hover:opacity-70 transition-opacity font-medium text-base sm:text-lg py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <Link
                                href={headerData.cta.link}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-full hover:bg-blue-700 transition-colors font-medium mt-6 sm:mt-8 text-base sm:text-lg shadow-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {headerData.cta.label}
                                {(() => {
                                    const IconComponent = (LucideIcons as any)[headerData.cta.icon];
                                    return IconComponent ? <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" /> : null;
                                })()}
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
