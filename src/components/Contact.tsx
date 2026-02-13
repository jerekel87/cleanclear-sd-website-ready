import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

const CONTACT_DEFAULTS = {
  label: 'Get in Touch',
  title: 'Contact Us',
  description:
    "Have a question or want to learn more? Drop us a message and we'll get back to you promptly.",
  phone: '(858) 568-4950',
  phone_href: 'tel:+18585684950',
  email: 'jason@cleanclearsd.com',
  service_area: 'North San Diego County, CA',
  hours: 'Mon-Sat: 7AM - 6PM',
  urgent_heading: 'Need It Done Today?',
  urgent_description: 'Call us now for same-day service availability.',
};

export default function Contact() {
  const { content } = useWebsiteContent('contact', CONTACT_DEFAULTS);

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: content.phone as string, href: content.phone_href as string },
    { icon: Mail, label: 'Email', value: content.email as string, href: `mailto:${content.email}` },
    { icon: MapPin, label: 'Service Area', value: content.service_area as string },
    { icon: Clock, label: 'Hours', value: content.hours as string },
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase.from('contact_submissions').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      service_type: '',
      message: form.message,
    }]);

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('sent');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses =
    'w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all text-gray-800 placeholder-gray-400 text-[15px] sm:text-[0.938rem] bg-gray-50/50 hover:border-gray-300';

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
          <span className="inline-block text-sky-600 font-bold text-xs tracking-widest uppercase mb-3 sm:mb-4">
            {content.label as string}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 !leading-[1.3] mb-4 sm:mb-6">
            {content.title as string}
          </h2>
          <p className="text-gray-600 text-[15px] sm:text-lg leading-[1.75]">
            {content.description as string}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 order-2 lg:order-1">
            <div className="bg-navy-900 rounded-2xl p-6 sm:p-9 text-white flex-1">
              <h3 className="text-lg font-extrabold mb-5 sm:mb-7">Contact Information</h3>
              <div className="space-y-5 sm:space-y-6">
                {contactInfo.map((item) => {
                  const Wrapper = item.href ? 'a' : 'div';
                  return (
                    <Wrapper
                      key={item.label}
                      {...(item.href ? { href: item.href } : {})}
                      className="flex items-start gap-3.5 sm:gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-sky-500/15 group-hover:bg-sky-500 transition-colors duration-200 flex-shrink-0 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-sky-400 group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs text-sky-300/80 font-medium uppercase tracking-wide mb-0.5 sm:mb-1">
                          {item.label}
                        </div>
                        <div className="font-semibold text-sm sm:text-[0.938rem] leading-snug">{item.value}</div>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            <div className="bg-sky-500 rounded-2xl p-6 sm:p-9 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-400/30 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sky-600/30 rounded-full blur-xl" />
              <div className="relative">
                <h3 className="text-lg font-extrabold mb-2">{content.urgent_heading as string}</h3>
                <p className="text-sky-100 mb-5 sm:mb-6 text-sm leading-relaxed">
                  {content.urgent_description as string}
                </p>
                <a
                  href={content.phone_href as string}
                  className="inline-flex items-center gap-2.5 bg-white text-sky-600 px-6 py-3.5 rounded-lg font-bold hover:bg-sky-50 active:bg-sky-100 transition-all duration-200 text-sm shadow-sm"
                >
                  <Phone className="w-5 h-5" />
                  {content.phone as string}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-10">
              {status === 'sent' ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-2 sm:mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed text-sm sm:text-base">
                    Thanks for reaching out. We'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors text-sm"
                  >
                    Send another message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-navy-900 mb-1.5 sm:mb-2"
                      >
                        Full Name <span className="text-sky-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-semibold text-navy-900 mb-1.5 sm:mb-2"
                      >
                        Email Address <span className="text-sky-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-semibold text-navy-900 mb-1.5 sm:mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(858) 555-0000"
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-navy-900 mb-1.5 sm:mb-2"
                    >
                      Message <span className="text-sky-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <p className="text-red-700 text-sm font-medium">
                        Something went wrong. Please try again or call us directly.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300 text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 text-[15px] sm:text-[0.938rem] shadow-sm shadow-sky-500/20 hover:shadow-md hover:shadow-sky-500/25"
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4.5 h-4.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
