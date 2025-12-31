import React from 'react';

export default function CaseStudiesPageSkeleton() {
    return (
        <div className="py-16 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="h-10 w-2/3 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 bg-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
