'use client';

import { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';

interface Stat {
    icon: string;
    number: string;
    description: string;
}

interface NumbersData {
    heading: string;
    description: string;
    stats: Stat[];
}

const iconColorClasses = ['icon-blue', 'icon-purple', 'icon-green', 'icon-orange'];
const hoverTextClasses = ['hover:text-blue-600 dark:hover:text-blue-400', 'hover:text-purple-600 dark:hover:text-purple-400', 'hover:text-green-600 dark:hover:text-green-400', 'hover:text-orange-600 dark:hover:text-orange-400'];

export default function NumbersSection() {
    const [numbersData, setNumbersData] = useState<NumbersData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [animatedNumbers, setAnimatedNumbers] = useState<{ [key: number]: number }>({});
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        fetch('/SiteContent/numbersHome.json')
            .then((res) => res.json())
            .then((data) => setNumbersData(data))
            .catch((error) => console.error('Error loading numbers data:', error));
    }, []);

    useEffect(() => {
        if (!numbersData) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isVisible) {
                    setIsVisible(true);

                    // Animate numbers
                    numbersData.stats.forEach((stat, index) => {
                        const numericValue = parseInt(stat.number.replace(/\D/g, ''));
                        if (numericValue) {
                            const duration = 2000;
                            const increment = numericValue / (duration / 16);
                            let current = 0;

                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= numericValue) {
                                    setAnimatedNumbers(prev => ({ ...prev, [index]: numericValue }));
                                    clearInterval(timer);
                                } else {
                                    setAnimatedNumbers(prev => ({ ...prev, [index]: Math.floor(current) }));
                                }
                            }, 16);
                        }
                    });
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [numbersData, isVisible]);

    if (!numbersData) {
        return null;
    }

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`text-center mb-6 sm:mb-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold card-text mx-auto max-w-full lg:max-w-[50%] leading-tight">
                        {numbersData.heading}
                    </h2>
                </div>

                {/* Description */}
                <div className={`text-center mb-12 sm:mb-16 lg:mb-20 ${isVisible ? 'animate-slide-up animation-delay-200' : 'opacity-0'}`}>
                    <p className="text-base sm:text-lg lg:text-xl card-text-muted mx-auto max-w-full lg:max-w-[75%] leading-relaxed">
                        {numbersData.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {numbersData.stats.map((stat, index) => {
                        // Capitalize first letter for case-insensitive icon lookup
                        const iconName = stat.icon.charAt(0).toUpperCase() + stat.icon.slice(1);
                        const IconComponent = (LucideIcons as any)[iconName];
                        const suffix = stat.number.replace(/\d/g, '');
                        const displayNumber = animatedNumbers[index] || 0;
                        const colorClass = iconColorClasses[index];
                        const hoverClass = hoverTextClasses[index];

                        // Debug: log if icon is not found
                        if (!IconComponent) {
                            console.warn(`Icon not found: ${stat.icon} (tried: ${iconName})`);
                        }

                        return (
                            <div
                                key={index}
                                className={`card-bg p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group cursor-default ${isVisible ? 'animate-slide-up' : 'opacity-0'
                                    }`}
                                style={{ animationDelay: `${(index + 2) * 200}ms` }}
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className={`${colorClass} w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                                        {IconComponent ? (
                                            <IconComponent className="w-7 h-7" />
                                        ) : (
                                            <div className="w-7 h-7 text-red-500 flex items-center justify-center font-bold">?</div>
                                        )}
                                    </div>
                                </div>

                                {/* Number */}
                                <div className="mb-4">
                                    <h3 className={`text-4xl sm:text-5xl lg:text-6xl font-bold card-text transition-colors duration-300 ${hoverClass}`}>
                                        {displayNumber}{suffix}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-sm sm:text-base card-text-muted leading-relaxed transition-all duration-300 group-hover:text-opacity-90">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
