'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LinkItem {
    label: string;
    link: string;
}

interface FooterData {
    companyInfo: {
        name: string;
        tagline: string;
    };
    links: {
        mainPages: {
            title: string;
            items: LinkItem[];
        };
        company: {
            title: string;
            items: LinkItem[];
        };
    };
    contact: {
        title: string;
        email: {
            label: string;
            value: string;
        };
        address: {
            label: string;
            value: string;
        };
        phone: {
            label: string;
            value: string;
        };
    };
    bottomLinks: LinkItem[];
    copyright: string;
    developer: {
        text: string;
        name: string;
        link: string;
    };
}

export default function Footer() {
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        fetch('/SiteContent/footer.json')
            .then((res) => res.json())
            .then((data) => setFooterData(data))
            .catch((error) => console.error('Error loading footer data:', error));
    }, []);

    if (!footerData) return null;

    return (
        <footer className="footer-bg">
            {/* Top Section - Company Info and Links */}
            <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 footer-heading">
                                {footerData.companyInfo.name}
                            </h3>
                            <p className="footer-tagline text-sm sm:text-base leading-relaxed">
                                {footerData.companyInfo.tagline}
                            </p>
                        </div>

                        {/* Main Pages */}
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold mb-6 footer-heading">
                                {footerData.links.mainPages.title}
                            </h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {footerData.links.mainPages.items.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.link}
                                            className="footer-link text-sm sm:text-base hover:opacity-70 transition-opacity block"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold mb-6 footer-heading">
                                {footerData.links.company.title}
                            </h4>
                            <ul className="space-y-3 sm:space-y-4">
                                {footerData.links.company.items.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.link}
                                            className="footer-link text-sm sm:text-base hover:opacity-70 transition-opacity block"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Details */}
                        <div>
                            <h4 className="text-lg sm:text-xl font-bold mb-6 footer-heading">
                                {footerData.contact.title}
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs mb-1 footer-contact-label">
                                        {footerData.contact.email.label}
                                    </p>
                                    <a
                                        href={`mailto:${footerData.contact.email.value}`}
                                        className="footer-link text-sm sm:text-base hover:opacity-70 transition-opacity block"
                                    >
                                        {footerData.contact.email.value}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs mb-1 footer-contact-label">
                                        {footerData.contact.address.label}
                                    </p>
                                    <p className="footer-link text-sm sm:text-base">
                                        {footerData.contact.address.value}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs mb-1 footer-contact-label">
                                        {footerData.contact.phone.label}
                                    </p>
                                    <a
                                        href={`tel:${footerData.contact.phone.value}`}
                                        className="footer-link text-sm sm:text-base hover:opacity-70 transition-opacity block"
                                    >
                                        {footerData.contact.phone.value}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar - Dark */}
            <div className="footer-copyright-bg px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <p className="footer-copyright-text">
                            {footerData.copyright}
                        </p>
                        {footerData.developer && (
                            <p className="footer-developer-text">
                                {footerData.developer.text}{' '}
                                <a
                                    href={footerData.developer.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-developer-link text-primary hover:opacity-70 transition-opacity"
                                >
                                    {footerData.developer.name}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
