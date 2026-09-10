import { FiEye, FiTarget, FiCheckCircle, FiAward, FiShield, FiHeart } from 'react-icons/fi';
import { COMPANY_NAME, COMPANY_TAGLINE } from '../constants/branding';

export default function About() {
  return (
    <div className="mx-auto w-full max-w-7xl pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header section - Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-100/60 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-indigo-50/30 p-8 md:p-12 mb-12 shadow-[0_4px_20px_rgba(20,184,166,0.05)]">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600 bg-teal-100/60 px-3 py-1.5 rounded-full inline-block">
            About us
          </p>
          <h1 className="mt-4 font-display text-4xl font-black text-brand-950 sm:text-5xl md:text-6xl tracking-tight">
            {COMPANY_NAME}
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-display font-medium bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent italic">
            &ldquo;{COMPANY_TAGLINE}&rdquo;
          </p>
        </div>
        {/* Subtle background decorative shapes */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute right-20 bottom-0 -mb-20 h-64 w-64 rounded-full bg-indigo-300/10 blur-3xl" />
      </div>

      {/* Main content area: About content & Prescription banner */}
      <div className="grid gap-10 lg:grid-cols-12 items-stretch mb-12">
        {/* Description text */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-slate-700 leading-relaxed">
          <p className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
            {COMPANY_NAME} is a growing pharmaceutical company committed to delivering high-quality, affordable, and effective healthcare solutions. Built on the foundation of trust, care, and innovation, our mission is to improve the quality of life by making reliable medicines accessible to all.
          </p>
          <p className="text-base text-slate-600">
            At {COMPANY_NAME}, we believe that healthcare is not just about treatment—it is about caring, healing, and enhancing lives. Every product we develop reflects our dedication to safety, efficacy, and excellence.
          </p>
        </div>

        {/* Prescription Callout Card */}
        <div className="lg:col-span-5 flex">
          <div className="group relative overflow-hidden w-full rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-amber-50/30 p-8 shadow-sm flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 rounded-full bg-amber-500/5 h-32 w-32" />
            <div className="relative z-10 flex gap-5 items-start">
              <div className="rounded-2xl bg-amber-500/15 p-4 text-amber-700 font-display font-black text-2xl leading-none flex-shrink-0 shadow-sm border border-amber-200">
                Rx
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-950">Prescription Only Basis</h3>
                <p className="mt-2 text-sm text-amber-900/80 leading-relaxed">
                  All medicines and therapeutic formulations from our inventory are distributed and made accessible strictly on a medical prescription basis.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Regulatory Compliant Storefront
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider 1 */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#eef8f6] px-4 text-sm text-slate-400 font-semibold uppercase tracking-widest">
            Core Values & Pillars
          </span>
        </div>
      </div>

      {/* Vision & Mission grid below */}
      <div className="grid gap-8 md:grid-cols-2 items-stretch mb-16">
        {/* Vision card */}
        <div className="group relative overflow-hidden rounded-3xl border border-teal-100 bg-white/70 backdrop-blur-sm p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 rounded-full bg-teal-500/5 h-32 w-32 transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="rounded-2xl bg-teal-500/10 p-3.5 text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <FiEye className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              To become a trusted and recognized pharmaceutical brand known for quality, innovation, and patient-centric healthcare solutions across India.
            </p>
          </div>
        </div>

        {/* Mission card */}
        <div className="group relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/70 backdrop-blur-sm p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 rounded-full bg-indigo-500/5 h-32 w-32 transition-transform duration-500 group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="rounded-2xl bg-indigo-500/10 p-3.5 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <FiTarget className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <ul className="space-y-4">
              {[
                "To provide high-quality pharmaceutical products at affordable prices",
                "To ensure safety, efficacy, and consistency in every formulation",
                "To build long-term relationships with healthcare professionals and patients",
                "To continuously innovate and expand our product portfolio"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3.5">
                  <FiCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-slate-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section Divider 2 */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#eef8f6] px-4 text-sm text-slate-400 font-semibold uppercase tracking-widest">
            Quality & Branding Commitment
          </span>
        </div>
      </div>

      {/* Page 3 content - Quality & Branding Section */}
      <div className="grid gap-8 lg:grid-cols-2 items-stretch mb-16">
        {/* Quality and Brandings */}
        <div className="group relative overflow-hidden space-y-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-teal-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="rounded-2xl bg-teal-500/10 p-3.5 text-teal-600 shadow-sm">
                <FiAward className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Our Quality & Brandings</h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              At {COMPANY_NAME}, we focus on creating strong, memorable, and meaningful brands that connect with both doctors and patients. Each brand is developed with:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Easy recall and pronunciation",
                "Scientific credibility",
                "Premium and trustworthy positioning"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-teal-500 flex-shrink-0" />
                  <span className="text-sm md:text-base text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <blockquote className="border-l-4 border-teal-500 pl-4 py-1.5 italic text-slate-700 bg-teal-50/50 rounded-r-xl">
              &ldquo;Care that you can trust, quality that you can rely on.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Quality Commitment */}
        <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-3xl border border-indigo-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="rounded-2xl bg-indigo-500/10 p-3.5 text-indigo-600 shadow-sm">
                <FiShield className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Quality Commitment</h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              Quality is at the heart of everything we do. Our products are:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Manufactured in WHO-GMP certified facilities",
                "Developed using high-quality raw materials",
                "Tested to ensure safety, stability, and effectiveness"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <FiCheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 leading-relaxed">
              We follow strict quality control measures to ensure that every product meets the highest pharmaceutical standards.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - Full-width layout styled like Our Promise */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-teal-950 to-indigo-950 p-8 md:p-12 text-white shadow-xl mb-16">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative z-10">
          <h3 className="font-display text-2xl md:text-3xl font-black text-center tracking-tight mb-10 text-white">
            Why Choose {COMPANY_NAME}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { title: "Reliable Formulations", desc: "Reliable and effective formulations developed with high efficacy." },
              { title: "Quality & Safety", desc: "Strong focus on safety, stability, and therapeutic compliance." },
              { title: "Affordable Care", desc: "Affordable healthcare solutions designed for accessibility." },
              { title: "Innovative Range", desc: "Innovative and continuously expanding product portfolio." },
              { title: "Trusted by Doctors", desc: "Formulations trusted by leading healthcare professionals across India." }
            ].map((item, index) => (
              <div key={index} className="relative rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col items-center text-center group hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <FiCheckCircle className="h-8 w-8 text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-white mb-2">{item.title}</h4>
                <p className="text-xs text-teal-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Glow details */}
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
      </div>

      {/* Our Promise Callout Banner */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-800 p-8 md:p-12 text-white shadow-xl mb-16 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:20px_20px]" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex rounded-full bg-white/10 p-3 text-emerald-100 mb-2">
            <FiHeart className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="font-display text-3xl font-black sm:text-4xl tracking-tight">Our Promise</h2>
          <p className="text-lg sm:text-xl text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed">
            &ldquo;At {COMPANY_NAME}, we don&apos;t just sell medicines—we deliver care, trust, and better health.&rdquo;
          </p>
        </div>
        {/* Glowing background highlights */}
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl" />
      </div>
    </div>
  );
}

