"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard from './BusinessCard';
import { X } from 'lucide-react';

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

interface CallForm {
    name: string;
    email: string;
    mobile: string;
    subject: string;
    description: string;
    services: string[];
}


export default function Hero() {
    const [heroData, setHeroData] = useState<HeroData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showCTAModal, setShowCTAModal] = useState(false);
    const [form, setForm] = useState<CallForm>({ name: '', email: '', mobile: '', subject: '', description: '', services: [] });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [servicesList, setServicesList] = useState<string[]>([]);

    useEffect(() => {
        fetch('/SiteContent/hero.json')
            .then((res) => res.json())
            .then((data) => setHeroData(data))
            .catch((error) => console.error('Error loading hero data:', error));

        fetch('/SiteContent/services.json')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.services)) {
                    setServicesList(data.services.map((s: any) => s.title));
                }
            })
            .catch((error) => console.error('Error loading services:', error));

        // Trigger animations on mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!heroData) {
        return null;
    }

    // Fallback values
    const backgroundImage = heroData.backgroundImage || '/images/hero/hero-img.png';
    const heading1 = heroData.heading?.line1 || 'Treta';
    const heading2 = heroData.heading?.line2 || 'Group';
    const heading2Italic = heroData.heading?.line2Italic || '';
    const description = heroData.description || '';
    const ctaLabel = heroData.cta?.label || 'Contact Us';
    const ctaLink = heroData.cta?.link || '/';

    const handleCTAClick = (e: any) => {
        if (ctaLink === '/') {
            e.preventDefault();
            setShowCTAModal(true);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleServiceToggle = (service: string) => {
        setForm((prev) => {
            const exists = prev.services.includes(service);
            return {
                ...prev,
                services: exists
                    ? prev.services.filter((s) => s !== service)
                    : [...prev.services, service],
            };
        });
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (!form.mobile.trim()) return 'Mobile is required.';
        if (!form.description.trim()) return 'Description is required.';
        if (!form.services.length) return 'Please select at least one service.';
        if (!form.email.trim() && !form.mobile.trim()) return 'Email or Mobile is required.';
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address.';
        if (form.mobile && !/^\d{8,15}$/.test(form.mobile.replace(/\D/g, ''))) return 'Invalid mobile number.';
        return '';
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        const err = validateForm();
        if (err) {
            setFormError(err);
            return;
        }
        setFormLoading(true);
        try {
            const res = await fetch('/api/book-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setFormSuccess('Your request has been submitted!');
                setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [] });
            } else {
                setFormError(data.message || 'Failed to submit.');
            }
        } catch (err) {
            setFormError('Failed to submit.');
        }
        setFormLoading(false);
    };

    return (
        <section className="relative min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 ">
            {/* Animated Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg-animated cursor-zoom-in"
                style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`
                }}
                onClick={() => setIsZoomed(true)}
            ></div>

            {/* Zoom Overlay */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out animate-fade-in "
                    onClick={() => setIsZoomed(false)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full p-4 sm:p-8">
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={backgroundImage}
                            alt="Hero Background"
                            className="w-full h-full object-contain animate-scale-in"
                        />
                    </div>
                </div>
            )}

            <div className="relative z-10 mx-auto w-full flex flex-col justify-center lg:pb-32 pt-40 min-h-screen max-w-7xl">
                {/* Main Content */}
                <div className={`text-left max-w-3xl mb-8 lg:mb-20 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight hero-text transition-all duration-700 ${isVisible ? 'animate-slide-up animation-delay-200' : 'opacity-0'}`}>
                        {heading1}{' '}
                        <span className="block mt-2 transition-all duration-700 hover:text-blue-400">
                            {heading2} {heading2Italic && <span className="italic font-serif hover:text-blue-300 transition-colors duration-300">{heading2Italic}</span>}
                        </span>
                    </h1>
                    {description && (
                        <p className={`text-lg sm:text-xl hero-text-muted mb-8 max-w-2xl transition-all duration-700 hover:text-white ${isVisible ? 'animate-slide-up animation-delay-400' : 'opacity-0'}`}>
                            {description}
                        </p>
                    )}
                    <Link
                        href={ctaLink}
                        onClick={handleCTAClick}
                        className={`inline-flex items-center gap-0 btn-hero rounded-full backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 font-medium text-base sm:text-lg border hover:scale-105 hover:shadow-2xl hover:-translate-y-1 group ${isVisible ? 'animate-slide-up animation-delay-600' : 'opacity-0'}`}
                    >
                        <span className="px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 group-hover:pr-2">{ctaLabel}</span>
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


            {/* CTA Modal Popup */}
            {showCTAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="absolute inset-0 w-full h-full" onClick={() => { setShowCTAModal(false); setFormError(''); setFormSuccess(''); setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [] }); }} />
                    <div className="relative w-full max-w-2xl mx-auto bg-background-light rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col gap-4 border border-primary overflow-y-auto max-h-[95vh] min-h-[60vh]">
                        <button
                            className="absolute top-8 right-4 text-foreground cursor-pointer hover:text-primary font-bold text-2xl transition-colors z-10"
                            onClick={() => { setShowCTAModal(false); setFormError(''); setFormSuccess(''); setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [] }); }}
                            aria-label="Close"
                        >
                            <X width={24} height={24} />
                        </button>
                        <h2 className="text-3xl font-bold text-primary mb-2">Let's get started</h2>
                        <div className="mb-4">
                            <div className="text-base font-medium mb-2 text-foreground">What services are you interested in?</div>
                            <div className="flex flex-wrap gap-2">
                                {servicesList.map((service) => (
                                    <button
                                        type="button"
                                        key={service}
                                        onClick={() => handleServiceToggle(service)}
                                        className={`px-4 cursor-pointer py-2 rounded-full border-2 text-sm font-semibold transition-colors duration-200 focus:outline-none ${form.services.includes(service)
                                            ? 'bg-primary text-white border-primary shadow'
                                            : 'bg-background-light text-primary border-primary'}
                                                `}
                                    >
                                        {service}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your name*"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                                />
                            </div>
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile*"
                                value={form.mobile}
                                onChange={handleFormChange}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Tell about your project*"
                                value={form.description}
                                onChange={handleFormChange}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light min-h-24"
                                required
                            />
                            {formError && <div className="text-red-600 text-sm font-medium mt-1">{formError}</div>}
                            {formSuccess && <div className="text-green-600 text-sm font-medium mt-1">{formSuccess}</div>}
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="self-end px-8 py-3 mt-2 rounded-full bg-primary text-white cursor-pointer font-semibold shadow hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {formLoading ? 'Submitting...' : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}