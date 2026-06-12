import { useState } from 'react';
import { COMPANY_NAME } from '../constants/branding';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.cname.value;
    const email = e.target.cemail.value;
    const msg = e.target.cmsg.value;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg }),
      });

      if (response.ok) {
        setSent(true);
        e.target.reset();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error connecting to the server. Please check if the backend is running.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header section - Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/50 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-indigo-50/30 p-8 md:p-12 mb-10 shadow-lg shadow-brand-900/5">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 bg-brand-50 border border-brand-100 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
            Contact Us
          </p>
          <h1 className="mt-4 font-display text-4xl font-black text-brand-950 sm:text-5xl tracking-tight">
            We&apos;re listening
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Have questions about our products, orders, or partnership opportunities? Reach out to us directly or fill out the enquiry form.
          </p>
        </div>
        {/* Subtle background decorative shapes */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute right-20 bottom-0 -mb-20 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />
      </div>

      <div className="space-y-8">
        {/* Top: Enquiry Box */}
        <div className="bg-white rounded-3xl border border-brand-200/50 p-6 sm:p-8 shadow-lg shadow-brand-900/5 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-brand-950 font-display mb-2">Send an Enquiry</h2>
          <p className="text-sm text-slate-600 mb-6">
            Fill out the form below, and our team will get back to you as soon as possible.
          </p>

          {sent ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-900 animate-fade-in">
              Thanks for reaching out! Your message has been sent to our team, and we will get back to you shortly.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-brand-900" htmlFor="cname">
                    Name
                  </label>
                  <input
                    id="cname"
                    required
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-brand-900" htmlFor="cemail">
                    Email
                  </label>
                  <input
                    id="cemail"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-900" htmlFor="cmsg">
                  Message
                </label>
                <textarea
                  id="cmsg"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-brand-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-700/20 hover:from-brand-500 hover:to-brand-800 transition-all duration-300 transform active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Bottom: Contact Info & Location Map */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-brand-200/50 p-6 sm:p-8 shadow-lg shadow-brand-900/5 transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-950 font-display border-b border-brand-100 pb-3 mb-6">
                Administrative Office
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-brand-50 p-3.5 text-brand-600 shadow-sm border border-brand-100 mt-1 flex-shrink-0">
                    <FiMapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-950 text-lg">Cherishya Pharma</h3>
                    <p className="mt-1.5 text-slate-700 leading-relaxed text-sm">
                      P.No. 11, 11/A, 11/B,<br />
                      Ground Floor, Shop No 1,<br />
                      2nd Stage, Bogadi,<br />
                      Mysore – 570026
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-brand-50 p-3.5 text-brand-600 shadow-sm border border-brand-100 mt-1 flex-shrink-0">
                    <FiPhone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xs uppercase tracking-wider">Mobile</h3>
                    <a
                      href="tel:8073353836"
                      className="mt-1 text-slate-800 font-bold hover:text-brand-700 transition-colors block text-base"
                    >
                      +91 80733 53836
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-brand-50 p-3.5 text-brand-600 shadow-sm border border-brand-100 mt-1 flex-shrink-0">
                    <FiMail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-xs uppercase tracking-wider">Email ID</h3>
                    <a
                      href="mailto:cherishyapharma@gmail.com"
                      className="mt-1 text-slate-800 font-bold hover:text-brand-700 transition-colors block text-base break-all"
                    >
                      cherishyapharma@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-3xl border border-brand-200/50 p-6 sm:p-8 shadow-lg shadow-brand-900/5 transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h3 className="font-bold text-brand-950 font-display text-lg">Location on Google Map</h3>
                <a
                  href="https://maps.app.goo.gl/XZooaRHZuKHyqcNHA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors group"
                >
                  View on Google Maps
                  <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                </a>
              </div>

              <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  src="https://maps.google.com/maps?q=Cherishya%20Pharma,%20Bogadi,%20Mysore&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cherishya Pharma Location Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
