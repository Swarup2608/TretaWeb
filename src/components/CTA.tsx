'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, X } from 'lucide-react';
import Link from 'next/link';

interface Schedule {
    days: string;
    time: string;
}

interface CTAData {
    heading: {
        line1: string;
        line2: string;
        line2Italic: string;
    };
    image: string;
    box: {
        title: string;
        description: string;
        schedule: Schedule[];
        cta: {
            label: string;
            link: string;
        };
    };
}

export default function CTA() {

    const [ctaData, setCtaData] = useState<CTAData | null>(null);
    const [showBookModal, setShowBookModal] = useState(false);
    interface BookForm {
        name: string;
        email: string;
        mobile: string;
        subject: string;
        description: string;
        services: string[];
        time: string;
    }
    const [form, setForm] = useState<BookForm>({ name: '', email: '', mobile: '', subject: '', description: '', services: [], time: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [servicesList, setServicesList] = useState<string[]>([]);

    useEffect(() => {
        fetch('/SiteContent/cta.json')
            .then((res) => res.json())
            .then((data) => setCtaData(data))
            .catch((error) => console.error('Error loading CTA data:', error));

        fetch('/SiteContent/services.json')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.services)) {
                    setServicesList(data.services.map((s: { title: string }) => s.title));
                }
            })
            .catch((error) => console.error('Error loading services:', error));
    }, []);

    if (!ctaData) return null;

    // Fallback values
    const heading1 = ctaData.heading?.line1 || '';
    const heading2 = ctaData.heading?.line2 || '';
    const heading2Italic = ctaData.heading?.line2Italic || '';
    const image = ctaData.image || '/images/hero/hero-img.png';
    const title = ctaData.box?.title || '';
    const description = ctaData.box?.description || '';
    const schedule = ctaData.box?.schedule || [];
    const ctaLabel = ctaData.box?.cta?.label || 'Contact Us';
    const ctaLink = ctaData.box?.cta?.link || '/';

    // Skip if no essential content
    if (!heading1 && !title) {
        return null;
    }

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
        if (!form.time.trim()) return 'Time availability is required.';
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
                setFormSuccess('Your paid appointment request has been submitted!');
                setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [], time: '' });
            } else {
                setFormError(data.message || 'Failed to submit.');
            }
        } catch (err) {
            setFormError('Failed to submit.');
        }
        setFormLoading(false);
    };

    return (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                {(heading1 || heading2) && (
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 cta-heading-animate">
                        {heading1} {heading2}{' '}
                        {heading2Italic && <span className="italic font-serif">{heading2Italic}</span>}
                    </h2>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* Left - Image */}
                    <div className="cta-image-animate">
                        <div className="relative rounded-3xl overflow-hidden h-75 sm:h-100 lg:h-full min-h-125">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${image})` }}
                            ></div>
                        </div>
                    </div>

                    {/* Right - Blue Box */}
                    <div className="cta-box-animate">
                        <div className="cta-box-bg rounded-3xl p-8 sm:p-10 lg:p-12 h-full flex flex-col justify-between">
                            {/* Pin Icon */}
                            <div className="mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 cta-icon-bg rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 cta-icon-color" />
                                </div>
                            </div>

                            {/* Title */}
                            {title && (
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 cta-title-color">
                                    {title}
                                </h3>
                            )}

                            {/* Description */}
                            {description && (
                                <p className="text-base sm:text-lg mb-6 sm:mb-8 cta-description-color leading-relaxed">
                                    {description}
                                </p>
                            )}

                            {/* Schedule */}
                            {schedule.length > 0 && (
                                <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                                    {schedule.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center pb-4 sm:pb-5 cta-schedule-border"
                                        >
                                            <span className="text-base sm:text-lg font-medium cta-schedule-text">
                                                {item.days}
                                            </span>
                                            <span className="text-base sm:text-lg font-semibold cta-schedule-time">
                                                {item.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                type="button"
                                className="inline-flex items-center cursor-pointer gap-0 rounded-full w-fit transition-all duration-300 hover:scale-105 hover:shadow-2xl group/button cta-btn-wrapper"
                                onClick={() => { setShowBookModal(true); setFormError(''); setFormSuccess(''); }}
                            >
                                <span className="px-7 py-3.5 sm:px-8 sm:py-4 font-semibold text-base sm:text-lg cta-btn-text">
                                    {ctaLabel}
                                </span>
                                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-2 group-hover/button:rotate-45 transition-transform duration-300 cta-btn-icon-bg">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 cta-btn-icon-color" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Paid Appointment Modal */}
            {showBookModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
                    <div className="absolute inset-0 w-full h-full" onClick={() => { setShowBookModal(false); setFormError(''); setFormSuccess(''); setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [], time: '' }); }} />
                    <div className="relative w-full max-w-2xl mx-auto bg-background rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col gap-4 border border-primary overflow-y-auto max-h-[95vh] min-h-[60vh]">
                        <button
                            className="absolute top-9 right-4 text-foreground cursor-pointer hover:text-primary font-bold text-2xl transition-colors z-10"
                            onClick={() => { setShowBookModal(false); setFormError(''); setFormSuccess(''); setForm({ name: '', email: '', mobile: '', subject: '', description: '', services: [], time: '' }); }}
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-3xl font-bold text-primary mb-2">Book a Paid Appointment</h2>
                        <div className="mb-2 text-sm text-gray-700 bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded">
                            <strong>Disclaimer:</strong> This is a paid appointment booking. You will be contacted with payment details after submitting your request.
                        </div>
                        <div className="mb-4">
                            <div className="text-base font-medium mb-2 text-foreground">Select services for your appointment:</div>
                            <div className="flex flex-wrap gap-2">
                                {servicesList.map((service) => (
                                    <button
                                        type="button"
                                        key={service}
                                        onClick={() => handleServiceToggle(service)}
                                        className={`px-4 cursor-pointer py-2 rounded-full border-2 text-sm font-semibold transition-colors duration-200 focus:outline-none ${form.services.includes(service)
                                            ? 'bg-primary text-white border-primary shadow'
                                            : 'bg-background-light text-primary border-primary'}`}
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
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject (optional)"
                                value={form.subject}
                                onChange={handleFormChange}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            />
                            <input
                                type="text"
                                name="time"
                                placeholder="Time availability* (e.g. Weekdays 10am-5pm)"
                                value={form.time}
                                onChange={handleFormChange}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Describe your needs*"
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
                                {formLoading ? 'Submitting...' : 'Book Appointment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
