import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Locations from '../components/Locations';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import QuoteFormLightbox from '../components/QuoteFormLightbox';

export default function PublicSite() {
  return (
    <div className="font-sans antialiased">
      <Header />
      <Hero />
      <About />
      <Services />
      <Locations />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <MobileCTA />
      <QuoteFormLightbox />
    </div>
  );
}

