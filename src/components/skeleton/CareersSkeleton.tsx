import React from 'react';

export default function CareersSkeleton() {
    return (
        <section className="py-16 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 h-10 w-2/3 bg-gray-200 rounded" />
                <div className="space-y-6">
                    <div className="h-16 bg-gray-200 rounded" />
                    <div className="h-16 bg-gray-200 rounded" />
                    <div className="h-16 bg-gray-200 rounded" />
                </div>
            </div>
        </section>
    );
}
