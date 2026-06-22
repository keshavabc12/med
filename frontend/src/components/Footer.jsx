import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { COMPANY_NAME, COMPANY_TAGLINE } from '../constants/branding';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);
  const [securityKey, setSecurityKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    // The security key is currently hardcoded as 'CheriShya@030721'
    if (securityKey === 'CheriShya@030721') {
      setShowSecurityPrompt(false);
      setSecurityKey('');
      setError('');
      navigate('/admin/login');
    } else {
      setError('Invalid security key. Access denied.');
    }
  };
  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-cyan-900 via-teal-950 to-indigo-950 text-slate-200 shadow-[0_-12px_40px_-12px_rgba(15,118,110,0.35)]">
      <div
        className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-teal-400 to-indigo-400"
        aria-hidden
      />
      {/* Decorative glows */}
      <div
        className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-teal-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-white drop-shadow-sm">{COMPANY_NAME}</p>
            <p className="mt-2 bg-gradient-to-r from-amber-200 to-teal-200 bg-clip-text text-sm font-semibold text-transparent">
              {COMPANY_TAGLINE}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-teal-100/85">
              Quality-assured health essentials with a calm, modern shopping experience. Always follow your physician&apos;s
              guidance for medicines.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/95">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link
                  to="/about"
                  className="text-teal-100/90 transition hover:translate-x-0.5 hover:text-white inline-block"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-teal-100/90 transition hover:translate-x-0.5 hover:text-white inline-block"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/95">Administrative Office</p>
            <div className="mt-4 space-y-1.5 text-sm text-teal-100/85">
              <p>Cherishya Pharma</p>
              <p className="leading-relaxed">P.No. 11, 11/A, 11/B, Ground Floor, Shop No 1, 2nd Stage,<br className="hidden sm:block" /> Bogadi, Mysore – 570026</p>
              <p>
                <a href="https://maps.app.goo.gl/XZooaRHZuKHyqcNHA" target="_blank" rel="noopener noreferrer" className="underline text-teal-200 hover:text-white transition">
                  Location on Google map
                </a>
              </p>
              <p>Mobile – 8073353836</p>
              <p>Mail id – <a href="mailto:cherishyapharma@gmail.com" className="underline text-teal-200 hover:text-white transition">cherishyapharma@gmail.com</a></p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/95">Team</p>
            <div className="flex flex-col items-start mt-4">
              <button
                onClick={() => setShowSecurityPrompt(true)}
                className="inline-flex rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-amber-100 ring-1 ring-amber-400/30 transition hover:bg-white/15 hover:text-white hover:ring-amber-300/50"
              >
                Staff portal
              </button>


            </div>
            <div className="flex justify-start space-x-5 mt-6">
              <a href="https://wa.me/918073353836" target="_blank" rel="noopener noreferrer" className="text-teal-200 hover:text-white transition hover:scale-110" aria-label="WhatsApp">
                <FaWhatsapp className="w-5 h-5" aria-label="WhatsApp" />
              </a>
              <a href="https://www.instagram.com/cherishyapharma?igsh=dndtdngzMDh0eGRq" target="_blank" rel="noopener noreferrer" className="text-teal-200 hover:text-white transition hover:scale-110" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" aria-label="Instagram" />
              </a>
            </div>
          </div>

        </div>
      </div>





      {/* Security Key Modal */}
      {showSecurityPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800">Security Check</h3>
            <p className="mt-2 text-sm text-slate-600">Please enter the security key to access the staff portal.</p>
            
            <form onSubmit={handleSecuritySubmit} className="mt-5">
              <input
                type="password"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="Enter security key"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                autoFocus
              />
              {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSecurityPrompt(false);
                    setSecurityKey('');
                    setError('');
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition"
                >
                  Verify Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
