import React from 'react';
import { HeroCarousel } from '../components/storefront/HeroCarousel';
import { TrustMarquee } from '../components/storefront/TrustMarquee';
import { ShopByAge } from '../components/storefront/ShopByAge';
import { ShopByCategory } from '../components/storefront/ShopByCategory';
import { Bestsellers } from '../components/storefront/Bestsellers';
import { WhyTrustUs } from '../components/storefront/WhyTrustUs';
import { ToyFinderQuiz } from '../components/storefront/ToyFinderQuiz';
import { Testimonials } from '../components/storefront/Testimonials';
import { PressStrip } from '../components/storefront/PressStrip';
import { FaqSection } from '../components/storefront/FaqSection';

interface HomePageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <HeroCarousel onNavigate={onNavigate} />
      <TrustMarquee />
      <ShopByAge onNavigate={onNavigate} />
      <ShopByCategory onNavigate={onNavigate} />
      <Bestsellers onNavigate={onNavigate} />
      <WhyTrustUs />
      <ToyFinderQuiz onNavigate={onNavigate} />
      <Testimonials />
      <PressStrip />
      <FaqSection />
    </div>
  );
};
