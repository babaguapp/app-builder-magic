import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedExperts from "@/components/home/FeaturedExperts";
import LatestPosts from "@/components/home/LatestPosts";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedExperts />
      <LatestPosts />
      <HowItWorks />
      <CTASection />
    </Layout>
  );
};

export default Index;
