import { useEffect, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah M.',
    location: 'Carlsbad',
    rating: 5,
    text: 'Our solar panels were producing noticeably less power. After Clean Clear SD cleaned them, our energy output jumped right back up. The crew was on time, professional, and even cleaned up after themselves.',
    service: 'Solar Panel Cleaning',
  },
  {
    name: 'David R.',
    location: 'Encinitas',
    rating: 5,
    text: "I've used three different cleaning companies over the years, and Clean Clear SD is hands down the best. They took the time to explain their process and the results exceeded my expectations.",
    service: 'Window Cleaning',
  },
  {
    name: 'Maria L.',
    location: 'Oceanside',
    rating: 5,
    text: 'We hired them for our fleet of delivery trucks and the office building exterior. The difference was night and day. Our customers noticed immediately. We now have them come quarterly.',
    service: 'Fleet Washing',
  },
  {
    name: 'James K.',
    location: 'Del Mar',
    rating: 5,
    text: 'The power washing they did on our driveway and patio was incredible. Within a couple of hours, everything looked better than when we first moved in. Great price, great results.',
    service: 'Power Washing',
  },
  {
    name: 'Linda T.',
    location: 'Escondido',
    rating: 5,
    text: 'The roof wash they did saved us from having to replace shingles. The algae streaks are completely gone. They were careful with our landscaping and left everything spotless.',
    service: 'Roof Washing',
  },
  {
    name: 'Michael B.',
    location: 'Vista',
    rating: 5,
    text: 'Had our entire house exterior washed before listing it for sale. Multiple buyers commented on how well-maintained the property looked. Worth every penny.',
    service: 'House Exterior Washing',
  },
  {
    name: 'Patricia H.',
    location: 'San Marcos',
    rating: 5,
    text: 'They cleaned all 42 windows in our office building in under a day. Not a single streak. Our employees actually thanked us for finally getting it done right.',
    service: 'Window Cleaning',
  },
  {
    name: 'Robert C.',
    location: 'Carlsbad',
    rating: 5,
    text: 'Our HOA hired them for the community clubhouse and pool deck. The results were so impressive that several homeowners booked their own appointments the same week.',
    service: 'Power Washing',
  },
  {
    name: 'Jennifer W.',
    location: 'Solana Beach',
    rating: 5,
    text: 'I was skeptical about solar panel cleaning making a difference, but my energy bill dropped noticeably the very next month. These guys know what they are doing.',
    service: 'Solar Panel Cleaning',
  },
  {
    name: 'Thomas A.',
    location: 'Rancho Santa Fe',
    rating: 5,
    text: 'We have a large estate with extensive hardscape. They pressure washed everything -- driveway, walkways, retaining walls. It looks like brand new construction.',
    service: 'Power Washing',
  },
  {
    name: 'Angela D.',
    location: 'Poway',
    rating: 5,
    text: 'Booked them for a roof wash after noticing dark streaks. They used a soft wash technique that was gentle on the tiles but tough on the algae. Roof looks perfect now.',
    service: 'Roof Washing',
  },
  {
    name: 'Kevin S.',
    location: 'La Jolla',
    rating: 5,
    text: 'We run a restaurant with a large patio area. They power washed everything and cleaned all the windows. Our guests always comment on how clean and inviting it looks.',
    service: 'Commercial Cleaning',
  },
  {
    name: 'Diane F.',
    location: 'Oceanside',
    rating: 5,
    text: 'After the Santa Ana winds covered everything in dust, they came out the very next day. Quick response, fair pricing, and my house looks amazing. Already scheduled the next visit.',
    service: 'House Exterior Washing',
  },
  {
    name: 'Steven P.',
    location: 'Encinitas',
    rating: 5,
    text: 'Our food truck fleet needed serious cleaning. They handled all five trucks in a single morning and each one looked showroom ready. Our branding really pops now.',
    service: 'Fleet Washing',
  },
  {
    name: 'Nancy G.',
    location: 'Del Mar',
    rating: 5,
    text: 'Third year in a row using Clean Clear SD for our annual deep clean. Windows, gutters, driveway -- they handle everything. Consistently excellent work every single time.',
    service: 'Full Property Cleaning',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow duration-300">
      <StarRating count={review.rating} />
      <p className="mt-3 sm:mt-4 text-gray-700 text-sm leading-relaxed line-clamp-4">
        "{review.text}"
      </p>
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <div className="font-bold text-navy-900 text-sm">{review.name}</div>
          <div className="text-gray-500 text-xs mt-0.5">{review.location}</div>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-sky-600 bg-sky-50 px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap">
          {review.service}
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [featured, setFeatured] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const prev = () => setFeatured((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setFeatured((c) => (c === reviews.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5;

    const singleSetWidth = ticker.scrollWidth / 2;

    function animate() {
      if (!isPaused) {
        position += speed;
        if (position >= singleSetWidth) {
          position = 0;
        }
        ticker!.style.transform = `translateX(-${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
          <span className="inline-block text-sky-600 font-bold text-xs tracking-widest uppercase mb-3 sm:mb-4">
            Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 !leading-[1.3] mb-4 sm:mb-6">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-[15px] sm:text-lg leading-[1.75]">
            Don't just take our word for it -- hear from the people who trust us
            with their properties across San Diego County.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <div className="relative bg-navy-900 rounded-2xl p-6 sm:p-12 overflow-hidden">
            <div className="absolute top-4 right-6 sm:top-6 sm:right-8 opacity-[0.07]">
              <Quote className="w-20 sm:w-36 h-20 sm:h-36 text-sky-400" />
            </div>

            <div className="relative">
              <StarRating count={reviews[featured].rating} />

              <p className="mt-4 sm:mt-6 text-white text-base sm:text-xl leading-relaxed max-w-2xl">
                "{reviews[featured].text}"
              </p>

              <div className="mt-6 sm:mt-8 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold text-white text-[15px] sm:text-lg">
                    {reviews[featured].name}
                  </div>
                  <div className="text-sky-300 text-xs sm:text-sm mt-0.5 truncate">
                    {reviews[featured].location} -- {reviews[featured].service}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={prev}
                    className="p-3 sm:p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg text-white transition-colors duration-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="p-3 sm:p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg text-white transition-colors duration-200"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          ref={tickerRef}
          className="flex gap-4 sm:gap-6 w-max"
        >
          {reviews.map((review, i) => (
            <ReviewCard key={`a-${i}`} review={review} />
          ))}
          {reviews.map((review, i) => (
            <ReviewCard key={`b-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
