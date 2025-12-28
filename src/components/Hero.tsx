'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard from './BusinessCard';

interface HeroData {
    heading: {
        line1: string;
        line2: string;
        line2Italic: string;
    };
    description: string;
    cta: {
        label: string;
        link: string;
    };
    backgroundImage: string;
}

export default function Hero() {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetch('/SiteContent/hero.json')
            .then((res) => res.json())
            .then((data) => setHeroData(data))
            .catch((error) => console.error('Error loading hero data:', error));

        // Trigger animations on mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!heroData) {
        return null;
    }

    return (
        <section className="relative min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 ">
            {/* Animated Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg-animated"
                style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
            ></div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/50 to-black/60 z-1 transition-all duration-700"></div>

            <div className="relative z-10 max-w-full mx-auto w-full flex flex-col justify-center lg:pb-32 pt-40 min-h-screen">
                {/* Main Content */}
                <div className={`text-left max-w-3xl mb-8 lg:mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight hero-text transition-all duration-700 ${isVisible ? 'animate-slide-up animation-delay-200' : 'opacity-0'}`}>
                        {heroData.heading.line1}{' '}
                        <span className="block mt-2 transition-all duration-700 hover:text-blue-400">
                            {heroData.heading.line2} <span className="italic font-serif hover:text-blue-300 transition-colors duration-300">{heroData.heading.line2Italic}</span>
                        </span>
                    </h1>
                    <p className={`text-lg sm:text-xl hero-text-muted mb-8 max-w-2xl transition-all duration-700 hover:text-white ${isVisible ? 'animate-slide-up animation-delay-400' : 'opacity-0'}`}>
                        {heroData.description}
                    </p>
                    <Link
                        href={heroData.cta.link}
                        className={`inline-flex items-center gap-0 btn-hero rounded-full backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 font-medium text-base sm:text-lg border hover:scale-105 hover:shadow-2xl hover:-translate-y-1 group ${isVisible ? 'animate-slide-up animation-delay-600' : 'opacity-0'}`}
                    >
                        <span className="px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 group-hover:pr-2">{heroData.cta.label}</span>
                        <div className="btn-hero-icon p-3 sm:p-4 rounded-full transition-all duration-300  group-hover:rotate-45 mr-2">
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 17L17 7M17 7H7M17 7v10"
                                />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Business Card - Inside on mobile, overflow on desktop */}
                <div className={`lg:absolute lg:bottom-0 lg:right-8 xl:lg:right-12 lg:translate-y-1/2 w-full lg:w-auto transition-all duration-700 ${isVisible ? 'animate-slide-up animation-delay-600' : 'opacity-0'}`}>
                    <BusinessCard />
                </div>
            </div>
        </section>
    );
}
