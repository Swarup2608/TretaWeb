"use client";

import { useState, useEffect } from 'react';
import CTA from './CTA';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';


interface ContactInfo {
    email: string;
    phone: string;
    map: string;
    address?: string;
    mailTo: string;
}

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        time: '',
        message: ''
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetch('/SiteContent/contact.json')
            .then((res) => res.json())
            .then((data) => setContactInfo(data))
            .catch((error) => console.error('Error loading contact info:', error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (!form.email.trim() && !form.phone.trim()) return 'Email or Phone is required.';
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address.';
        if (form.phone && !/^\d{8,15}$/.test(form.phone.replace(/\D/g, ''))) return 'Invalid phone number.';
        if (!form.message.trim()) return 'Message is required.';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            await fetch('/api/send-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, to: contactInfo?.mailTo }),
            });
            setFormSuccess('Message sent successfully!');
            setForm({ name: '', email: '', phone: '', company: '', subject: '', time: '', message: '' });
        } catch (error) {
            setFormError('Failed to send message.');
        }
        setFormLoading(false);
    };


    if (!contactInfo) return null;

    return (
        <>
            {/* Banner Section - similar to AboutPage */}
            <section
                className="relative h-80 sm:h-96 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `url(/images/about/banner.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <p className="text-primary text-sm sm:text-base mb-4 font-medium">[Contact]</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                        Drop Us a <span className="italic font-serif">Message</span>
                    </h1>
                </div>
            </section>

            {/* Contact Details & Form */}
            <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">


                {/* Right: Contact Form */}
                <form onSubmit={handleSubmit} className="bg-background-light rounded-2xl  p-8 flex flex-col gap-5 w-full max-w-lg mx-auto shadow-2xl">
                    <div>
                        <label className="block text-background-light font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-background-light font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            />
                        </div>
                        <div>
                            <label className="block text-background-light font-medium mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-background-light font-medium mb-1">Company</label>
                            <input
                                type="text"
                                name="company"
                                placeholder="Enter company name"
                                value={form.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            />
                        </div>
                        <div>
                            <label className="block text-background-light font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Enter subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-background-light font-medium mb-1">Time Availability</label>
                        <input
                            type="text"
                            name="time"
                            placeholder="e.g. Weekdays 10am-5pm"
                            value={form.time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light"
                        />
                    </div>
                    <div>
                        <label className="block text-background-light font-medium mb-1">Write Your Message</label>
                        <textarea
                            name="message"
                            placeholder="I want to collaborate"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-background-light bg-background-light min-h-24"
                            required
                        />
                    </div>
                    {formError && <div className="text-red-600 text-sm font-medium mt-1">{formError}</div>}
                    {formSuccess && <div className="text-green-600 text-sm font-medium mt-1">{formSuccess}</div>}
                    <button
                        type="submit"
                        disabled={formLoading}
                        className="flex items-center justify-between cursor-pointer gap-2 px-8 py-3 mt-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full text-base group"
                    >
                        Send Message
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight className="w-5 h-5" />
                        </span>
                    </button>
                </form>

                {/* Left: Contact Info */}
                <div className="space-y-8">
                    <p className="text-lg text-background-light mb-6">We're always happy to hear from you and will get back to you as soon as possible.</p>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <Mail className="w-5 h-5" />
                        </span>
                        <div>
                            <div className="text-sm text-background-light">Email</div>
                            <a href={`mailto:${contactInfo.email}`} className="font-semibold text-lg text-background-light hover:text-primary transition-colors">{contactInfo.email}</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <Phone className="w-5 h-5" />
                        </span>
                        <div>
                            <div className="text-sm text-background-light">Call</div>
                            <a href={`tel:${contactInfo.phone}`} className="font-semibold text-lg text-background-light hover:text-primary transition-colors">{contactInfo.phone}</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <MapPin className="w-5 h-5" />
                        </span>
                        <div>
                            <div className="text-sm text-background-light">Visit Us</div>
                            <a href={contactInfo.map} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-background-light hover:text-primary transition-colors">See on Google Map</a>
                        </div>
                    </div>
                    {contactInfo.address && (
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                                <MapPin className="w-5 h-5" />
                            </span>
                            <div>
                                <div className="text-sm text-background-light">Address</div>
                                <div className="font-semibold text-lg text-background-light">{contactInfo.address}</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Component */}
            <div className="mt-16">
                <CTA />
            </div>
        </>
    );
}
