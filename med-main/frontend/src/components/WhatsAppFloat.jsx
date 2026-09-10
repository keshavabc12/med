import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const phoneNumber = '918073353836'; // Country code (91) + mobile (8073353836)
  const message = 'Hello! I would like to inquire about your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-20 right-6 z-50 md:bottom-24 md:right-8 group">
      {/* Tooltip speech bubble */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 scale-90 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out origin-right whitespace-nowrap">
        <div className="relative bg-white text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex items-center gap-2">
          {/* Green active status dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Chat with us on WhatsApp
          {/* Tooltip Arrow */}
          <div className="absolute top-1/2 -translate-y-1/2 left-full border-[6px] border-transparent border-l-white filter drop-shadow-[1px_0_0_rgba(0,0,0,0.02)]"></div>
        </div>
      </div>

      {/* Outer Pulse Rings for attention */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/40 animate-pulse-ring pointer-events-none"></div>
      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-ring pointer-events-none [animation-delay:1s]"></div>

      {/* Main Button Link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white shadow-[0_8px_24px_rgba(16,185,129,0.4)] transition-all duration-300 ease-out hover:scale-110 active:scale-95 hover:shadow-[0_12px_30px_rgba(16,185,129,0.6)] animate-float-bob focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <FaWhatsapp className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[12deg]" />
      </a>
    </div>
  );
}
