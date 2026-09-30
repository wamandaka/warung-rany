import { getProducts } from "@/services/products";
import { getActiveCategories } from "@/services/categories";
import { getActivePromos } from "@/services/promos";
import { getActiveTestimonials } from "@/services/testimonials";
import { HeroSection } from "@/components/landing/HeroSection";
import { TodayMenuSection } from "@/components/landing/TodayMenuSection";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { AboutSection } from "@/components/landing/AboutSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { OpeningHoursSection } from "@/components/landing/OpeningHoursSection";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [products, categories, promos, testimonials] = await Promise.all([
    getProducts(),
    getActiveCategories(),
    getActivePromos(),
    getActiveTestimonials(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TodayMenuSection products={products} categories={categories} />
      <PromoBanner promos={promos} />
      <AboutSection />
      <TestimonialsSection testimonials={testimonials} />
      <OpeningHoursSection />
    </div>
  );
}
