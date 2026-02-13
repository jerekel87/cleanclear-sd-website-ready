import { useState } from 'react';
import SectionEditor from './SectionEditor';
import type { FieldDef } from './SectionEditor';

interface SectionConfig {
  key: string;
  label: string;
  title: string;
  fields: FieldDef[];
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'hero',
    label: 'Hero',
    title: 'Hero Section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'e.g. San Diego\'s Premier Window Cleaning' },
      { key: 'subheading', label: 'Subheading', type: 'textarea', placeholder: 'A brief description shown below the heading' },
      { key: 'cta_text', label: 'Call-to-Action Button Text', type: 'text', placeholder: 'e.g. Get a Free Quote' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    title: 'About Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. ABOUT US' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. Dedicated to a Spotless Finish' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Main description text for the About section' },
      { key: 'years_experience', label: 'Years of Experience', type: 'text', placeholder: 'e.g. 10+' },
      { key: 'projects_completed', label: 'Projects Completed', type: 'text', placeholder: 'e.g. 2,500+' },
      { key: 'satisfaction_rate', label: 'Satisfaction Rate', type: 'text', placeholder: 'e.g. 99%' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    title: 'Services Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. OUR SERVICES' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. Professional Cleaning Services' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of your service offerings' },
    ],
  },
  {
    key: 'locations',
    label: 'Locations',
    title: 'Locations Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. SERVICE AREAS' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. Serving All of San Diego County' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of your service coverage area' },
    ],
  },
  {
    key: 'why_choose_us',
    label: 'Why Choose Us',
    title: 'Why Choose Us Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. WHY CHOOSE US' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. The Clean & Clear Difference' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Explain what sets your business apart' },
    ],
  },
  {
    key: 'gallery',
    label: 'Gallery',
    title: 'Gallery Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. OUR WORK' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. See the Difference' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of your gallery' },
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    title: 'Testimonials Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. TESTIMONIALS' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. What Our Clients Say' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief intro for the testimonials section' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    title: 'Contact Section',
    fields: [
      { key: 'label', label: 'Section Label', type: 'text', placeholder: 'e.g. CONTACT US' },
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'e.g. Get in Touch' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Intro text for the contact section' },
      { key: 'phone', label: 'Phone Number', type: 'text', placeholder: 'e.g. (619) 555-0100' },
      { key: 'email', label: 'Email Address', type: 'text', placeholder: 'e.g. info@cleanclearsd.com' },
      { key: 'address', label: 'Business Address', type: 'text', placeholder: 'e.g. San Diego, CA' },
    ],
  },
];

export default function EditWebsite() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);
  const currentSection = SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];

  return (
    <div>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6">
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
      </div>

      <SectionEditor
        key={currentSection.key}
        sectionKey={currentSection.key}
        sectionTitle={currentSection.title}
        fields={currentSection.fields}
      />
    </div>
  );
}
