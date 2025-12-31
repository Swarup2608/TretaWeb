import React from 'react';

export default function ClientLayoutSkeleton() {
    return (
        <div className="min-h-screen flex flex-col animate-pulse">
            <div className="h-16 bg-gray-200 w-full" />
            <div className="flex-1 bg-gray-100" />
            <div className="h-12 bg-gray-200 w-full" />
        </div>
    );
}
