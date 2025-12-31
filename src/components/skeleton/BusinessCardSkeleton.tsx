import React from 'react';

export default function BusinessCardSkeleton() {
    return (
        <div className="p-6 rounded-lg shadow-lg bg-white animate-pulse">
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-4" />
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded mb-4" />
            <div className="h-8 w-1/4 bg-gray-200 rounded" />
        </div>
    );
}
