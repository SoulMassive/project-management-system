import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import RoleShowcase from '../components/home/RoleShowcase';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import CTABanner from '../components/home/CTABanner';
import Footer from '../components/home/Footer';

const HomePage = () => {
  return (
    <div className="bg-white selection:bg-primary/20 selection:text-primary">
      <Navbar />
      
      <main>
        <Hero />
        
        <StatsBar />
        
        <Features />
        
        <HowItWorks />
        
        <RoleShowcase />
        
        <Testimonials />
        
        <Pricing />
        
        <CTABanner />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
