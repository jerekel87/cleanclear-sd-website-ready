import BeforeAfterSlider from './BeforeAfterSlider';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

const GALLERY_DEFAULTS = {
  label: 'Our Work',
  title: 'Our Work Speaks for Itself',
  description:
    'Our gallery showcases real projects across San Diego County. Drag the slider to discover the level of care and precision we bring to every job.',
  projects: [
    {
      before:
        'https://images.pexels.com/photos/5691525/pexels-photo-5691525.jpeg?auto=compress&cs=tinysrgb&w=800',
      after:
        'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800',
      label: 'Power Washing',
      location: 'Carlsbad, CA',
    },
    {
      before:
        'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=800',
      after:
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      label: 'House Exterior Wash',
      location: 'Encinitas, CA',
    },
    {
      before:
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      after:
        'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      label: 'Roof Washing',
      location: 'Del Mar, CA',
    },
    {
      before:
        'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800',
      after:
        'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      label: 'Window Cleaning',
      location: 'Oceanside, CA',
    },
  ],
};

export default function Gallery() {
  const { content } = useWebsiteContent('gallery', GALLERY_DEFAULTS);
  const projects = (content.projects as any[]) || [];

  return (
    <section id="gallery" className="py-16 sm:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-sky-600 font-bold text-xs tracking-widest uppercase">
            {content.label}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-900 !leading-[1.3]">
            {content.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-[15px] sm:text-lg leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <BeforeAfterSlider key={project.label} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
