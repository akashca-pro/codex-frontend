import Hero from "@/features/landing/components/hero";
import Features from "@/features/landing/components/features";
import CTA from "@/features/landing/components/cta";

const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
};

export default LandingPage;
