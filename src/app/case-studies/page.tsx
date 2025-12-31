'use client';

import CaseStudiesPage from '@/components/CaseStudiesPage';
import data from '../../../public/SiteContent/caseStudies.json';

export default function CaseStudies() {
    return <CaseStudiesPage data={data} />;
}
