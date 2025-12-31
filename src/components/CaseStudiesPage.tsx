'use client';

import { useMemo, useState } from 'react';
import CTA from './CTA';
import CaseStudiesSkeleton from './CaseStudiesSkeleton';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface CaseStudy {
    id: number;
    slug: string;
    title: string;
    description: string;
    image: string;
    labels: string;
    uploadDate: string;
}

interface CaseStudiesPageData {
    banner: {
        backgroundImage: string;
        eyebrow: string;
        heading: string;
        headingItalic: string;
    };
    caseStudies: CaseStudy[];
}

export default function CaseStudiesPage({
    data,
}: {
    data: CaseStudiesPageData;
}) {
    const [selectedLabel, setSelectedLabel] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    const allLabels = useMemo(() => {
        const labels = new Set<string>();
        data.caseStudies.forEach((study) =>
            study.labels?.split(',').forEach((l) => labels.add(l.trim()))
        );
        return Array.from(labels).sort();
    }, [data.caseStudies]);

    const filteredStudies = useMemo(() => {
        let filtered = [...data.caseStudies];

        if (selectedLabel !== 'all') {
            filtered = filtered.filter((study) =>
                study.labels
                    ?.split(',')
                    .map((l) => l.trim())
                    .includes(selectedLabel)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (study) =>
                    study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    study.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'date-asc':
                    return +new Date(a.uploadDate) - +new Date(b.uploadDate);
                case 'date-desc':
                    return +new Date(b.uploadDate) - +new Date(a.uploadDate);
                default:
                    return 0;
            }
        });
    }, [data.caseStudies, selectedLabel, searchQuery, sortBy]);

    if (!data) return <CaseStudiesSkeleton />;

    return (
        <>
            {/* Banner */}
            <section
                className="relative h-100 flex items-center justify-center"
                style={{
                    backgroundImage: `url(${data.banner.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white">
                    <p className="text-primary mb-4">{data.banner.eyebrow}</p>
                    <h1 className="text-5xl font-bold">
                        {data.banner.heading}{' '}
                        <span className="italic font-serif">
                            {data.banner.headingItalic}
                        </span>
                    </h1>
                </div>
            </section>


            {/* Filters Section */}
            <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Search</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search case studies..."
                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Label Filter */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Filter by Label</label>
                            <select
                                value={selectedLabel}
                                onChange={(e) => setSelectedLabel(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                <option value="all">All Labels</option>
                                {allLabels.map((label) => (
                                    <option key={label} value={label}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-muted bg-background text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                <option value="date-desc">Latest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="name-asc">A → Z</option>
                                <option value="name-desc">Z → A</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-6 text-sm text-muted-light">
                        Showing {filteredStudies.length} of {data.caseStudies?.length || 0} case studies
                    </div>
                </div>
            </section>

            {/* Case Studies Grid */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {filteredStudies.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-muted-light">No case studies found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {filteredStudies.map((study, index) => (
                                <div
                                    key={study.id}
                                    className="case-study-card-animate"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative rounded-3xl overflow-hidden h-100 sm:h-112.5 lg:h-125 case-study-card-bg shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 has-[a:hover]:translate-y-0">
                                        {/* Image Container */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${study.image || '/images/hero/hero-img.png'})` }}
                                            ></div>
                                            {/* Overlay */}
                                            <div className="case-study-overlay"></div>
                                        </div>

                                        {/* Content Box - Positioned absolutely on top */}
                                        <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8 rounded-3xl m-5 case-study-content-bg backdrop-blur-md transition-all duration-400 ease-out flex flex-col justify-start z-2 sm:h-auto sm:min-h-22.5 group-hover:sm:min-h-75">
                                            {/* Labels - Subtle display */}
                                            {study.labels && (
                                                <div className="flex flex-wrap gap-2 mb-3 shrink-0">
                                                    {study.labels.split(',').slice(0, 5).map((label: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-1 text-xs font-medium bg-primary text-white backdrop-blur-sm rounded-full"
                                                        >
                                                            {label.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Title - Always visible */}
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-0 sm:mb-3 shrink-0 case-study-title-color">
                                                {study.title || 'Untitled Case Study'}
                                            </h3>

                                            {/* Description - Always visible on mobile, visible on hover for desktop */}
                                            <p className="case-study-description-text leading-relaxed text-[0.9375rem] sm:text-base mt-4 mb-5 sm:opacity-0 sm:max-h-0 sm:m-0 sm:overflow-hidden sm:translate-y-5 group-hover:sm:opacity-100 group-hover:sm:max-h-50 group-hover:sm:mt-4 group-hover:sm:mb-6 group-hover:sm:translate-y-0 transition-all duration-400 ease-out shrink-0">
                                                {study.description || ''}
                                            </p>

                                            {/* Button - Always visible on mobile, visible on hover for desktop */}
                                            <Link
                                                href={study.slug ? `/case-study/${study.slug}` : '/'}
                                                className="inline-flex items-center gap-3 rounded-full w-fit shrink-0 sm:hidden sm:max-h-0 sm:overflow-hidden sm:translate-y-5 group-hover:sm:flex group-hover:sm:max-h-25 group-hover:sm:translate-y-0 transition-all duration-400 ease-out case-study-btn-wrapper group/button px-6 py-3.5 font-semibold text-base text-white"
                                            >
                                                View Case Study
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/button:rotate-45 bg-white text-primary">
                                                    <ArrowUpRight className="w-4 h-4 faq-cta-icon" />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <CTA />
            </section>

        </>
    );
}

// 'use client';

// export default function CaseStudiesPage() {
//     return <div>CASE STUDIES TEST</div>;
// }
