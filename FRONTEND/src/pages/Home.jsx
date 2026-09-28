import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features/Features";
import TrustedCompanies from "../components/TrustedCompanies";
import HowItWorks from "../components/HowItWorks";
import DashboardPreview from "../components/DashboardPreview/DashboardPreview";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials/Testimonials";
import FAQ from "../components/FAQ/FAQ";
import CTA from "../components/CTA/CTA";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BackToTop/BackToTop";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <BackToTop />
    </>
  );
}

export default Home;