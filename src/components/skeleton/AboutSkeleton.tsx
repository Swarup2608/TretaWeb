import React from 'react';

export default function AboutSkeleton() {
    return (
        <section className="py-16 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 h-10 w-2/3 bg-gray-200 rounded" />
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-16 w-1/2 bg-gray-200 rounded" />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="aspect-3/4 bg-gray-200 rounded-3xl w-full" />
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-12 w-1/2 bg-gray-200 rounded self-end" />
                    </div>
                </div>
            </div>
        </section>
    );
}
