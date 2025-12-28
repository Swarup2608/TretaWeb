"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

interface Service {
    title: string;
    overview: string;
    image: string;
    description: string;
    features: string[];
}

interface ServicesData {
    heading: string;
    cta: {
        label: string;
        link: string;
    };
    services: Service[];
}

export default function Services() {
    const [data, setData] = useState<ServicesData | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetch("/SiteContent/services.json")
            .then((res) => res.json())
            .then((jsonData) => setData(jsonData));

        setIsVisible(true);
    }, []);

    if (!data) return null;

    const handleAccordionClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="relative py-12 lg:py-20 overflow-hidden">
            {/* Header */}
            <div
                className={`max-w-7xl mx-auto px-6 mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold card-text max-w-4xl">
                    {data.heading.split("Strategic")[0]}
                    <span className="block">
                        Strategic{" "}
                        <span className="italic font-serif">
                            {data.heading.split("Strategic")[1].trim()}
                        </span>
                    </span>
                </h2>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Accordion */}
                    <div className="space-y-2">
                        {data.services.map((service, index) => (
                            <div
                                key={index}
                                className={`border-b card-text-muted transition-all duration-500 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-8"
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => handleAccordionClick(index)}
                                    className="w-full text-left py-6 lg:py-8 flex items-start cursor-pointer gap-4 lg:gap-6 hover:opacity-80 transition-all duration-300 group"
                                >
                                    <span className="text-lg lg:text-xl font-bold card-text-muted shrink-0 transition-colors duration-300 group-hover:header-logo">
                                        [0{index + 1}]
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-2xl lg:text-3xl font-bold card-text transition-colors duration-300 group-hover:header-logo">
                                            {service.title}
                                        </h3>
                                        {activeIndex === index && (
                                            <p className="text-sm lg:text-base card-text-muted mt-4 leading-relaxed">
                                                {service.overview}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 lg:w-6 lg:h-6 card-text-muted shrink-0 transition-all duration-300 group-hover:header-logo ${activeIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Accordion Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ${activeIndex === index
                                        ? "max-h-200 opacity-100"
                                        : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="pl-10 lg:pl-16 pr-6 lg:pr-8 pb-6 lg:pb-8 pt-2">
                                        <p className="card-text-muted mb-6 text-sm lg:text-base leading-relaxed">
                                            {service.description}
                                        </p>

                                        <a
                                            href="/services"
                                            className="inline-flex items-center justify-center gap-3 btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 font-medium text-base shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 group"
                                        >
                                            Explore Service
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
                                                <ArrowUpRight className="w-4 h-4 text-blue-600 transition-transform duration-300 " />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Image */}
                    <div
                        className={`sticky top-24 h-fit transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                            }`}
                    >
                        <div className="relative aspect-4/5 rounded-3xl overflow-hidden card-bg shadow-2xl">
                            {data.services[activeIndex].image && (
                                <img
                                    src={data.services[activeIndex].image}
                                    alt={data.services[activeIndex].title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                    key={activeIndex}
                                />
                            )}

                            {/* Overlay with gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                            {/* Service title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="inline-block px-4 py-2 card-bg backdrop-blur-sm rounded-full">
                                    <span className="text-sm font-semibold card-text">
                                        {data.services[activeIndex].title}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
