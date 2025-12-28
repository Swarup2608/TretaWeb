'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CaseStudy {
    title: string;
    description: string;
    image: string;
    link: string;
}

interface CaseStudiesData {
    heading: {
        line1: string;
        line2: string;
        line2Italic: string;
    };
    caseStudies: CaseStudy[];
}

export default function CaseStudies() {
    const [data, setData] = useState<CaseStudiesData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        fetch('/SiteContent/caseStudies.json')
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData))
            .catch((error) => console.error('Error loading case studies:', error));

        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!data) return null;

    const totalPages = Math.ceil(data.caseStudies.length / itemsPerView);
    const maxIndex = totalPages - 1;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground case-study-header-animate">
                        {data.heading.line1} {data.heading.line2}{' '}
                        <span className="italic font-serif">{data.heading.line2Italic}</span>
                    </h2>

                    {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
                    <div className="hidden sm:flex gap-3 case-study-nav-animate">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed case-study-nav-btn"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex}
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed case-study-nav-btn"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out"
                            style={{
                                transform: itemsPerView === 1
                                    ? `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`
                                    : itemsPerView === 2
                                        ? `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`
                                        : `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))`,
                            }}
                        >
                            {data.caseStudies.map((study, index) => (
                                <div
                                    key={index}
                                    className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] case-study-card-animate"
                                >
                                    <div className="relative rounded-3xl overflow-hidden h-100 sm:h-112.5 lg:h-125 case-study-card-bg shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 has-[a:hover]:-translate-y-0">
                                        {/* Image Container */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${study.image})` }}
                                            ></div>
                                            {/* Overlay */}
                                            <div className="case-study-overlay"></div>
                                        </div>

                                        {/* Content Box - Positioned absolutely on top */}
                                        <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8 rounded-3xl m-5 case-study-content-bg backdrop-blur-md transition-all duration-400 ease-out flex flex-col justify-start z-2 sm:h-auto sm:min-h-22.5 group-hover:sm:min-h-75">
                                            {/* Title - Always visible */}
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-0 sm:mb-3 shrink-0 case-study-title-color">
                                                {study.title}
                                            </h3>

                                            {/* Description - Always visible on mobile, visible on hover for desktop */}
                                            <p className="case-study-description-text leading-relaxed text-[0.9375rem] sm:text-base mt-4 mb-5 sm:opacity-0 sm:max-h-0 sm:m-0 sm:overflow-hidden sm:translate-y-5 group-hover:sm:opacity-100 group-hover:sm:max-h-50 group-hover:sm:mt-4 group-hover:sm:mb-6 group-hover:sm:translate-y-0 transition-all duration-400 ease-out shrink-0">
                                                {study.description}
                                            </p>

                                            {/* Button - Always visible on mobile, visible on hover for desktop */}
                                            <Link
                                                href={study.link}
                                                className="inline-flex items-center gap-0 rounded-full w-fit shrink-0 sm:opacity-0 sm:max-h-0 sm:overflow-hidden sm:translate-y-5 group-hover:sm:opacity-100 group-hover:sm:max-h-25 group-hover:sm:translate-y-0 transition-all duration-400 ease-out case-study-btn-wrapper group/button"
                                            >
                                                <span className="px-7 py-3.5 font-semibold text-[0.9375rem] sm:text-base case-study-btn-text">
                                                    View Case Study
                                                </span>
                                                <span className="w-10 h-10 sm:w-11 sm:h-11 mr-2 rounded-full bg-white flex items-center group-hover/button:rotate-45 justify-center case-study-btn-icon">
                                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Controls - Dots with Arrows on mobile */}
                    <div className="flex justify-center items-center gap-4 mt-6 case-study-dots-animate">
                        {/* Arrow buttons - visible only on mobile */}
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed case-study-nav-btn"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Navigation Dots */}
                        <div className="flex gap-2">
                            {Array.from({ length: Math.ceil(data.caseStudies.length / itemsPerView) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-[#2563eb] w-8'
                                        : 'bg-[#d1d5db] w-2'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        {/* Arrow buttons - visible only on mobile */}
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex}
                            className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed case-study-nav-btn"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
