
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import ChatBot from './components/ChatBot';
import PhotoUpload from './components/PhotoUpload';
import { SERVICE_GROUPS as INITIAL_SERVICES, THEME_PRESETS, MAPS_LINK, NAVIGATION } from './constants';
import { ThemeConfig, FileItem } from './types';
import { bundleFiles } from './utils/bundler';
import JSZip from 'jszip';

// The requested "Icon Cell" Brand Logo
export const BrandLogo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M50 15L80 30V70L50 85L20 70V30L50 15Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
    <path d="M40 35V65H50C55 65 58 62 58 58C58 54 55 51 50 51H45M40 51H50C54 51 56 49 56 45.5C56 42 54 40 50 40H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.34 6.34 0 0 1-1.87-1.52v7.33c.02 1.43-.3 2.89-1.07 4.1-.73 1.16-1.88 2.1-3.17 2.61-1.29.53-2.73.68-4.1.42-1.36-.26-2.64-.98-3.6-2.01-1.02-1.12-1.59-2.61-1.55-4.12.02-1.49.56-2.98 1.55-4.12.96-1.11 2.34-1.86 3.78-2.07 1.34-.21 2.76-.02 3.99.55v4.1c-.81-.46-1.78-.6-2.7-.39-1.03.22-1.92.93-2.39 1.86-.48.92-.48 2.06 0 2.98.47.93 1.36 1.64 2.39 1.86 1.03.22 2.13-.03 2.98-.68.86-.65 1.35-1.7 1.35-2.79V.02z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259 0 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const AdminLoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (pin: string) => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-sm rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 border" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--theme-bg-main)' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-primary)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 className="text-2xl font-bold serif italic" style={{ color: 'var(--theme-text-main)' }}>Owner Access</h3>
          <p className="text-xs mt-2 uppercase tracking-widest font-bold" style={{ color: 'var(--theme-text-muted)' }}>Enter PIN to manage salon</p>
        </div>
        <div className="space-y-4">
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              className={`w-full text-center text-xl tracking-[0.2em] py-4 pr-12 pl-12 bg-stone-50 border ${error ? 'border-red-500' : 'border-[var(--theme-border)]'} rounded-2xl focus:ring-2 focus:ring-[var(--theme-accent)] focus:outline-none transition-all`}
              autoFocus
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          {error && <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">Incorrect Access Code</p>}
          <button 
            onClick={() => {
              if (pin === '10EMAK#2806') { onLogin(pin); setPin(''); }
              else { setError(true); setPin(''); }
            }}
            className="w-full text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            Authorize
          </button>
          <button onClick={onClose} className="w-full text-stone-400 text-[10px] uppercase font-bold tracking-widest hover:text-stone-600 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const LegalModal = ({ isOpen, onClose, type, legalData }: { isOpen: boolean, onClose: () => void, type: 'terms' | 'privacy', legalData: any }) => {
  if (!isOpen) return null;

  const active = {
    title: type === 'terms' ? "Terms of Service" : "Privacy Policy",
    sections: legalData[type] || []
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-stone-900/95 backdrop-blur-2xl">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-y-auto max-h-[90vh] border animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10 sticky top-0 bg-white py-2 z-10 border-b">
          <h2 className="text-3xl font-bold serif italic" style={{ color: 'var(--theme-text-main)' }}>{active.title}</h2>
          <button onClick={onClose} className="p-3 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-12 pb-6">
          {active.sections.length > 0 ? active.sections.map((s: any, i: number) => (
            <div key={i} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 50}ms` }}>
              <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-3" style={{ color: 'var(--theme-primary)' }}>
                <span className="w-6 h-[1px] bg-current opacity-30"></span>
                {s.h}
              </h4>
              <p className="text-stone-600 leading-relaxed text-sm md:text-base font-light italic pl-9 whitespace-pre-wrap">
                {s.p}
              </p>
            </div>
          )) : (
            <p className="italic text-stone-400 text-center py-10">No information available.</p>
          )}
        </div>
        <div className="mt-12 pt-8 border-t sticky bottom-0 bg-white pb-2">
          <button 
            onClick={onClose} 
            className="w-full py-5 rounded-2xl text-white font-bold uppercase tracking-widest text-[11px] shadow-xl hover:brightness-110 active:scale-95 transition-all" 
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            I Have Read & Understood
          </button>
        </div>
      </div>
    </div>
  );
};

const SalonPolicies = ({ policies }: { policies: any[] }) => {
  return (
    <section id="policies" className="py-24 scroll-mt-20" style={{ backgroundColor: 'var(--theme-bg-main)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.5em] mb-4 block" style={{ color: 'var(--theme-accent)' }}>Guidelines</span>
          <h2 className="text-5xl md:text-7xl font-bold serif italic" style={{ color: 'var(--theme-text-main)' }}>Salon Policies</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {policies.map((p, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[3rem] border shadow-sm hover:shadow-xl transition-all duration-500" style={{ borderColor: 'var(--theme-border)' }}>
              <h3 className="text-2xl font-bold serif italic mb-4" style={{ color: 'var(--theme-primary)' }}>
                {p.title}
                {p.subtitle && (
                  <>
                    <br />
                    <span className="text-lg md:text-xl font-bold italic">{p.subtitle}</span>
                  </>
                )}
              </h3>
              <p className="text-stone-600 leading-relaxed italic text-sm md:text-base font-light whitespace-pre-wrap">
                {p.desc}
              </p>
            </div>
          ))}
          {policies.length === 0 && <div className="col-span-full py-10 italic text-stone-400 text-center">Policies currently being updated.</div>}
        </div>
      </div>
    </section>
  );
};

const FAQSection = ({ faqs }: { faqs: any[] }) => {
  return (
    <section id="faq" className="py-24 border-t scroll-mt-20" style={{ backgroundColor: 'var(--theme-bg-main)', borderColor: 'var(--theme-border)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold serif italic" style={{ color: 'var(--theme-text-main)' }}>Frequently Asked <span style={{ color: 'var(--theme-primary)', fontWeight: 'normal' }}>Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: 'var(--theme-border)' }}>
              <summary className="flex justify-between items-center px-8 py-6 font-bold text-stone-800 cursor-pointer list-none hover:text-[var(--theme-primary)] transition-colors">
                <span className="text-sm md:text-base italic serif leading-tight">{faq.q}</span>
                <span className="group-open:rotate-180 transition-transform duration-300 ml-4 shrink-0" style={{ color: 'var(--theme-accent)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-8 pb-8 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="text-stone-600 leading-relaxed text-sm md:text-base font-light italic border-t border-stone-50 pt-4 whitespace-pre-wrap">
                  {faq.a}
                </div>
              </div>
            </details>
          ))}
          {faqs.length === 0 && <p className="italic text-stone-400 text-center py-10">No FAQs available.</p>}
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const adminPanelRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const portfolioBottomRef = useRef<HTMLDivElement>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminTab, setAdminTab] = useState<'portfolio' | 'services' | 'theme' | 'policies' | 'contact' | 'settings'>('portfolio');
  const [bundling, setBundling] = useState(false);

  const [legalModal, setLegalModal] = useState<{ isOpen: boolean, type: 'terms' | 'privacy' }>({ isOpen: false, type: 'terms' });

  // Floating side arrow visibility
  const [showPortfolioSideArrow, setShowPortfolioSideArrow] = useState(false);
  const [isNearPortfolioBottom, setIsNearPortfolioBottom] = useState(false);

  const DEFAULT_BANK = {
    accountNumber: '1277738793',
    bankName: 'Nedbank',
    proofNumber: '081 747 6483'
  };

  const DEFAULT_INFO = {
    whatsapp: '27817476483',
    tiktok: 'kamohelotaukobong',
    instagram: 'bliss_beauty_by_kamo',
    facebook: '',
    phone: '+27 81 747 6483',
    hours: [
      { day: 'Mon — Sat', time: '08:00 AM — 07:30 PM' },
      { day: 'Sunday', time: 'Closed' }
    ]
  };

  const DEFAULT_FAQ = [
    { q: "How do I book an appointment?", a: "Appointments can be booked via our website or WhatsApp. A R50 booking fee is required to secure your slot. Your booking will be fully confirmed only once Kamo herself approves it on WhatsApp." },
    { q: "Is the R50 booking fee an extra charge?", a: "No. The R50 booking fee is a partial payment, not an extra charge. It is deducted from your total service price on the day of your appointment.\n\nExample:\nService booked: Medium Plain Nails – R180\nBooking fee paid upfront: R50\nRemaining balance due on appointment day: R130\n\nIf the client cancels late or does not show up, the R50 booking fee is kept to cover the reserved time." },
    { q: "Do you accept walk-ins?", a: "No. We operate strictly by appointment only to ensure every client receives premium, one-on-one service." },
    { q: "Are designs included in the base price?", a: "No. All designs and decorations are charged per nail:\nCharms: R5 per nail\n3D designs: R10 per nail\nBow ties: R10 per nail\nButterflies: R10 per nail\nPlease mention your desired design when booking." },
    { q: "How long does an appointment take?", a: "Appointments typically take 1 hour 30 minutes, depending on nail length, design complexity, and add-ons selected." },
    { q: "What happens if I arrive late?", a: "A 15-minute grace period is allowed. Arriving later may result in a shortened service, rescheduling, or cancellation, depending on availability. The booking fee will still apply." },
    { q: "What is your cancellation policy?", a: "Cancellations or rescheduling must be made at least 24 hours in advance. Late cancellations or no-shows will result in forfeiture of the booking fee." },
    { q: "Do you work on public holidays?", a: "Yes. We are open on public holidays, however appointments are highly recommended due to limited availability." },
    { q: "How can I pay?", a: "Booking fee: EFT / Bank Transfer\nRemaining balance: Cash or EFT" },
    { q: "Where are you located?", a: "We are located in Finetown, Grasmere. Exact directions will be shared once your appointment is confirmed." }
  ];

  const DEFAULT_POLICIES = [
    { title: "Appointments Only", subtitle: "(No Walk-Ins)", desc: "BlissBeautyByKamo operates strictly by appointment only. This ensures Kamo can focus entirely on the client's masterpiece." },
    { title: "Non-Refundable Deposit", subtitle: "(R50 Fee)", desc: "A R50 booking fee is required to secure every slot. This is a non-refundable partial payment which will be deducted from your total service price." },
    { title: "Grace Period", subtitle: "(15 Minutes Max)", desc: "Please arrive on time. We offer a 15-minute grace period. Arriving later than 15 minutes may result in a shortened service or immediate cancellation to respect the next client's time." },
    { title: "Cancellation Policy", subtitle: "(24h Notice)", desc: "If you need to reschedule, please notify us at least 24 hours in advance. Failure to do so may result in the forfeiture of your deposit." },
    { title: "Hygiene & Health", subtitle: "(Client Responsibility)", desc: "Please inform us of any nail fungal infections or severe skin conditions. For safety reasons, we cannot perform services on infected nails." }
  ];

  const DEFAULT_LEGAL = {
    terms: [
      { h: "1. Agreement to Terms", p: "By accessing this website and booking a service with BlissBeautyByKamo, you expressly agree to be bound by these Terms of Service. This agreement governs your use of our reservation portal, website, and in-person services. If you do not agree to all terms, conditions, and policies stated herein, you are prohibited from using the site and our services." },
      { h: "2. Booking and Reservation Integrity", p: "Appointments are subject to real-time availability and are allocated on a first-come, first-served basis. No booking is deemed final or officially entered into our master schedule until a non-refundable R50 deposit has been processed and verified by the salon owner via direct WhatsApp communication. We reserve the right to decline booking requests that conflict with our scheduling logic or studio capacity." },
      { h: "3. Comprehensive Payment Policy", p: "The remaining balance for nail artistry services is due in full immediately upon completion of the session. We currently accept physical cash (exact change preferred) and verified Electronic Fund Transfers (EFT). For EFT payments, the service is only considered concluded once a valid digital proof of payment is received. We do not offer credit facilities or deferred payment options." },
      { h: "4. Punctuality and Cancellation Governance", p: "A strict 15-minute grace period is granted from the scheduled start time. Clients arriving after this window may have their design scope reduced to fit the remaining time or face total cancellation of the slot without deposit refund. Cancellations or rescheduling requests must be submitted at least 24 hours prior to the appointment. Failure to provide adequate notice will result in the forfeiture of the deposit as a studio inconvenience fee." },
      { h: "5. Artistic Service Guarantee", p: "We take immense pride in the technical precision of our Poly Gel and Nail Art sets. Should you experience chipping, lifting, or structural breakage within 48 hours of your appointment due to application error, we provide complimentary repairs. Any damage reported after the 48-hour window, or damage resulting from client mishandling (e.g., physical trauma, chemical exposure), will be subject to standard per-nail repair rates." },
      { h: "6. Client Health and Disclosures", p: "Safety and hygiene are paramount at Bliss studio. Clients are legally required to disclose any known allergies to acrylic monomers, gel resins, or associated chemicals prior to the session. We reserve the right to refuse service if nails show signs of fungal infection, severe trauma, or contagious skin conditions. Performing services on compromised nail beds poses a risk to both the client and the studio's hygienic standard." },
      { h: "7. Studio Conduct and Environment", p: "We maintain a luxury, focused, and respectful artistic environment. Any form of harassment, inappropriate behavior, or disregard for studio property will result in the immediate termination of the session and a permanent ban from future services. BlissBeautyByKamo is not responsible for the loss or damage of personal belongings brought into the studio premises." },
      { h: "8. Right to Use Artistic Imagery", p: "By receiving services, you grant BlissBeautyByKamo the right to photograph and video your finished nail set for portfolio and marketing purposes across social media and digital platforms. We will ensure client anonymity unless otherwise agreed upon. Clients who wish to opt-out of this must notify Kamo prior to the service." }
    ],
    privacy: [
      { h: "1. Extensive Data Collection", p: "To facilitate a premium booking experience, we collect specific personal data points including your full legal name, active contact numbers (primarily for WhatsApp synchronization), Instagram handle for aesthetic reference, and any shared inspiration media. This data is collected through our secure web forms and via direct encrypted messaging channels." },
      { h: "2. Strategic Use of Information", p: "Your data is used exclusively to: (a) Authenticate and finalize session bookings; (b) Issue automated appointment reminders; (c) Analyze shared inspiration photos to pre-prepare specialized artistic tools and colors; (d) Facilitate follow-up care advice; and (e) Manage the salon's internal client database for loyalty and history tracking." },
      { h: "3. Robust Information Security", p: "We implement a combination of physical, electronic, and managerial safeguards to protect your personal information. Digital data is stored on password-protected management devices and encrypted cloud storage solutions. We actively monitor for unauthorized access and ensure that your contact details are shielded from public view." },
      { h: "4. Third-Party Confidentiality", p: "BlissBeautyByKamo strictly adheres to a no-sale policy for client data. We do not sell, trade, or transfer your information to external marketing agencies. This excludes trusted service providers who assist us in hosting this website or conducting business operations (such as payment processing or AI integration), provided those parties are contractually bound to maintain strict confidentiality." },
      { h: "5. Digital Footprint and Cookies", p: "This website utilizes minimal 'essential' cookies designed to enhance your browsing efficiency and preserve your localized site preferences (such as your chosen design theme). These cookies do not perform cross-site tracking or behavioral profiling for third-party advertising networks." },
      { h: "6. Data Retention Policy", p: "Personal information is retained only for as long as necessary to fulfill the booking purposes outlined or as required by law. Client records that have remained inactive for over 24 months are periodically purged from our primary management systems to ensure data relevance and minimize storage risk." },
      { h: "7. Your Rights and Access", p: "Under prevailing data protection principles, you maintain the right to: (a) Request a copy of the data we hold about you; (b) Request immediate correction of inaccurate contact details; (c) Request the total deletion of your client profile from our records. To exercise these rights, please send a formal request to Kamo via our verified WhatsApp channel." },
      { h: "8. Continuous Policy Evolution", p: "This Privacy Policy is a living document and may be updated to reflect changes in our studio operations or legal obligations. We encourage clients to review this section periodically. Continued use of our booking services signifies your ongoing acceptance of our privacy practices." }
    ]
  };

  const loadSaved = (key: string, fallback: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [savedPhotos, setSavedPhotos] = useState<string[]>(() => loadSaved('bliss_photos', []));
  const [savedServices, setSavedServices] = useState<any>(() => loadSaved('bliss_services', INITIAL_SERVICES));
  const [savedTheme, setSavedTheme] = useState<ThemeConfig>(() => loadSaved('bliss_theme', THEME_PRESETS.original));
  const [savedBank, setSavedBank] = useState(() => loadSaved('bliss_bank', DEFAULT_BANK));
  const [savedInfo, setSavedInfo] = useState(() => loadSaved('bliss_info', DEFAULT_INFO));
  const [savedFAQ, setSavedFAQ] = useState(() => loadSaved('bliss_faq', DEFAULT_FAQ));
  const [savedPolicies, setSavedPolicies] = useState(() => loadSaved('bliss_guidelines', DEFAULT_POLICIES));
  const [savedLegal, setSavedLegal] = useState(() => loadSaved('bliss_legal', DEFAULT_LEGAL));
  const [savedAIEnabled, setSavedAIEnabled] = useState(() => loadSaved('bliss_ai_enabled', true));

  // Portfolio Toggle State
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);

  const [draftPhotos, setDraftPhotos] = useState<string[]>(savedPhotos);
  const [draftServices, setDraftServices] = useState<any>(savedServices);
  const [draftTheme, setDraftTheme] = useState<ThemeConfig>(savedTheme);
  const [draftBank, setDraftBank] = useState(savedBank);
  const [draftInfo, setDraftInfo] = useState(savedInfo);
  const [draftFAQ, setDraftFAQ] = useState(savedFAQ);
  const [draftPolicies, setDraftPolicies] = useState(savedPolicies);
  const [draftLegal, setDraftLegal] = useState(savedLegal);
  const [draftAIEnabled, setDraftAIEnabled] = useState(savedAIEnabled);

  useEffect(() => {
    if (!isAdmin) {
      setDraftPhotos(savedPhotos);
      setDraftServices(savedServices);
      setDraftTheme(savedTheme);
      setDraftBank(savedBank);
      setDraftInfo(savedInfo);
      setDraftFAQ(savedFAQ);
      setDraftPolicies(savedPolicies);
      setDraftLegal(savedLegal);
      setDraftAIEnabled(savedAIEnabled);
    }
  }, [isAdmin, savedPhotos, savedServices, savedTheme, savedBank, savedInfo, savedFAQ, savedPolicies, savedLegal, savedAIEnabled]);

  // Fast Intersection Observer for Portfolio section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowPortfolioSideArrow(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (portfolioRef.current) {
      observer.observe(portfolioRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for detecting when user is near the bottom area (to hide arrow)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearPortfolioBottom(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (portfolioBottomRef.current) {
      observer.observe(portfolioBottomRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Apply Theme CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = savedTheme.colors;
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-bg-main', colors.bgMain);
    root.style.setProperty('--theme-bg-surface', colors.bgSurface);
    root.style.setProperty('--theme-text-main', colors.textMain);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-border', colors.border);
  }, [savedTheme]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(savedPhotos) !== JSON.stringify(draftPhotos) ||
           JSON.stringify(savedServices) !== JSON.stringify(draftServices) ||
           JSON.stringify(savedTheme) !== JSON.stringify(draftTheme) ||
           JSON.stringify(savedBank) !== JSON.stringify(draftBank) ||
           JSON.stringify(savedInfo) !== JSON.stringify(draftInfo) ||
           JSON.stringify(savedFAQ) !== JSON.stringify(draftFAQ) ||
           JSON.stringify(savedPolicies) !== JSON.stringify(draftPolicies) ||
           JSON.stringify(savedLegal) !== JSON.stringify(draftLegal) ||
           savedAIEnabled !== draftAIEnabled;
  }, [savedPhotos, draftPhotos, savedServices, draftServices, savedTheme, draftTheme, savedBank, draftBank, savedInfo, draftInfo, savedFAQ, draftFAQ, savedPolicies, draftPolicies, savedLegal, draftLegal, savedAIEnabled, draftAIEnabled]);

  const handleSaveChanges = () => {
    localStorage.setItem('bliss_photos', JSON.stringify(draftPhotos));
    localStorage.setItem('bliss_services', JSON.stringify(draftServices));
    localStorage.setItem('bliss_theme', JSON.stringify(draftTheme));
    localStorage.setItem('bliss_bank', JSON.stringify(draftBank));
    localStorage.setItem('bliss_info', JSON.stringify(draftInfo));
    localStorage.setItem('bliss_faq', JSON.stringify(draftFAQ));
    localStorage.setItem('bliss_guidelines', JSON.stringify(draftPolicies));
    localStorage.setItem('bliss_legal', JSON.stringify(draftLegal));
    localStorage.setItem('bliss_ai_enabled', JSON.stringify(draftAIEnabled));
    
    setSavedPhotos(draftPhotos);
    setSavedServices(draftServices);
    setSavedTheme(draftTheme);
    setSavedBank(draftBank);
    setSavedInfo(draftInfo);
    setSavedFAQ(draftFAQ);
    setSavedPolicies(draftPolicies);
    setSavedLegal(draftLegal);
    setSavedAIEnabled(draftAIEnabled);
    
    alert("Salon settings updated successfully!");
  };

  const handleCancelDraft = () => {
    setDraftPhotos(savedPhotos);
    setDraftServices(savedServices);
    setDraftTheme(savedTheme);
    setDraftBank(savedBank);
    setDraftInfo(savedInfo);
    setDraftFAQ(savedFAQ);
    setDraftPolicies(savedPolicies);
    setDraftLegal(savedLegal);
    setDraftAIEnabled(savedAIEnabled);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("ARE YOU SURE? This will permanently erase your custom photos, prices, policies, and restore the studio to its original design and structure.")) {
      setDraftPhotos([]);
      setDraftServices(INITIAL_SERVICES);
      setDraftTheme(THEME_PRESETS.original);
      setDraftBank(DEFAULT_BANK);
      setDraftInfo(DEFAULT_INFO);
      setDraftFAQ(DEFAULT_FAQ);
      setDraftPolicies(DEFAULT_POLICIES);
      setDraftLegal(DEFAULT_LEGAL);
      setDraftAIEnabled(true);
      
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleLogin = (pin: string) => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setTimeout(() => {
      adminPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleLogout = () => {
    if (hasChanges && !window.confirm("Unsaved changes will be lost. Logout?")) return;
    setIsAdmin(false);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (href === '#' || href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToPortfolioTop = () => {
    setShowAllPortfolio(false);
    const element = document.getElementById('portfolio');
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleZipBundle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBundling(true);
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const fileItems: FileItem[] = [];

      const extractionPromises: Promise<void>[] = [];
      loadedZip.forEach((filename, zipFile) => {
        if (!zipFile.dir) {
          extractionPromises.push(
            zipFile.async('string').then(content => {
              fileItems.push({ id: filename, name: filename, content });
            })
          );
        }
      });
      await Promise.all(extractionPromises);

      const entry = fileItems.find(f => f.name.toLowerCase().endsWith('index.html'));
      if (!entry) throw new Error("No index.html found in ZIP.");

      const singleHtml = await bundleFiles(fileItems, entry.id);
      
      const blob = new Blob([singleHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bundled_${file.name.replace('.zip', '')}.html`;
      link.click();
    } catch (err: any) {
      alert("Bundling failed: " + err.message);
    } finally {
      setBundling(false);
      e.target.value = '';
    }
  };

  const ServiceList = ({ title, items }: { title: string, items: { name: string, price: string }[] }) => (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-6 serif border-b border-[var(--theme-border)] pb-2 italic" style={{ color: 'var(--theme-primary)' }}>{title}</h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center group">
            <span className="font-medium text-sm md:text-base" style={{ color: 'var(--theme-text-main)' }}>{item.name}</span>
            <span className="font-bold text-sm md:text-base" style={{ color: 'var(--theme-accent)' }}>{item.price}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs italic opacity-30">No items in this category.</p>}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--theme-bg-main)', color: 'var(--theme-text-main)', transition: 'background-color 0.5s ease, color 0.5s ease' }} className="min-h-screen overflow-x-hidden">
      {isAdmin && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-stone-700 pr-6 text-white">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Owner Mode</span>
            </div>
            <button onClick={handleLogout} className="text-[var(--theme-accent)] hover:brightness-125 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Log Out</button>
          </div>
        </div>
      )}

      {isAdmin && hasChanges && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white/95 backdrop-blur-2xl border p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-stone-900" style={{ borderColor: 'var(--theme-border)' }}>
            <div className="text-center md:text-left">
              <p className="font-bold text-sm">Unsaved Changes</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-stone-600">Edits are pending confirmation</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleCancelDraft} className="px-6 py-3 text-stone-600 font-bold text-[10px] uppercase tracking-widest hover:text-stone-900">Discard</button>
              <button onClick={handleSaveChanges} className="text-white px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg" style={{ backgroundColor: 'var(--theme-primary)' }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      
      <main id="root-content">
        <Hero />

        {/* --- Portfolio --- */}
        <section ref={portfolioRef} id="portfolio" className="py-24 overflow-hidden scroll-mt-20" style={{ backgroundColor: 'var(--theme-bg-surface)' }}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.5em] mb-4 block" style={{ color: 'var(--theme-accent)' }}>Latest Work</span>
            <h2 className="text-5xl md:text-7xl font-bold serif italic mb-16">Portfolio</h2>
            {savedPhotos.length > 0 ? (
              <>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {(showAllPortfolio ? savedPhotos : savedPhotos.slice(0, 5)).map((photo, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-[2.5rem] border shadow-sm hover:shadow-2xl transition-all duration-200" style={{ borderColor: 'var(--theme-border)' }}>
                      <img src={photo} alt="Art" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
                
                {savedPhotos.length > 5 && (
                  <div ref={portfolioBottomRef} className="mt-16 max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-full h-[1.5px] bg-[var(--theme-primary)] line-glow opacity-30 rounded-full"></div>
                      <div className="py-6 flex items-center justify-center">
                          {!showAllPortfolio ? (
                            <button 
                              onClick={() => setShowAllPortfolio(true)}
                              className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60 hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                            >
                              Show All Masterpieces
                            </button>
                          ) : (
                            <button 
                              onClick={scrollToPortfolioTop}
                              className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60 hover:opacity-100 transition-all border-none bg-transparent cursor-pointer animate-in fade-in duration-75"
                            >
                              Back to Top
                            </button>
                          )}
                      </div>
                      <div className="w-full h-[1.5px] bg-[var(--theme-primary)] line-glow opacity-30 rounded-full"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 border-2 border-dashed rounded-3xl opacity-50 italic" style={{ borderColor: 'var(--theme-border)' }}>Portfolio empty</div>
            )}
          </div>
        </section>

        {/* --- OWNER CONTROL CENTER --- */}
        {isAdmin && (
          <section ref={adminPanelRef} id="admin-panel" className="py-20 bg-stone-900 text-white scroll-mt-20 border-y border-stone-800">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-12">
                <span className="text-[var(--theme-accent)] text-xs font-bold uppercase tracking-[0.4em] mb-2 block">Manager Hub</span>
                <h2 className="text-4xl font-bold serif italic">Salon Control Centre</h2>
              </div>
              
              <div className="flex flex-wrap bg-stone-800 p-1 rounded-2xl gap-1 mb-12">
                {(['portfolio', 'services', 'theme', 'policies', 'contact', 'settings'] as const).map(tab => (
                  <button key={tab} onClick={() => setAdminTab(tab)} className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${adminTab === tab ? 'text-white shadow-lg' : 'text-stone-400 hover:text-white'}`} style={{ backgroundColor: adminTab === tab ? 'var(--theme-primary)' : 'transparent' }}>
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {adminTab === 'portfolio' && (
                <PhotoUpload photos={draftPhotos} onUpload={(newPhotos) => setDraftPhotos(prev => [...prev, ...newPhotos])} onDelete={(index) => setDraftPhotos(prev => prev.filter((_, i) => i !== index))} />
              )}

              {adminTab === 'theme' && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Object.values(THEME_PRESETS).map(preset => (
                    <button 
                      key={preset.id} 
                      onClick={() => setDraftTheme(preset)}
                      className={`relative p-6 rounded-[2rem] border-2 transition-all text-left group ${draftTheme.id === preset.id ? 'bg-stone-800 shadow-2xl scale-105' : 'border-stone-800 bg-stone-900/50 hover:border-stone-700'}`}
                      style={{ borderColor: draftTheme.id === preset.id ? 'var(--theme-accent)' : '#292524' }}
                    >
                      <h3 className="text-lg font-bold serif italic mb-3">{preset.name}</h3>
                      <div className="flex gap-1.5 mb-5">
                        <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.primary }}></div>
                        <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.accent }}></div>
                        <div className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: preset.colors.bgMain }}></div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block`} style={{ color: draftTheme.id === preset.id ? 'var(--theme-accent)' : '#57534e' }}>
                        {draftTheme.id === preset.id ? '✓ Current Theme' : 'Select Atmosphere'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {adminTab === 'services' && (
                <div className="grid md:grid-cols-2 gap-12">
                    {Object.keys(draftServices).map(groupKey => (
                        <div key={groupKey} className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold serif italic capitalize" style={{ color: 'var(--theme-accent)' }}>{groupKey.replace(/([A-Z])/g, ' $1')}</h3>
                                <button onClick={() => setDraftServices((prev: any) => ({...prev, [groupKey]: [...prev[groupKey], {name:'New', price:'R0'}]}))} className="text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest hover:brightness-125 transition-all" style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>+ Add</button>
                            </div>
                            <div className="space-y-4">
                                {draftServices[groupKey].map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center bg-stone-900 p-4 rounded-2xl border border-stone-800">
                                        <input value={item.name} onChange={(e) => { const upd = [...draftServices[groupKey]]; upd[idx].name = e.target.value; setDraftServices({...draftServices, [groupKey]: upd}); }} className="bg-transparent border-b border-stone-700 focus:border-[var(--theme-accent)] outline-none text-sm flex-1 font-medium py-1" />
                                        <input value={item.price} onChange={(e) => { const upd = [...draftServices[groupKey]]; upd[idx].price = e.target.value; setDraftServices({...draftServices, [groupKey]: upd}); }} className="bg-stone-800 px-3 py-1 rounded-lg font-bold outline-none text-xs w-20 text-center" style={{ color: 'var(--theme-accent)' }} />
                                        <button onClick={() => setDraftServices({...draftServices, [groupKey]: draftServices[groupKey].filter((_:any, i:number) => i !== idx)})} className="text-red-500/30 hover:text-red-500 transition-colors p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {adminTab === 'policies' && (
                <div className="space-y-12">
                  <div className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold serif italic" style={{ color: 'var(--theme-accent)' }}>Salon Guidelines</h3>
                      <button onClick={() => setDraftPolicies([...draftPolicies, { title: 'New Policy', subtitle: '', desc: 'Description' }])} className="text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest bg-[var(--theme-primary)]">Add Guideline</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {draftPolicies.map((p: any, idx: number) => (
                        <div key={idx} className="bg-stone-900 p-6 rounded-2xl space-y-3">
                          <input value={p.title} onChange={(e) => { const n = [...draftPolicies]; n[idx].title = e.target.value; setDraftPolicies(n); }} placeholder="Title" className="w-full bg-stone-800 rounded px-3 py-2 text-sm" />
                          <input value={p.subtitle} onChange={(e) => { const n = [...draftPolicies]; n[idx].subtitle = e.target.value; setDraftPolicies(n); }} placeholder="Subtitle (optional)" className="w-full bg-stone-800 rounded px-3 py-2 text-xs" />
                          <textarea value={p.desc} onChange={(e) => { const n = [...draftPolicies]; n[idx].desc = e.target.value; setDraftPolicies(n); }} placeholder="Description" className="w-full bg-stone-800 rounded px-3 py-2 text-xs h-20" />
                          <button onClick={() => setDraftPolicies(draftPolicies.filter((_: any, i: number) => i !== idx))} className="text-red-500 text-[10px] uppercase font-bold">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold serif italic" style={{ color: 'var(--theme-accent)' }}>FAQs</h3>
                      <button onClick={() => setDraftFAQ([...draftFAQ, { q: 'Question?', a: 'Answer' }])} className="text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest bg-[var(--theme-primary)]">Add FAQ</button>
                    </div>
                    <div className="space-y-4">
                      {draftFAQ.map((f: any, idx: number) => (
                        <div key={idx} className="bg-stone-900 p-6 rounded-2xl space-y-3">
                          <input value={f.q} onChange={(e) => { const n = [...draftFAQ]; n[idx].q = e.target.value; setDraftFAQ(n); }} placeholder="Question" className="w-full bg-stone-800 rounded px-3 py-2 text-sm" />
                          <textarea value={f.a} onChange={(e) => { const n = [...draftFAQ]; n[idx].a = e.target.value; setDraftFAQ(n); }} placeholder="Answer" className="w-full bg-stone-800 rounded px-3 py-2 text-xs h-20" />
                          <button onClick={() => setDraftFAQ(draftFAQ.filter((_: any, i: number) => i !== idx))} className="text-red-500 text-[10px] uppercase font-bold">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                    <h3 className="text-xl font-bold serif italic mb-6" style={{ color: 'var(--theme-accent)' }}>Legal Content</h3>
                    <div className="grid md:grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">Terms of Service</h4>
                        <div className="space-y-4">
                          {draftLegal.terms.map((s: any, idx: number) => (
                            <div key={idx} className="bg-stone-900 p-4 rounded-xl space-y-2">
                              <input value={s.h} onChange={(e) => { const n = {...draftLegal}; n.terms[idx].h = e.target.value; setDraftLegal(n); }} placeholder="Heading" className="w-full bg-stone-800 rounded px-2 py-1 text-xs" />
                              <textarea value={s.p} onChange={(e) => { const n = {...draftLegal}; n.terms[idx].p = e.target.value; setDraftLegal(n); }} placeholder="Paragraph" className="w-full bg-stone-800 rounded px-2 py-1 text-[10px] h-20" />
                              <button onClick={() => { const n = {...draftLegal}; n.terms = n.terms.filter((_:any, i:number) => i !== idx); setDraftLegal(n); }} className="text-red-500 text-[9px] uppercase font-bold">Remove Section</button>
                            </div>
                          ))}
                          <button onClick={() => { const n = {...draftLegal}; n.terms.push({ h: 'Heading', p: 'Content' }); setDraftLegal(n); }} className="text-[9px] font-bold uppercase p-2 border border-stone-700 w-full rounded">Add Section</button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">Privacy Policy</h4>
                        <div className="space-y-4">
                          {draftLegal.privacy.map((s: any, idx: number) => (
                            <div key={idx} className="bg-stone-900 p-4 rounded-xl space-y-2">
                              <input value={s.h} onChange={(e) => { const n = {...draftLegal}; n.privacy[idx].h = e.target.value; setDraftLegal(n); }} placeholder="Heading" className="w-full bg-stone-800 rounded px-2 py-1 text-xs" />
                              <textarea value={s.p} onChange={(e) => { const n = {...draftLegal}; n.privacy[idx].p = e.target.value; setDraftLegal(n); }} placeholder="Paragraph" className="w-full bg-stone-800 rounded px-2 py-1 text-[10px] h-20" />
                              <button onClick={() => { const n = {...draftLegal}; n.privacy = n.privacy.filter((_:any, i:number) => i !== idx); setDraftLegal(n); }} className="text-red-500 text-[9px] uppercase font-bold">Remove Section</button>
                            </div>
                          ))}
                          <button onClick={() => { const n = {...draftLegal}; n.privacy.push({ h: 'Heading', p: 'Content' }); setDraftLegal(n); }} className="text-[9px] font-bold uppercase p-2 border border-stone-700 w-full rounded">Add Section</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'contact' && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                    <h3 className="text-xl font-bold serif italic mb-6" style={{ color: 'var(--theme-accent)' }}>Socials & Contact</h3>
                    <div className="space-y-6">
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">WhatsApp Number (No space)</label><input value={draftInfo.whatsapp} onChange={(e) => setDraftInfo({...draftInfo, whatsapp: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Public Phone Number</label><input value={draftInfo.phone} onChange={(e) => setDraftInfo({...draftInfo, phone: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">TikTok Username</label><input value={draftInfo.tiktok} onChange={(e) => setDraftInfo({...draftInfo, tiktok: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Instagram Username</label><input value={draftInfo.instagram} onChange={(e) => setDraftInfo({...draftInfo, instagram: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Facebook URL</label><input value={draftInfo.facebook} onChange={(e) => setDraftInfo({...draftInfo, facebook: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                    </div>
                  </div>

                  <div className="bg-stone-800/50 p-8 rounded-[2.5rem] border border-stone-800">
                    <h3 className="text-xl font-bold serif italic mb-6" style={{ color: 'var(--theme-accent)' }}>Working Hours</h3>
                    <div className="space-y-4">
                      {draftInfo.hours.map((h: any, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input value={h.day} onChange={(e) => { const n = {...draftInfo}; n.hours[idx].day = e.target.value; setDraftInfo(n); }} className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs" />
                          <input value={h.time} onChange={(e) => { const n = {...draftInfo}; n.hours[idx].time = e.target.value; setDraftInfo(n); }} className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs" />
                          <button onClick={() => { const n = {...draftInfo}; n.hours = n.hours.filter((_:any, i:number) => i !== idx); setDraftInfo(n); }} className="text-red-500 text-[10px] px-2 font-bold">×</button>
                        </div>
                      ))}
                      <button onClick={() => { const n = {...draftInfo}; n.hours.push({ day: 'Day', time: 'Time' }); setDraftInfo(n); }} className="text-[9px] font-bold uppercase p-2 border border-stone-700 w-full rounded">Add Row</button>
                    </div>

                    <h3 className="text-xl font-bold serif italic mt-10 mb-6" style={{ color: 'var(--theme-accent)' }}>Bank Details</h3>
                    <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Bank Name</label><input value={draftBank.bankName} onChange={(e) => setDraftBank({...draftBank, bankName: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Account Number</label><input value={draftBank.accountNumber} onChange={(e) => setDraftBank({...draftBank, accountNumber: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                      <div><label className="text-[10px] uppercase font-bold text-stone-500">Verify/WhatsApp Number</label><input value={draftBank.proofNumber} onChange={(e) => setDraftBank({...draftBank, proofNumber: e.target.value})} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm" /></div>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === 'settings' && (
                <div className="max-w-md mx-auto space-y-8">
                  <div className="bg-stone-800/50 p-10 rounded-[2.5rem] border border-stone-800 text-center">
                    <h3 className="text-2xl font-bold serif italic mb-4" style={{ color: 'var(--theme-accent)' }}>Project Bundler Tool</h3>
                    <p className="text-stone-400 mb-10 italic text-sm">Upload a ZIP file containing HTML/CSS/JS to convert it into a single standalone HTML file.</p>
                    
                    <label className={`cursor-pointer inline-flex items-center gap-3 px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${bundling ? 'opacity-50 pointer-events-none' : 'hover:scale-105 shadow-xl'}`} style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>
                      {bundling ? 'Processing Bundle...' : 'Select ZIP Project'}
                      <input type="file" accept=".zip" onChange={handleZipBundle} className="hidden" disabled={bundling} />
                    </label>
                  </div>

                  <div className="bg-stone-800/50 p-10 rounded-[2.5rem] border border-stone-800 text-center">
                    <h3 className="text-2xl font-bold serif italic mb-8" style={{ color: 'var(--theme-accent)' }}>AI Assistant Settings</h3>
                    <div className="flex items-center justify-between gap-6 p-6 bg-stone-900 rounded-3xl border border-stone-800">
                      <div className="text-left">
                        <p className="font-bold">Bliss AI Chatbot</p>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Show floating assistant on site</p>
                      </div>
                      <button 
                        onClick={() => setDraftAIEnabled(!draftAIEnabled)}
                        className={`w-16 h-8 rounded-full relative transition-all ${draftAIEnabled ? 'bg-green-500' : 'bg-stone-700'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${draftAIEnabled ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-stone-800/50 p-10 rounded-[2.5rem] border border-stone-800 text-center">
                    <h3 className="text-2xl font-bold serif italic mb-4" style={{ color: '#ef4444' }}>Factory Restore</h3>
                    <p className="text-xs text-stone-400 mb-8 italic">Reset all services, themes, and portfolio content back to the original studio configuration. This action cannot be undone.</p>
                    <button 
                      onClick={handleRestoreDefaults}
                      className="w-full py-4 rounded-2xl border-2 border-[#ef4444] text-[#ef4444] font-black uppercase tracking-widest text-[10px] hover:bg-[#ef4444] hover:text-white transition-all active:scale-95 shadow-xl"
                    >
                      Restore to Original Design
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- Public Services --- */}
        <section id="services" className="pt-52 pb-24 relative overflow-hidden scroll-mt-24">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-bold serif italic">Price List</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-x-20 gap-y-12">
              <div className="space-y-12">
                <ServiceList title="Plain Nails" items={savedServices.plainNails} />
                <ServiceList title="French / Ombré" items={savedServices.frenchOmbre} />
                <ServiceList title="Plain Poly Gel" items={savedServices.polyGel} />
              </div>
              <div className="space-y-12">
                <ServiceList title="Extras" items={savedServices.extras} />
                <ServiceList title="Additions" items={savedServices.additions} />
                <div className="p-10 rounded-[2.5rem] text-center mt-12 shadow-xl border-4" style={{ backgroundColor: 'var(--theme-primary)', color: 'white', borderColor: 'var(--theme-border)' }}>
                  <h4 className="text-xl font-bold serif mb-6 italic opacity-80">Deposit Payment</h4>
                  <div className="space-y-4">
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Bank</p>
                      <p className="text-lg font-black uppercase tracking-[0.1em]">{savedBank.bankName}</p>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Account Number</p>
                      <p className="text-2xl font-black tracking-tighter">{savedBank.accountNumber}</p>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Verify at Number</p>
                      <p className="text-xl font-black tracking-tighter">{savedBank.proofNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Location Section --- */}
        <section id="location" className="py-32 scroll-mt-20 overflow-hidden" style={{ backgroundColor: 'var(--theme-bg-main)' }}>
          <div className="max-w-2xl mx-auto px-8 text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-6 mb-12">
              <svg className="w-20 h-20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-left -ml-2">
                <p className="text-4xl md:text-5xl font-bold serif italic leading-none mb-2" style={{ color: 'var(--theme-text-main)' }}>Find</p>
                <h2 className="text-7xl md:text-9xl font-bold serif italic leading-none bg-clip-text text-transparent bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, var(--theme-text-main), var(--theme-accent))` }}>Bliss</h2>
              </div>
            </div>
            <div className="w-full max-w-md border-t-2 border-stone-200/60 mb-8 opacity-60"></div>
            <div className="mb-10 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">Physical Address</p>
              <p className="text-2xl font-bold serif italic text-stone-800">412 Finetown, Grasmere, 1828</p>
            </div>
            <div className="mb-2">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Business hours</p>
            </div>
            <div className="w-full max-w-md border-t-2 border-stone-200/60 mb-8 opacity-60"></div>
            <div className="mb-10 w-full space-y-4">
              {savedInfo.hours.map((h:any, i:number) => (
                <div key={i}>
                  <p className={`font-bold serif italic text-stone-800 ${i === 0 ? 'text-2xl' : 'text-xl'}`}>{h.day}: {h.time}</p>
                </div>
              ))}
            </div>
            <div className="w-full max-w-md border-t-2 border-stone-200/60 mb-8 opacity-60"></div>
            <div className="mb-14 w-full px-4">
              <p className="text-[12px] text-stone-500 font-bold italic tracking-wide">Public Holidays open: appointment recommended</p>
            </div>
            <div className="flex flex-col items-center gap-8">
              <a 
                href={MAPS_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-4 px-12 py-5 rounded-full border border-stone-800 font-bold text-[11px] uppercase tracking-widest group bg-[var(--theme-bg-surface)] text-stone-800 hover:bg-stone-900 hover:text-white active:bg-stone-950 active:text-white transition-[background-color,color,transform] duration-75 active:scale-95" 
                style={{ boxShadow: '0 10px 40px -10px var(--theme-primary)', outline: 'none' }}
              >
                <svg className="w-5 h-5 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                Get Directions
              </a>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black italic opacity-40">All appointments must be confirmed prior to arrival</p>
            </div>
          </div>
        </section>

        <div id="booking" className="scroll-mt-24">
          <BookingForm customServices={savedServices} bankDetails={savedBank} />
        </div>
        
        <div id="policies" className="scroll-mt-24">
          <SalonPolicies policies={savedPolicies} />
        </div>
        
        <div id="faq" className="scroll-mt-24">
          <FAQSection faqs={savedFAQ} />
        </div>
      </main>

      {/* --- RIGHT FLOATING ACTION BUTTONS --- */}
      <div className="fixed bottom-5 right-4 z-[60] flex flex-col gap-6 items-end">
        {savedPhotos.length > 5 && (
          <button 
            onClick={scrollToPortfolioTop}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 ${showPortfolioSideArrow && !isNearPortfolioBottom ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-12 opacity-0 scale-50 pointer-events-none'}`}
            style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}
            aria-label="Back to Portfolio Top"
          >
            <svg className="w-6 h-6 animate-float-up-down" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        )}

        {savedAIEnabled && (
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-stone-100 transition-all duration-300 hover:scale-110 active:scale-90 group"
            aria-label="Open Bliss AI Chat"
          >
            <svg className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>
        )}

        <a 
          href={`https://wa.me/${savedInfo.whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-stone-100 transition-all duration-300 hover:scale-110 active:scale-90 group" 
          aria-label="Contact via WhatsApp"
        >
          <WhatsAppIcon className="w-8 h-8" style={{ color: '#25D366' }} />
        </a>
      </div>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLogin={handleLogin} />
      <LegalModal isOpen={legalModal.isOpen} onClose={() => setLegalModal({ ...legalModal, isOpen: false })} type={legalModal.type} legalData={savedLegal} />

      {/* --- FOOTER --- */}
      <footer className="py-24 text-stone-400 bg-[#0c0a09] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-stone-900 pb-12">
               <div className="flex items-center gap-6">
                  <BrandLogo className="w-16 h-16 text-white opacity-80" />
                  <div>
                    <h3 className="text-4xl font-bold serif italic mb-2 text-white">BlissBeautyByKamo<span className="text-[var(--theme-accent)]">.</span></h3>
                    <p className="text-stone-500 leading-relaxed text-sm max-w-xl">Finetown's premier destination for luxury nail artistry. Specializing in high-end Poly Gel, signature French tips, and bespoke 3D art by Kamo.</p>
                  </div>
               </div>
               <div className="flex flex-wrap gap-6 mt-6 md:mt-0">
                  {savedInfo.tiktok && (
                    <div className="flex items-center gap-3">
                      <TikTokIcon className="w-5 h-5 text-white" />
                      <a href={`https://tiktok.com/@${savedInfo.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:opacity-70 transition-opacity">TikTok</a>
                    </div>
                  )}
                  {savedInfo.instagram && (
                    <div className="flex items-center gap-3">
                      <InstagramIcon className="w-5 h-5 text-white" />
                      <a href={`https://www.instagram.com/${savedInfo.instagram}/`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:opacity-70 transition-opacity">Instagram</a>
                    </div>
                  )}
                  {savedInfo.facebook && (
                    <div className="flex items-center gap-3">
                      <FacebookIcon className="w-5 h-5 text-white" />
                      <a href={savedInfo.facebook} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:opacity-70 transition-opacity">Facebook</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <WhatsAppIcon className="w-5 h-5 text-white" />
                    <a href={`https://wa.me/${savedInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:opacity-70 transition-opacity">WhatsApp</a>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white">Navigation</h4>
                <ul className="space-y-3">
                  {NAVIGATION.map((item) => (
                    <li key={item.name}><a href={item.href} onClick={(e) => handleScroll(e, item.href)} className="text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">{item.name}</a></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white">Contact Us</h4>
                <div className="space-y-2 text-sm opacity-60">
                  <p className="font-medium text-white">{savedInfo.phone}</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mt-2">Available Mon - Sat</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white">Location</h4>
                <p className="text-sm opacity-60 leading-relaxed">412 Finetown, Grasmere, 1828<br />Gauteng, South Africa</p>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-white">Legal</h4>
                <div className="flex flex-col gap-4 text-[9px] font-black uppercase tracking-[0.2em]">
                  <button onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })} className="text-left hover:text-white transition-colors opacity-60">Privacy Policy</button>
                  <button onClick={() => setLegalModal({ isOpen: true, type: 'terms' })} className="text-left hover:text-white transition-colors opacity-60">Terms of Service</button>
                  <button onClick={() => setShowAdminLogin(true)} className="text-left hover:text-white transition-colors opacity-60">Owner Login</button>
                </div>
              </div>
            </div>

            <div className="pt-16 border-t border-stone-900 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-40 italic text-white">© {new Date().getFullYear()} BlissBeautyByKamo. All Rights Reserved. Precision Artistry</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
