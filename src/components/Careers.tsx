'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useMeta } from '@/context/MetaContext';

interface Role {
    id: number;
    title: string;
}

interface CareersData {
    title: string;
    heading: string;
    description: string;
    image?: string;
    showBubbles?: boolean;
    currentOpenings: {
        title: string;
        subtitle: string;
        contact: string;
    };
    careerPaths: {
        title: string;
        roles: Role[];
    };
    resumeEmail: string;
}

export default function Careers() {
    const [careersData, setCareersData] = useState<CareersData | null>(null);
    const { theme } = useTheme();
    const { meta } = useMeta();

    useEffect(() => {
        fetch('/SiteContent/careers.json')
            .then((res) => res.json())
            .then((data) => setCareersData(data))
            .catch((error) => console.error('Error loading careers data:', error));
    }, []);

    if (!careersData) return null;

    // Get theme-appropriate colors
    const primaryColor = theme === 'dark' ? meta.colors.primaryDark : meta.colors.primaryLight;
    const secondaryColor = theme === 'dark' ? meta.colors.secondaryDark : meta.colors.secondaryLight;

    // Dynamic styling based on theme and colors
    const illustrationStyle = {
        filter: theme === 'dark'
            ? 'brightness(0.9) saturate(1.1) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))'
            : 'brightness(1.05) saturate(1) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))',
        transition: 'all 0.3s ease',
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 careers-section-bg">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 sm:space-y-8 careers-content-animate">
                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold careers-title">
                            {careersData.title}
                        </h2>

                        {/* Heading */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold careers-heading">
                            {careersData.heading}
                        </h3>

                        {/* Description */}
                        <p className="text-base sm:text-lg md:text-xl careers-description leading-relaxed">
                            {careersData.description}
                        </p>

                        {/* Current Openings */}
                        <div className="space-y-4 pt-4">
                            <h4 className="text-xl sm:text-2xl font-bold careers-section-title">
                                {careersData.currentOpenings.title}
                            </h4>
                            <p className="text-base sm:text-lg careers-subtitle">
                                {careersData.currentOpenings.subtitle}
                            </p>
                            <p className="text-base sm:text-lg careers-contact">
                                {careersData.currentOpenings.contact.split('at ')[0]}
                                <a
                                    href={`mailto:${careersData.resumeEmail}`}
                                    className="careers-email-link font-semibold hover:underline"
                                >
                                    {careersData.resumeEmail}
                                </a>
                                {' '}for future opportunities.
                            </p>
                        </div>

                        {/* Career Paths */}
                        <div className="space-y-4 pt-4">
                            <h4 className="text-xl sm:text-2xl font-bold careers-section-title">
                                {careersData.careerPaths.title}
                            </h4>
                            <ul className="space-y-3">
                                {careersData.careerPaths.roles.map((role) => (
                                    <li key={role.id} className="flex items-start gap-3">
                                        <div className="careers-check-bg rounded-full p-1 mt-1 shrink-0">
                                            <Check className="w-4 h-4 careers-check-icon" />
                                        </div>
                                        <span className="text-base sm:text-lg careers-role-text">
                                            {role.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative careers-illustration-animate mt-8 lg:mt-0">
                        <div className="relative px-4 sm:px-8 lg:px-0">
                            {/* Animated Background Glow */}
                            {careersData.showBubbles && (
                                <div
                                    className="absolute inset-0 rounded-lg blur-2xl sm:blur-3xl opacity-10 sm:opacity-20 animate-pulse-slow"
                                    style={{
                                        background: `radial-gradient(circle, ${primaryColor}, transparent)`,
                                    }}
                                />
                            )}

                            {/* Illustration Image with Animation */}
                            <div className="relative z-10 animate-float">
                                <img
                                    src={careersData.image || "/images/revenue.svg"}
                                    alt="Careers Illustration"
                                    className="w-full h-auto max-w-md mx-auto lg:max-w-none careers-illustration-image rounded-lg transition-all duration-300 hover:scale-105 active:scale-100"
                                    style={illustrationStyle}
                                />
                            </div>

                            {/* Decorative Elements - Responsive */}
                            {careersData.showBubbles && (
                                <>
                                    <div
                                        className="hidden sm:block absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full opacity-20 sm:opacity-30 animate-pulse-subtle"
                                        style={{
                                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                        }}
                                    />
                                    <div
                                        className="hidden sm:block absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full opacity-15 sm:opacity-20 animate-bounce-gentle"
                                        style={{
                                            background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
