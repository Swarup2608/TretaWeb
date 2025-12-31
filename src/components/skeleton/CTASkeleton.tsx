import React from 'react';

export default function CTASkeleton() {
    return (
        <div className="py-12 px-4 animate-pulse">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="h-8 w-1/2 bg-gray-200 rounded" />
                <div className="h-6 w-1/3 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
