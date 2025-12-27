import Hero from '@/components/Hero';
import About from '@/components/About';
import NumbersSection from '@/components/NumbersSection';
import Services from '@/components/Services';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <NumbersSection />
      <Services />
    </div>
  );
}
