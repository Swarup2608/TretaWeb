import React from 'react';

export default function HeroSkeleton() {
    return (
        <section className="py-24 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="h-12 w-2/3 bg-gray-200 rounded mb-8" />
                <div className="h-8 w-1/2 bg-gray-200 rounded mb-6" />
                <div className="h-64 w-full bg-gray-200 rounded-3xl" />
            </div>
        </section>
    );
}
