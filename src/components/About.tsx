import { useState, useRef } from 'react';
import { Shield, Award, Clock, Users, CheckCircle } from 'lucide-react';

const promises = [
  'Eco-friendly, biodegradable cleaning solutions',
  'Commercial-grade equipment on every job',
  'Fully licensed, bonded & insured (License #B2025006275)',
  'Safe, secure, and highest quality service',
  'Transparent pricing \u2014 no hidden fees',
];

const stats = [
  { icon: Shield, value: 'Fully Covered', label: 'Licensed & Insured' },
  { icon: Award, value: '20+', label: 'Years of Expertise' },
  { icon: Clock, value: 'Same Day', label: 'Response Time' },
  { icon: Users, value: '1,000+', label: 'Customers Served' },
];

export default function About() {
  const [activeStat, setActiveStat] = useState(0);
  const touchStartRef = useRef(0);

  const onStatTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onStatTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (diff > 50 && activeStat < stats.length - 1) setActiveStat(activeStat + 1);
    if (diff < -50 && activeStat > 0) setActiveStat(activeStat - 1);
  };

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-white overflow-x-hidden">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-24 items-center">
          <div className="lg:col-span-5 min-w-0">
            <div className="relative pb-6 sm:pb-8">
              <div className="aspect-[3/2] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Professional pressure washing"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-2 right-3 sm:bottom-0 sm:right-0 lg:-bottom-4 lg:-right-6 bg-white rounded-xl shadow-lg p-3.5 sm:p-5 border border-gray-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-sky-500 flex items-center justify-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-extrabold text-navy-900">20+</div>
                    <div className="text-[11px] sm:text-xs text-gray-500 font-medium">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 min-w-0 mt-4 lg:mt-0">
            <span className="inline-block text-sky-600 font-bold text-xs tracking-widest uppercase mb-3 sm:mb-4">
              About Clean Clear SD
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 !leading-[1.3] mb-5 sm:mb-8">
              Built on Trust.{' '}
              <span className="text-sky-600">Backed by Results.</span>
            </h2>

            <p className="text-gray-600 leading-[1.75] text-[15px] sm:text-lg max-w-xl mb-6 sm:mb-10">
              What makes a cleaning company unique? At Clean Clear SD, we believe it's
              trust. With over 20 years of expertise, we take
              every measure to ensure that you and your home are served in a manner that
              is safe, secure, and of the highest quality.
            </p>

            <p className="text-gray-600 leading-[1.75] text-[15px] sm:text-lg max-w-xl mb-6 sm:mb-10">
              We combine commercial-grade equipment with eco-friendly solutions to
              deliver results that speak for themselves.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              {promises.map((item) => (
                <div key={item} className="flex items-start sm:items-center gap-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-[0.938rem] leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-10">
              <div className="sm:hidden">
                <div
                  className="overflow-hidden"
                  onTouchStart={onStatTouchStart}
                  onTouchEnd={onStatTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeStat * 100}%)` }}
                  >
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex-shrink-0 w-full px-2">
                        <div className="text-center bg-gray-50 rounded-2xl py-6 px-4">
                          <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
                            <stat.icon className="w-7 h-7 text-sky-500" />
                          </div>
                          <div className="font-black text-navy-900 text-2xl leading-tight mb-1.5">{stat.value}</div>
                          <div className="text-sm text-gray-500 leading-normal">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {stats.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStat(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === activeStat ? 'bg-sky-500 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-5 h-5 text-sky-500 mx-auto mb-3" />
                    <div className="font-black text-navy-900 text-xl leading-tight mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 leading-normal">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
