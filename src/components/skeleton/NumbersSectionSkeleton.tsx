import React from 'react';

export default function NumbersSectionSkeleton() {
    return (
        <section className="py-16 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 h-10 w-2/3 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}
