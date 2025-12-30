'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BusinessCard() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                    fontWeight: '600',
                },
                icon: '❌',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send-contact-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Thank you! We\'ll get in touch with you soon.', {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '10px',
                        fontWeight: '600',
                    },
                    icon: '✅',
                });
                setEmail(''); // Clear the input
            } else {
                toast.error(data.message || 'Something went wrong. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '10px',
                        fontWeight: '600',
                    },
                    icon: '❌',
                });
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            toast.error('Failed to send your request. Please try again later.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                    fontWeight: '600',
                },
                icon: '❌',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card-bg rounded-2xl p-5 sm:p-6 shadow-2xl w-full max-w-sm border transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 hover:scale-[1.02] group">
            <h2 className="text-lg sm:text-xl font-bold mb-2 card-text transition-colors duration-300 group-hover:text-blue-600">
                Let's Move Your Business Forward
            </h2>
            <p className="text-sm card-text-muted mb-4 transition-all duration-300 group-hover:text-opacity-90">
                Success doesn't happen by chance—it's built through smart strategy, informed decisions
            </p>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 text-sm rounded-full border input-bg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 hover:border-blue-400 focus:scale-[1.02] hover:shadow-md placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-50"
                    required
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-45 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
                    aria-label="Submit email"
                >
                    {isSubmitting ? (
                        <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4 transition-transform duration-300"
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
                    )}
                </button>
            </form>
        </div>
    );
}
