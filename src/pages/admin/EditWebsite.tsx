import { useState } from 'react';
import TextSectionEditor from './editors/TextSectionEditor';
import ListSectionEditor from './editors/ListSectionEditor';
import GalleryEditor from './editors/GalleryEditor';

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'locations', label: 'Locations' },
  { key: 'why_choose_us', label: 'Why Choose Us' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'contact', label: 'Contact' },
];

export default function EditWebsite() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

  return (
    <div>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6">
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeSection === section.key
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeSection === 'hero' && <HeroSection />}
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'services' && <ServicesSection />}
        {activeSection === 'locations' && <LocationsSection />}
        {activeSection === 'why_choose_us' && <WhyChooseUsSection />}
        {activeSection === 'gallery' && <GalleryEditor />}
        {activeSection === 'testimonials' && <TestimonialsSection />}
        {activeSection === 'contact' && <ContactSection />}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <TextSectionEditor
      sectionKey="hero"
      title="Hero Section"
      subtitle="Edit the main banner area of your website."
      defaults={{
        heading_line1: "San Diego's Premier",
        heading_line3: 'Professionals',
        subheading: 'From solar panels to rooftops, we deliver spotless results with eco-friendly methods. Trusted by over 1,000 San Diego homeowners and businesses.',
        phone: '(858) 568-4950',
        rotating_services: 'Exterior Cleaning, Solar Panel Cleaning, Window Cleaning, Power Washing, Roof Washing, Gutter Cleaning',
        google_review_text: '5.0 on Google Reviews',
        trust_badge_1: '20+ Years Experience',
        trust_badge_2: 'Licensed & Insured',
        trust_badge_3: 'Eco-Friendly',
      }}
      fields={[
        { key: 'heading_line1', label: 'Heading Line 1', type: 'text', placeholder: "e.g. San Diego's Premier" },
        { key: 'rotating_services', label: 'Rotating Service Names (comma-separated)', type: 'text', placeholder: 'Exterior Cleaning, Solar Panel Cleaning, ...', helpText: 'These cycle through in the hero animation.' },
        { key: 'heading_line3', label: 'Heading Line 3', type: 'text', placeholder: 'e.g. Professionals' },
        { key: 'subheading', label: 'Subheading', type: 'textarea', placeholder: 'Brief description below the heading' },
        { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '(858) 568-4950' },
        { key: 'google_review_text', label: 'Google Review Badge Text', type: 'text', placeholder: '5.0 on Google Reviews' },
        { key: 'trust_badge_1', label: 'Trust Badge 1', type: 'text', placeholder: '20+ Years Experience' },
        { key: 'trust_badge_2', label: 'Trust Badge 2', type: 'text', placeholder: 'Licensed & Insured' },
        { key: 'trust_badge_3', label: 'Trust Badge 3', type: 'text', placeholder: 'Eco-Friendly' },
      ]}
    />
  );
}

function AboutSection() {
  return (
    <TextSectionEditor
      sectionKey="about"
      title="About Section"
      subtitle="Edit the about area of your website."
      defaults={{
        label: 'About Clean Clear SD',
        title_line1: 'Built on Trust.',
        title_colored: 'Backed by Results.',
        description_1: "What makes a cleaning company unique? At Clean Clear SD, we believe it's trust. With over 20 years of expertise, we take every measure to ensure that you and your home are served in a manner that is safe, secure, and of the highest quality.",
        description_2: 'We combine commercial-grade equipment with eco-friendly solutions to deliver results that speak for themselves.',
        image_url: 'https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=800',
        years_badge: '20+',
        years_badge_label: 'Years of Excellence',
        promises: 'Eco-friendly, biodegradable cleaning solutions\nCommercial-grade equipment on every job\nFully licensed, bonded & insured (License #B2025006275)\nSafe, secure, and highest quality service\nTransparent pricing — no hidden fees',
        stat_1_value: 'Fully Covered',
        stat_1_label: 'Licensed & Insured',
        stat_2_value: '20+',
        stat_2_label: 'Years of Expertise',
        stat_3_value: 'Same Day',
        stat_3_label: 'Response Time',
        stat_4_value: '1,000+',
        stat_4_label: 'Customers Served',
      }}
      fields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'ABOUT CLEAN CLEAR SD' },
        { key: 'title_line1', label: 'Title Line 1', type: 'text', placeholder: 'Built on Trust.' },
        { key: 'title_colored', label: 'Title (Colored)', type: 'text', placeholder: 'Backed by Results.' },
        { key: 'description_1', label: 'Description Paragraph 1', type: 'textarea' },
        { key: 'description_2', label: 'Description Paragraph 2', type: 'textarea' },
        { key: 'image_url', label: 'Section Image URL', type: 'text', placeholder: 'https://...' },
        { key: 'promises', label: 'Promise Items (one per line)', type: 'textarea', helpText: 'Enter each promise on a new line.' },
        { key: 'years_badge', label: 'Years Badge Value', type: 'text', placeholder: '20+' },
        { key: 'years_badge_label', label: 'Years Badge Label', type: 'text', placeholder: 'Years of Excellence' },
        { key: 'stat_1_value', label: 'Stat 1 Value', type: 'text' },
        { key: 'stat_1_label', label: 'Stat 1 Label', type: 'text' },
        { key: 'stat_2_value', label: 'Stat 2 Value', type: 'text' },
        { key: 'stat_2_label', label: 'Stat 2 Label', type: 'text' },
        { key: 'stat_3_value', label: 'Stat 3 Value', type: 'text' },
        { key: 'stat_3_label', label: 'Stat 3 Label', type: 'text' },
        { key: 'stat_4_value', label: 'Stat 4 Value', type: 'text' },
        { key: 'stat_4_label', label: 'Stat 4 Label', type: 'text' },
      ]}
    />
  );
}

function ServicesSection() {
  return (
    <ListSectionEditor
      sectionKey="services"
      title="Services Section"
      subtitle="Manage the services displayed on your website."
      textFields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'OUR SERVICES' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Professional Exterior Cleaning Services' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
        { key: 'cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'Request a Custom Quote' },
      ]}
      arrayKey="services"
      itemLabel="Service"
      itemFields={[
        { key: 'title', label: 'Service Name', type: 'text', placeholder: 'e.g. Solar Panel Cleaning' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief service description' },
        { key: 'tag', label: 'Category Tag', type: 'text', placeholder: 'e.g. Energy, Residential, Exterior' },
        { key: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
      ]}
      defaults={{
        label: 'Our Services',
        title: 'Professional Exterior Cleaning Services',
        description: 'From solar panels and windows to roofs and entire buildings, our expert team ensures every property looks spotless and well-maintained.',
        cta_text: 'Request a Custom Quote',
        services: [
          { title: 'Solar Panel Cleaning', description: 'Keep your panels free of dust, pollen, and debris so they generate maximum power year-round.', tag: 'Energy', image: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=800' },
          { title: 'Window Cleaning', description: 'Crystal-clear windows inside and out, using professional-grade squeegees and eco-friendly solutions.', tag: 'Residential', image: 'https://images.pexels.com/photos/713297/pexels-photo-713297.jpeg?auto=compress&cs=tinysrgb&w=800' },
          { title: 'Power Washing', description: 'From driveways and patios to commercial surfaces, we use the right pressure and techniques to restore safely and effectively.', tag: 'Exterior', image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=800' },
          { title: 'Roof Washing', description: "Low-pressure soft washing to remove algae, moss, and stains while extending your roof's lifespan.", tag: 'Specialty', image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800' },
          { title: 'Fleet & Vehicle Washing', description: 'Professional cleaning for RVs, delivery trucks, and commercial fleets to keep your vehicles looking sharp.', tag: 'Commercial', image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800' },
          { title: 'House Exterior Washing', description: 'Keep your property looking fresh, clean, and welcoming year-round with our home exterior care services.', tag: 'Residential', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ],
      }}
    />
  );
}

function LocationsSection() {
  return (
    <TextSectionEditor
      sectionKey="locations"
      title="Locations Section"
      subtitle="Edit the service areas section text."
      defaults={{
        label: 'Service Areas',
        title_part1: 'Proudly Serving',
        title_colored: 'North San Diego County',
        description: 'Clean Clear SD proudly serves homeowners and businesses throughout North San Diego County. From coastal communities to inland neighborhoods, our team brings reliable, high-quality exterior cleaning right to your doorstep.',
      }}
      fields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'SERVICE AREAS' },
        { key: 'title_part1', label: 'Title Part 1', type: 'text', placeholder: 'Proudly Serving' },
        { key: 'title_colored', label: 'Title (Colored)', type: 'text', placeholder: 'North San Diego County' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}

function WhyChooseUsSection() {
  return (
    <ListSectionEditor
      sectionKey="why_choose_us"
      title="Why Choose Us Section"
      subtitle="Manage the benefits and differentiators shown on your website."
      textFields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'WHY CLEAN CLEAR SD' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'The Clear Difference' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
      ]}
      arrayKey="benefits"
      itemLabel="Benefit"
      itemFields={[
        { key: 'title', label: 'Benefit Title', type: 'text', placeholder: 'e.g. Fully Licensed & Insured' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Explain this benefit...' },
      ]}
      defaults={{
        label: 'Why Clean Clear SD',
        title: 'The Clear Difference',
        description: 'When you choose Clean Clear SD, you get more than a clean surface -- you get peace of mind. We clean it like we mean it.',
        benefits: [
          { title: 'Fully Licensed & Insured', description: 'Work with confidence knowing your property is protected by our comprehensive insurance coverage.' },
          { title: 'Eco-Friendly Solutions', description: 'We use biodegradable, EPA-approved cleaning agents that are safe for your family, pets, and landscaping.' },
          { title: 'Same-Day Service', description: 'Need it done fast? We offer same-day and next-day scheduling for most residential jobs.' },
          { title: 'Satisfaction Guaranteed', description: "If you're not 100% happy with the result, we'll re-clean the area at no additional cost." },
          { title: 'Trusted Technicians', description: 'Every crew member is background-checked, trained, and committed to treating your home with the utmost care.' },
          { title: 'Transparent Pricing', description: 'No hidden fees, no surprise charges. We quote upfront and stand behind our pricing.' },
        ],
      }}
    />
  );
}

function TestimonialsSection() {
  return (
    <ListSectionEditor
      sectionKey="testimonials"
      title="Testimonials Section"
      subtitle="Manage customer reviews displayed on your website."
      textFields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'CUSTOMER REVIEWS' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'What Our Customers Say' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
      ]}
      arrayKey="reviews"
      itemLabel="Review"
      itemFields={[
        { key: 'name', label: 'Customer Name', type: 'text', placeholder: 'e.g. Sarah M.' },
        { key: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Carlsbad' },
        { key: 'service', label: 'Service Used', type: 'text', placeholder: 'e.g. Solar Panel Cleaning' },
        { key: 'text', label: 'Review Text', type: 'textarea', placeholder: 'What did the customer say?' },
      ]}
      defaults={{
        label: 'Customer Reviews',
        title: 'What Our Customers Say',
        description: "Don't just take our word for it -- hear from the people who trust us with their properties across San Diego County.",
        reviews: [
          { name: 'Sarah M.', location: 'Carlsbad', rating: '5', text: 'Our solar panels were producing noticeably less power. After Clean Clear SD cleaned them, our energy output jumped right back up. The crew was on time, professional, and even cleaned up after themselves.', service: 'Solar Panel Cleaning' },
          { name: 'David R.', location: 'Encinitas', rating: '5', text: "I've used three different cleaning companies over the years, and Clean Clear SD is hands down the best. They took the time to explain their process and the results exceeded my expectations.", service: 'Window Cleaning' },
          { name: 'Maria L.', location: 'Oceanside', rating: '5', text: 'We hired them for our fleet of delivery trucks and the office building exterior. The difference was night and day. Our customers noticed immediately. We now have them come quarterly.', service: 'Fleet Washing' },
          { name: 'James K.', location: 'Del Mar', rating: '5', text: 'The power washing they did on our driveway and patio was incredible. Within a couple of hours, everything looked better than when we first moved in. Great price, great results.', service: 'Power Washing' },
          { name: 'Linda T.', location: 'Escondido', rating: '5', text: 'The roof wash they did saved us from having to replace shingles. The algae streaks are completely gone. They were careful with our landscaping and left everything spotless.', service: 'Roof Washing' },
          { name: 'Michael B.', location: 'Vista', rating: '5', text: 'Had our entire house exterior washed before listing it for sale. Multiple buyers commented on how well-maintained the property looked. Worth every penny.', service: 'House Exterior Washing' },
          { name: 'Patricia H.', location: 'San Marcos', rating: '5', text: 'They cleaned all 42 windows in our office building in under a day. Not a single streak. Our employees actually thanked us for finally getting it done right.', service: 'Window Cleaning' },
          { name: 'Robert C.', location: 'Carlsbad', rating: '5', text: 'Our HOA hired them for the community clubhouse and pool deck. The results were so impressive that several homeowners booked their own appointments the same week.', service: 'Power Washing' },
          { name: 'Jennifer W.', location: 'Solana Beach', rating: '5', text: 'I was skeptical about solar panel cleaning making a difference, but my energy bill dropped noticeably the very next month. These guys know what they are doing.', service: 'Solar Panel Cleaning' },
          { name: 'Thomas A.', location: 'Rancho Santa Fe', rating: '5', text: 'We have a large estate with extensive hardscape. They pressure washed everything -- driveway, walkways, retaining walls. It looks like brand new construction.', service: 'Power Washing' },
          { name: 'Angela D.', location: 'Poway', rating: '5', text: 'Booked them for a roof wash after noticing dark streaks. They used a soft wash technique that was gentle on the tiles but tough on the algae. Roof looks perfect now.', service: 'Roof Washing' },
          { name: 'Kevin S.', location: 'La Jolla', rating: '5', text: 'We run a restaurant with a large patio area. They power washed everything and cleaned all the windows. Our guests always comment on how clean and inviting it looks.', service: 'Commercial Cleaning' },
          { name: 'Diane F.', location: 'Oceanside', rating: '5', text: 'After the Santa Ana winds covered everything in dust, they came out the very next day. Quick response, fair pricing, and my house looks amazing. Already scheduled the next visit.', service: 'House Exterior Washing' },
          { name: 'Steven P.', location: 'Encinitas', rating: '5', text: 'Our food truck fleet needed serious cleaning. They handled all five trucks in a single morning and each one looked showroom ready. Our branding really pops now.', service: 'Fleet Washing' },
          { name: 'Nancy G.', location: 'Del Mar', rating: '5', text: 'Third year in a row using Clean Clear SD for our annual deep clean. Windows, gutters, driveway -- they handle everything. Consistently excellent work every single time.', service: 'Full Property Cleaning' },
        ],
      }}
    />
  );
}

function ContactSection() {
  return (
    <TextSectionEditor
      sectionKey="contact"
      title="Contact Section"
      subtitle="Edit your contact information displayed on the website."
      defaults={{
        label: 'Get in Touch',
        title: 'Contact Us',
        description: "Have a question or want to learn more? Drop us a message and we'll get back to you promptly.",
        phone: '(858) 568-4950',
        phone_href: 'tel:+18585684950',
        email: 'jason@cleanclearsd.com',
        service_area: 'North San Diego County, CA',
        hours: 'Mon-Sat: 7AM - 6PM',
        urgent_heading: 'Need It Done Today?',
        urgent_description: 'Call us now for same-day service availability.',
      }}
      fields={[
        { key: 'label', label: 'Section Label', type: 'text', placeholder: 'GET IN TOUCH' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Contact Us' },
        { key: 'description', label: 'Section Description', type: 'textarea' },
        { key: 'phone', label: 'Phone Number (Display)', type: 'text', placeholder: '(858) 568-4950' },
        { key: 'phone_href', label: 'Phone Number (Link)', type: 'text', placeholder: 'tel:+18585684950', helpText: 'The clickable phone link, e.g. tel:+18585684950' },
        { key: 'email', label: 'Email Address', type: 'text', placeholder: 'jason@cleanclearsd.com' },
        { key: 'service_area', label: 'Service Area', type: 'text', placeholder: 'North San Diego County, CA' },
        { key: 'hours', label: 'Business Hours', type: 'text', placeholder: 'Mon-Sat: 7AM - 6PM' },
        { key: 'urgent_heading', label: 'Urgent CTA Heading', type: 'text', placeholder: 'Need It Done Today?' },
        { key: 'urgent_description', label: 'Urgent CTA Description', type: 'text', placeholder: 'Call us now for same-day service availability.' },
      ]}
    />
  );
}
