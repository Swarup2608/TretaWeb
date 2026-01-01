'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface Service {
    icon: string;
    label: string;
}

interface AboutData {
    heading: string;
    description: string;
    image: string;
    services: Service[];
    stats: {
        number: string;
        label: string;
    };
    cta: {
        label: string;
        link: string;
    };
}

const iconColorClasses = ['icon-blue', 'icon-purple', 'icon-green', 'icon-orange'];

export default function About() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        fetch('/SiteContent/about.json')
            .then((res) => res.json())
            .then((data) => setAboutData(data))
            .catch((error) => console.error('Error loading about data:', error));
    }, []);

    useEffect(() => {
        if (!aboutData || hasAnimated) return;

        // Check if stats exist before accessing
        const statsNumber = aboutData.stats?.number ? parseInt(aboutData.stats.number.replace(/\D/g, '')) : 0;
        if (statsNumber === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true);
                    setIsVisible(true);
                    const duration = 2000;
                    const increment = statsNumber / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= statsNumber) {
                            setCount(statsNumber);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [aboutData, hasAnimated]);

    if (!aboutData) {
        return null;
    }

    // Fallback values and conditional rendering flags
    const heading = aboutData.heading || '';
    const description = aboutData.description || '';
    const image = aboutData.image || '/images/hero/hero-img.png';
    const services = aboutData.services?.filter(s => s.label) || [];
    const statsNumber = aboutData.stats?.number ? parseInt(aboutData.stats.number.replace(/\D/g, '')) : 0;
    const statsLabel = aboutData.stats?.label || '';
    const ctaLabel = aboutData.cta?.label || 'Learn More';
    const ctaLink = aboutData.cta?.link || '/';

    // Skip entire section if no heading
    if (!heading) {
        return null;
    }

    // Determine column layout based on available content
    const hasStats = statsNumber > 0 && statsLabel;
    const hasDescription = description.length > 0;
    const hasServices = services.length > 0;

    // Calculate grid layout
    const getGridCols = () => {
        if (hasDescription && hasStats && hasServices) return 'lg:grid-cols-12';
        if ((hasDescription || hasStats) && hasServices) return 'lg:grid-cols-2';
        return 'lg:grid-cols-1';
    };

    return (
        <section ref={sectionRef} className="py-16 md:py-16 px-4 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Heading at Top */}
                <div className={`mb-12 sm:mb-16 md:max-w-[75%] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight card-text">
                        {heading}
                    </h2>
                </div>

                {/* Main Content Grid */}
                <div className={`grid ${getGridCols()} gap-8 lg:gap-12`}>
                    {/* Left Column - Description & Stats */}
                    {(hasDescription || hasStats) && (
                        <div className={`${hasDescription && hasStats && hasServices ? 'lg:col-span-4' : ''} flex flex-col justify-between ${isVisible ? 'animate-slide-left animation-delay-200' : 'opacity-0'}`}>
                            {hasDescription && (
                                <p className="text-base sm:text-lg card-text-muted leading-relaxed mb-16 lg:mb-0 transition-all duration-300 hover:text-opacity-80">
                                    {description}
                                </p>
                            )}

                            {/* Stats at Bottom */}
                            {hasStats && (
                                <div className="border-l-4 border-primary pl-4 transition-all duration-300 hover:border-primary-dark hover:pl-6">
                                    <div className="text-6xl sm:text-7xl lg:text-8xl font-bold card-text mb-1 leading-none transition-all duration-300 hover:text-blue-600">
                                        {count}+
                                    </div>
                                    <p className="text-base sm:text-lg card-text-muted font-normal">
                                        {statsLabel}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Center Column - Image */}
                    <div className={`${hasDescription && hasStats && hasServices ? 'lg:col-span-4' : ''} ${isVisible ? 'animate-scale-in animation-delay-400' : 'opacity-0'}`}>
                        <div className="relative aspect-3/4 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
                            <Image
                                src={image}
                                alt="Team"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Right Column - Services & CTA */}
                    {hasServices && (
                        <div className={`${hasDescription && hasStats && hasServices ? 'lg:col-span-4' : ''} flex flex-col justify-end min-h-100 gap-8 lg:gap-12 ${isVisible ? 'animate-slide-right animation-delay-600' : 'opacity-0'}`}>
                            {/* Services List */}
                            <div className="relative">
                                {/* Pin Icon */}
                                <div className="space-y-6 card-bg relative p-6 sm:p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
                                    <div className="absolute top-4 right-8 z-10">
                                        <svg className="w-6 h-6 text-primary transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                                        </svg>
                                    </div>
                                    {services.map((service, index) => {
                                        // Capitalize first letter for case-insensitive icon lookup
                                        const iconName = service.icon?.charAt(0).toUpperCase() + service.icon?.slice(1);
                                        const IconComponent = iconName ? (LucideIcons as any)[iconName] : null;
                                        const colorClass = iconColorClasses[index % iconColorClasses.length];
                                        const firstLetter = service.label?.charAt(0).toUpperCase() || '?';

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2 group cursor-pointer"
                                            >
                                                <div className={`${colorClass} p-2.5 rounded-lg shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md flex items-center justify-center`}>
                                                    {IconComponent ? (
                                                        <IconComponent className="w-5 h-5" />
                                                    ) : (
                                                        <span className="text-sm font-bold">{firstLetter}</span>
                                                    )}
                                                </div>
                                                <span className="text-base sm:text-lg font-normal card-text group-hover:text-blue-600 transition-colors duration-300">
                                                    {service.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CTA Button at Bottom */}
                            <div className="mt-8 lg:mt-0 flex items-center justify-end-safe">
                                <Link
                                    href={ctaLink}
                                    className="inline-flex items-center justify-center gap-3 btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 font-medium text-base sm:text-lg shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 group"
                                >
                                    {ctaLabel}
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
                                        <ArrowUpRight className="w-4 h-4 text-primary transition-transform duration-300" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
