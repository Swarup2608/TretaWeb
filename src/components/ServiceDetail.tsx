'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceDetailProps {
    service: {
        title: string;
        fullDescription: string;
        image: string;
        button: string;
        link: string;
    };
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Banner with Service Image */}
            <section className="relative h-75 sm:h-100 lg:h-125 flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center animate-fade-in-up drop-shadow-2xl">
                        {service.title}
                    </h1>
                </div>
            </section>

            {/* Content Section - Full Width */}
            <section className="py-16 sm:py-20 lg:py-24 bg-light">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Description - Full Width */}
                        <div
                            className="animate-fade-in-up"
                            style={{ animationDelay: '100ms' }}
                        >
                            <div
                                className="prose prose-lg max-w-none text-base sm:text-lg text-subtle leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                            />
                            <div
                                className="flex justify-center mt-12 lg:mt-16 animate-fade-in-up"
                                style={{ animationDelay: '200ms' }}
                            >
                                <Link
                                    href={service.link}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white font-semibold text-base sm:text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                                >
                                    {/* Animated background */}
                                    <span className="absolute inset-0 bg-linear-to-r from-primary to-primary/80 transition-transform duration-300 group-hover:scale-110" />

                                    {/* Button content */}
                                    <span className="relative z-10">{service.button}</span>
                                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
