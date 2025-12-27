'use client';

import { useState } from 'react';

export default function BusinessCard() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle email submission
        console.log('Email submitted:', email);
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
                />
                <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-45 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    aria-label="Submit email"
                >
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
                </button>
            </form>
        </div>
    );
}
