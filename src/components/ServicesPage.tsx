'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import NumbersSection from './NumbersSection';
import CTA from './CTA';

interface Service {
    id: number;
    slug: string;
    icon: string;
    title: string;
    description: string;
    link: string;
}

interface ServicesPageData {
    banner: {
        backgroundImage: string;
        eyebrow: string;
        heading: string;
        headingItalic: string;
    };
    services: Service[];
}

export default function ServicesPage() {
    const [data, setData] = useState<ServicesPageData | null>(null);

    useEffect(() => {
        fetch('/SiteContent/services.json')
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData))
            .catch((error) => console.error('Error loading services page data:', error));
    }, []);

    if (!data) return null;

    return (
        <>
            {/* Banner Section */}
            <section
                className="relative h-100 sm:h-125 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url(${data.banner.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <p className="text-primary text-sm sm:text-base mb-4 font-medium animate-fade-in">
                        {data.banner.eyebrow}
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white animate-slide-up">
                        {data.banner.heading}{' '}
                        <span className="italic font-serif">{data.banner.headingItalic}</span>
                    </h1>
                </div>
            </section>

            {/* Services Grid Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {data.services.map((service, index) => {
                            const IconComponent = (LucideIcons as any)[service.icon];
                            return (
                                <div
                                    key={service.id}
                                    className="card-bg p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 bg-primary/10 group-hover:bg-primary/20">
                                        {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-base text-muted leading-relaxed mb-6">
                                        {service.description}
                                    </p>

                                    {/* Read More Link */}
                                    <Link
                                        href={`/services/${service.slug}`}
                                        className="items-center gap-3 rounded-full w-fit shrink-0 sm:overflow-hidden flex sm:max-h-25 sm:translate-y-0 transition-all duration-400 ease-out case-study-btn-wrapper group/button px-6 py-3.5 font-semibold text-base text-white"
                                    >
                                        Read More
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/button:rotate-45 bg-white text-primary">
                                            <ArrowUpRight className="w-4 h-4 faq-cta-icon" />
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>



            {/* Numbers Section with Darker Background */}
            <section className="section-bg-darker">
                <NumbersSection />
            </section>

            {/* CTA Section */}
            <CTA />
        </>
    );
}
