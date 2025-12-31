'use client';

import { useState, useEffect } from 'react';
import { Check, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';

interface Service {
    id: number;
    icon: string;
    title: string;
    description: string;
}

interface Point {
    id: number;
    text: string;
}

interface ProcessStep {
    id: number;
    number: string;
    icon: string;
    title: string;
    description: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    social: {
        twitter: string;
        linkedin: string;
    };
}

interface AboutPageData {
    banner: {
        backgroundImage: string;
        eyebrow: string;
        heading: string;
        headingItalic: string;
    };
    moreAboutUs: {
        eyebrow: string;
        heading: string;
        headingItalic: string;
        description: string;
        subDescription: string;
        image: string;
        services: Service[];
    };
    mission: {
        eyebrow: string;
        heading: string;
        headingItalic: string;
        description: string;
        image: string;
        points: Point[];
    };
    vision: {
        eyebrow: string;
        heading: string;
        headingItalic: string;
        description: string;
        image: string;
        points: Point[];
    };
    process: {
        eyebrow: string;
        heading: string;
        headingItalic: string;
        subheading: string;
        steps: ProcessStep[];
    };
    team: {
        eyebrow: string;
        heading: string;
        headingItalic: string;
        members: TeamMember[];
    };
}

export default function AboutPage() {
    const [data, setData] = useState<AboutPageData | null>(null);

    useEffect(() => {
        fetch('/SiteContent/aboutPage.json')
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData))
            .catch((error) => console.error('Error loading about page data:', error));
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
                    <p className="text-primary text-sm sm:text-base mb-4 font-medium">
                        {data.banner.eyebrow}
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                        {data.banner.heading}{' '}
                        <span className="italic font-serif">{data.banner.headingItalic}</span>
                    </h1>
                </div>
            </section>

            {/* More About Us Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 section-bg-alt">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 sm:mb-12">
                        <p className="text-primary text-sm sm:text-base mb-4 font-medium">
                            {data.moreAboutUs.eyebrow}
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            {data.moreAboutUs.heading}{' '}
                            <span className="italic font-serif">{data.moreAboutUs.headingItalic}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                        <div className="space-y-6">
                            <p className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed">
                                {data.moreAboutUs.description}
                            </p>
                            <p className="text-base sm:text-lg text-muted leading-relaxed">
                                {data.moreAboutUs.subDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                                {data.moreAboutUs.services.map((service) => {
                                    const IconComponent = (LucideIcons as any)[service.icon];
                                    return (
                                        <div key={service.id} className="card-bg p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 service-icon rounded-full flex items-center justify-center mb-4">
                                                {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {service.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="relative h-100 sm:h-125 lg:h-full rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src={data.moreAboutUs.image}
                                alt="Consultant"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1 relative h-100 sm:h-125 rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src={data.mission.image}
                                alt="Our Mission"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="order-1 lg:order-2 space-y-6">
                            <p className="text-primary text-sm sm:text-base font-medium">
                                {data.mission.eyebrow}
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                                {data.mission.heading}{' '}
                                <span className="italic font-serif">{data.mission.headingItalic}</span>
                            </h2>
                            <p className="text-base sm:text-lg text-muted leading-relaxed">
                                {data.mission.description}
                            </p>

                            <div className="space-y-4 pt-4">
                                {data.mission.points.map((point) => (
                                    <div key={point.id} className="flex items-start gap-3">
                                        <div className="shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-base sm:text-lg text-foreground">
                                            {point.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="#"
                                className="inline-flex items-center gap-0 rounded-full bg-primary w-fit transition-all duration-300 hover:scale-105 hover:shadow-2xl group/button mt-6"
                            >
                                <span className="px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-base text-white shadow-orange-50 sm:text-lg ">
                                    Get Started
                                </span>
                                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-2 group-hover/button:rotate-45 transition-transform duration-300 bg-white text-primary">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 " />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 section-bg-alt">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-primary text-sm sm:text-base font-medium">
                                {data.vision.eyebrow}
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                                {data.vision.heading}{' '}
                                <span className="italic font-serif">{data.vision.headingItalic}</span>
                            </h2>
                            <p className="text-base sm:text-lg text-muted leading-relaxed">
                                {data.vision.description}
                            </p>

                            <div className="space-y-4 pt-4">
                                {data.vision.points.map((point) => (
                                    <div key={point.id} className="flex items-start gap-3">
                                        <div className="shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-base sm:text-lg text-foreground">
                                            {point.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="#"
                                className="inline-flex items-center gap-0 rounded-full bg-primary w-fit transition-all duration-300 hover:scale-105 hover:shadow-2xl group/button mt-6"
                            >
                                <span className="px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-base text-white shadow-orange-50 sm:text-lg ">
                                    Get Started
                                </span>
                                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-2 group-hover/button:rotate-45 transition-transform duration-300 bg-white text-primary">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 " />
                                </span>
                            </Link>
                        </div>

                        <div className="relative h-100 sm:h-125 rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src={data.vision.image}
                                alt="Our Vision"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section - Timeline */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 sm:mb-16">
                        <p className="text-primary text-sm sm:text-base mb-4 font-medium">
                            {data.process.eyebrow}
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {data.process.heading}{' '}
                            <span className="italic font-serif">{data.process.headingItalic}</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-muted">
                            {data.process.subheading}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-8">
                            {data.process.steps.map((step, index) => {
                                const IconComponent = (LucideIcons as any)[step.icon];
                                const isLast = index === data.process.steps.length - 1;

                                return (
                                    <div key={step.id} className="relative">
                                        {!isLast && (
                                            <div className="absolute left-7.75 top-16 w-0.5 h-[calc(100%+32px)] bg-primary" />
                                        )}

                                        <div className="flex gap-6">
                                            <div className="shrink-0">
                                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold relative z-10">
                                                    {step.number}
                                                </div>
                                            </div>

                                            <div className="card-bg p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex-1">
                                                <div className="w-12 h-12 service-icon rounded-full flex items-center justify-center mb-4">
                                                    {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground mb-3">
                                                    {step.title}
                                                </h3>
                                                <p className="text-muted leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hidden lg:block relative h-full min-h-125">
                            <div className="sticky top-24 space-y-6">
                                <div className="cta-box-bg p-8 rounded-3xl shadow-xl">
                                    <h3 className="text-2xl font-bold mb-4 cta-title-color">Transform Your Business</h3>
                                    <p className="cta-description-color mb-6">
                                        Our proven process ensures measurable results and sustainable growth for your organization.
                                    </p>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center gap-0 rounded-full w-fit transition-all duration-300 hover:scale-105 hover:shadow-2xl group/button bg-white/20 hover:bg-white/30"
                                    >
                                        <span className="px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg text-white">
                                            Start Your Journey
                                        </span>
                                        <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-2 group-hover/button:rotate-45 transition-transform duration-300 bg-white">
                                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 section-bg-alt">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <p className="text-primary text-sm sm:text-base mb-4 font-medium">
                            {data.team.eyebrow}
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                            {data.team.heading}{' '}
                            <span className="italic font-serif">{data.team.headingItalic}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {data.team.members.map((member) => (
                            <div
                                key={member.id}
                                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative h-100 sm:h-112.5 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-900/90 backdrop-blur-sm rounded-2xl text-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">{member.name}</h3>
                                        <p className="text-gray-300 text-sm">{member.role}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={member.social.twitter}
                                            className="w-10 h-10 bg-white/10 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors"
                                            aria-label="Twitter"
                                        >
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                        <a
                                            href={member.social.linkedin}
                                            className="w-10 h-10 bg-white/10 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-colors"
                                            aria-label="LinkedIn"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
