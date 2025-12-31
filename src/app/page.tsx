'use client';

import { useEffect } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import NumbersSection from '@/components/NumbersSection';
import Services from '@/components/Services';
import Values from '@/components/Values';
import CaseStudies from '@/components/CaseStudies';
import Careers from '@/components/Careers';
import CTA from '@/components/CTA';
import { trackPageVisit } from '@/utils/analytics';

export default function Home() {
  useEffect(() => {
    trackPageVisit('/');
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <NumbersSection />
      <Services />
      <Values />
      <CaseStudies />
      <Careers />
      <CTA />
    </div>
  );
}
