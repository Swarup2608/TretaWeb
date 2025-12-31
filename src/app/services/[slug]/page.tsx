import { notFound } from 'next/navigation';
import ServiceDetail from '@/components/ServiceDetail';
import servicesData from '../../../../public/SiteContent/services.json';

interface ServicePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return servicesData.services.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;
    const service = servicesData.services.find(
        (s) => s.slug === slug
    );

    if (!service) {
        notFound();
    }

    return <ServiceDetail service={service} />;
}
