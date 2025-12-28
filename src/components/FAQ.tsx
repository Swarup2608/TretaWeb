'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQData {
    heading: {
        line1: string;
        line2: string;
    };
    sidebar: {
        title: string;
        description: string;
        cta: {
            label: string;
            link: string;
        };
    };
    faqs: FAQItem[];
}

export default function FAQ() {
    const [faqData, setFaqData] = useState<FAQData | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        fetch('/SiteContent/faq.json')
            .then((res) => res.json())
            .then((data) => setFaqData(data))
            .catch((error) => console.error('Error loading FAQ data:', error));
    }, []);

    if (!faqData) return null;

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 faq-section-bg">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 lg:mb-16 faq-heading-animate">
                    {faqData.heading.line1}{' '}
                    <span className="italic font-serif faq-heading-color">{faqData.heading.line2}</span>
                </h2>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Sidebar - White Box */}
                    <div className="lg:col-span-1 faq-sidebar-animate">
                        <div className="faq-sidebar-bg rounded-3xl p-6 sm:p-8 sticky top-8">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 faq-sidebar-title">
                                {faqData.sidebar.title}
                            </h3>
                            <p className="text-sm sm:text-base mb-6 sm:mb-8 faq-sidebar-description leading-relaxed">
                                {faqData.sidebar.description}
                            </p>
                            <Link
                                href={faqData.sidebar.cta.link}
                                className="inline-flex items-center gap-3 rounded-full w-full sm:w-auto justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group faq-cta-btn px-6 py-3.5 font-semibold text-base"
                            >
                                {faqData.sidebar.cta.label}
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 faq-cta-icon-bg">
                                    <ArrowUpRight className="w-4 h-4 faq-cta-icon" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right - FAQ Items */}
                    <div className="lg:col-span-2 space-y-4 faq-items-animate">
                        {faqData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="faq-item-bg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors duration-200"
                                >
                                    <span className="text-base sm:text-lg font-semibold pr-4 faq-question-text">
                                        {faq.question}
                                    </span>
                                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 faq-icon-bg">
                                        {openIndex === index ? (
                                            <Minus className="w-4 h-4 sm:w-5 sm:h-5 faq-icon-color" />
                                        ) : (
                                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 faq-icon-color" />
                                        )}
                                    </div>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                                        <p className="text-sm sm:text-base leading-relaxed faq-answer-text">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
