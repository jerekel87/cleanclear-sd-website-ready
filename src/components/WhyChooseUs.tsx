import {
  ShieldCheck,
  Leaf,
  Zap,
  HandshakeIcon,
  ThumbsUp,
  BadgeDollarSign,
} from 'lucide-react';

const benefits: Array<{ icon: typeof ShieldCheck; title: string; description: string }> = [
  {
    icon: ShieldCheck,
    title: 'Fully Licensed & Insured',
    description:
      'Work with confidence knowing your property is protected by our comprehensive insurance coverage.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Solutions',
    description:
      'We use biodegradable, EPA-approved cleaning agents that are safe for your family, pets, and landscaping.',
  },
  {
    icon: Zap,
    title: 'Same-Day Service',
    description:
      'Need it done fast? We offer same-day and next-day scheduling for most residential jobs.',
  },
  {
    icon: HandshakeIcon,
    title: 'Satisfaction Guaranteed',
    description:
      'If you\'re not 100% happy with the result, we\'ll re-clean the area at no additional cost.',
  },
  {
    icon: ThumbsUp,
    title: 'Trusted Technicians',
    description:
      'Every crew member is background-checked, trained, and committed to treating your home with the utmost care.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent Pricing',
    description:
      'No hidden fees, no surprise charges. We quote upfront and stand behind our pricing.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-navy-900 relative overflow-hidden">
      <div className="relative max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-sky-400 font-bold text-xs tracking-widest uppercase">
            Why Clean Clear SD
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white !leading-[1.3]">
            The Clear Difference
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-300 text-[15px] sm:text-lg leading-relaxed">
            When you choose Clean Clear SD, you get more than a clean surface --
            you get peace of mind. We clean it like we mean it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-[30px]">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left p-5 sm:p-8 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors duration-200 rounded-xl"
            >
              <div className="p-2.5 rounded-lg bg-white/10 text-sky-400 w-fit mb-3 sm:mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all duration-200">
                <benefit.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
