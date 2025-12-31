import React from 'react';

export default function AboutPageSkeleton() {
    return (
        <div className="py-16 px-4 animate-pulse">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="h-10 w-2/3 bg-gray-200 rounded" />
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="h-40 bg-gray-200 rounded" />
                <div className="h-10 w-1/3 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
