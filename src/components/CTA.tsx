'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface Schedule {
    days: string;
    time: string;
}

interface CTAData {
    heading: {
        line1: string;
        line2: string;
        line2Italic: string;
    };
    image: string;
    box: {
        title: string;
        description: string;
        schedule: Schedule[];
        cta: {
            label: string;
            link: string;
        };
    };
}

export default function CTA() {
    const [ctaData, setCtaData] = useState<CTAData | null>(null);

    useEffect(() => {
        fetch('/SiteContent/cta.json')
            .then((res) => res.json())
            .then((data) => setCtaData(data))
            .catch((error) => console.error('Error loading CTA data:', error));
    }, []);

    if (!ctaData) return null;

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 cta-heading-animate">
                    {ctaData.heading.line1} {ctaData.heading.line2}{' '}
                    <span className="italic font-serif">{ctaData.heading.line2Italic}</span>
                </h2>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* Left - Image */}
                    <div className="cta-image-animate">
                        <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[400px] lg:h-full min-h-[500px]">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${ctaData.image})` }}
                            ></div>
                        </div>
                    </div>

                    {/* Right - Blue Box */}
                    <div className="cta-box-animate">
                        <div className="cta-box-bg rounded-3xl p-8 sm:p-10 lg:p-12 h-full flex flex-col justify-between">
                            {/* Pin Icon */}
                            <div className="mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 cta-icon-bg rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 cta-icon-color" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 cta-title-color">
                                {ctaData.box.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base sm:text-lg mb-6 sm:mb-8 cta-description-color leading-relaxed">
                                {ctaData.box.description}
                            </p>

                            {/* Schedule */}
                            <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                                {ctaData.box.schedule.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center pb-4 sm:pb-5 cta-schedule-border"
                                    >
                                        <span className="text-base sm:text-lg font-medium cta-schedule-text">
                                            {item.days}
                                        </span>
                                        <span className="text-base sm:text-lg font-semibold cta-schedule-time">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Link
                                href={ctaData.box.cta.link}
                                className="inline-flex items-center gap-0 rounded-full w-fit transition-all duration-300 hover:scale-105 hover:shadow-2xl group/button cta-btn-wrapper"
                            >
                                <span className="px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg cta-btn-text">
                                    {ctaData.box.cta.label}
                                </span>
                                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-2 group-hover/button:rotate-45 transition-transform duration-300 cta-btn-icon-bg">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 cta-btn-icon-color" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
