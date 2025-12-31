import { notFound } from 'next/navigation';
import CaseStudyDetail from '@/components/CaseStudyDetail';
import caseStudiesData from '../../../../public/SiteContent/caseStudies.json';

interface CaseStudyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return caseStudiesData.caseStudies.map((study) => ({
        slug: study.slug,
    }));
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
    const { slug } = await params;
    const caseStudy = caseStudiesData.caseStudies.find(
        (s) => s.slug === slug
    );

    if (!caseStudy) {
        notFound();
    }

    return <CaseStudyDetail caseStudy={caseStudy} />;
}
