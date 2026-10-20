import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown } from 'lucide-react';

export default function Contact() {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Order Support');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    showToast(`Thank you ${name || 'Guest'}! Your inquiry has been sent to our guest care team.`, 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'What is your delivery radius in San Francisco?',
      a: 'We deliver within a 6-mile radius from our Valencia Street flagship kitchen, covering the Mission, SoMa, Potrero Hill, Noe Valley, Castro, Hayes Valley, and Financial District.',
    },
    {
      q: 'How do you keep items like french fries and pizza hot and crisp?',
      a: 'We utilize custom vented thermal packaging engineered from natural sugarcane bagasse. It allows steam to escape while sealing in radiated convective heat, preventing condensation.',
    },
    {
      q: 'Do you cater large office lunches or private dinner parties?',
      a: 'Yes! We cater orders of 10 to 250 guests. Please contact us at least 24 hours in advance via this form or by calling our concierge desk directly.',
    },
    {
      q: 'How do you handle dietary allergies and gluten sensitivities?',
      a: 'We operate designated allergen-separated prep stations. Gluten-free pizza doughs and bowls are prepared using dedicated utensils and bake stones.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900">
          Get in Touch with SAVOR
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have a question about an active delivery, private dining event, or ingredients? Our concierge desk is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
          <h2 className="text-lg font-bold font-display text-stone-900 pb-2 border-b border-stone-100">
            Send a Note to Kitchen Concierge
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Taylor Reid"
                  className="w-full p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="taylor@example.com"
                  className="w-full p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Subject / Reason</label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              >
                <option value="Order Support">Order Inquiry / Assistance</option>
                <option value="Catering">Event Catering & Bulk Orders</option>
                <option value="Allergy">Allergen & Ingredient Inquiry</option>
                <option value="Press">Press & Partnerships</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Your Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist your dining experience today?"
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Submit Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Location & Hours Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h2 className="text-base font-bold font-display text-stone-900 pb-2 border-b border-stone-100">
              Kitchen & Pickup Counter
            </h2>

            <div className="space-y-3 text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Flagship Location:</span>
                  <span>428 Valencia Street, Mission District</span>
                  <span className="block text-stone-400">San Francisco, CA 94103</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Phone Support:</span>
                  <span className="font-mono">(415) 890-SAVOR (7286)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Direct Email:</span>
                  <span className="font-mono">concierge@savor-kitchen.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Operating Service Hours:</span>
                  <span>Mon – Fri: 11:00 AM – 10:30 PM</span>
                  <span className="block">Sat – Sun: 10:00 AM – 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Section */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold font-display text-stone-900 pb-2 border-b border-stone-100">
              Frequently Asked Questions
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-stone-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-2.5 text-left text-xs font-semibold text-stone-800 flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-2.5 pt-0 text-xs text-stone-500 leading-relaxed bg-stone-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
