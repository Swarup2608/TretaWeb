'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Settings, Rocket, Target, Users, TrendingUp } from 'lucide-react';

interface ValueItem {
    iconName: string;
    title: string;
    description: string;
}

interface ValuesData {
    heading: {
        line1: string;
        line2: string;
        line2Italic: string;
    };
    values: ValueItem[];
}

const iconMap = {
    MessageCircle,
    Settings,
    Rocket,
    Target,
    Users,
    TrendingUp,
};

export default function Values() {
    const [valuesData, setValuesData] = useState<ValuesData | null>(null);

    useEffect(() => {
        fetch('/SiteContent/values.json')
            .then((res) => res.json())
            .then((data) => setValuesData(data))
            .catch((error) => console.error('Error loading values data:', error));
    }, []);

    if (!valuesData) {
        return null;
    }

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 lg:mb-16 text-foreground">
                    {valuesData.heading.line1} {valuesData.heading.line2}{' '}
                    <span className="italic font-serif">{valuesData.heading.line2Italic}</span>
                </h2>

                {/* Values Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {valuesData.values.map((value, index) => {
                        const IconComponent = iconMap[value.iconName as keyof typeof iconMap];

                        return (
                            <div
                                key={index}
                                className="values-card-bg rounded-2xl p-6 sm:p-8"
                            >
                                {/* Icon */}
                                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-6 flex items-center justify-center values-icon-bg rounded-2xl">
                                    {IconComponent && (
                                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 values-icon-color" strokeWidth={2} />
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">
                                    {value.title}
                                </h3>

                                {/* Description */}
                                <p className="values-description leading-relaxed text-sm sm:text-base">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
