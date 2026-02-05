import React from 'react';
import { BrandLogo } from '../App';

const Hero: React.FC = () => {
  const handleScrollToPrices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden" style={{ backgroundColor: 'var(--theme-bg-main)' }}>
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1604654894610-df490c9a7c0d?q=80&w=1920&auto=format&fit=crop" 
          alt="Luxury Signature Nail Art" 
          className="w-full h-full object-cover opacity-20 grayscale-[30%]"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--theme-bg-main) 95%, transparent)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-4xl animate-in fade-in slide-in-from-left-10 duration-1000 pt-12">
          <div className="mb-8 flex items-center gap-6">
            <BrandLogo className="w-16 h-16 opacity-80" style={{ color: 'var(--theme-primary)' }} />
            <div>
              <span className="block text-xl md:text-2xl serif italic bg-clip-text text-transparent bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, var(--theme-text-main), var(--theme-accent))` }}>
                Precision & 3D Artistry
              </span>
              <div className="h-[2.5px] w-40 mt-3 rounded-full" style={{ 
                backgroundImage: `linear-gradient(to right, var(--theme-text-main), var(--theme-accent))`
              }}></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-bold serif mb-8 italic leading-[1.4] tracking-tighter pt-20 pb-6 overflow-visible">
            BlissBeauty <br />
            <span className="relative inline-block py-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-br" style={{ 
                backgroundImage: `linear-gradient(to bottom right, var(--theme-text-main), var(--theme-accent))`
              }}>
                {"ByKamo".split("").map((char, i) => (
                  <span key={i} className="inline-block px-[0.02em]">{char}</span>
                ))}
              </span>
            </span>
          </h1>
          <p className="text-base md:text-lg mb-4 leading-relaxed max-w-lg italic" style={{ color: 'var(--theme-text-muted)' }}>
            From delicate 3D florals to bold stiletto statements, BlissBeautyByKamo turns every nail into a masterpiece
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <a 
          href="#services" 
          onClick={handleScrollToPrices}
          className="group flex flex-col items-center gap-3 transition-all duration-500 cursor-pointer no-underline" 
          aria-label="Scroll to Price List"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-150" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
            
            <div className="relative animate-bounce p-3 md:p-4 rounded-full bg-white/70 backdrop-blur-md border border-[var(--theme-border)] group-hover:bg-white shadow-xl transition-all duration-300">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.5em] font-black group-hover:opacity-100 transition-opacity duration-300 select-none opacity-60" style={{ color: 'var(--theme-primary)' }}>
            Price List
          </span>
        </a>
      </div>
    </section>
  );
};

export default Hero;