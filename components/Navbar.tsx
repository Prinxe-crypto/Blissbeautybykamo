import React, { useState, useEffect } from 'react';
import { NAVIGATION } from '../constants';
import { BrandLogo } from '../App';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <BrandLogo className="w-8 h-8 transition-transform duration-500 group-hover:rotate-12" style={{ color: 'var(--theme-primary)' }} />
          <span className="text-xl md:text-2xl font-bold tracking-tighter serif" style={{ color: 'var(--theme-text-main)' }}>
            BlissBeauty<span className="italic font-normal" style={{ color: 'var(--theme-primary)' }}>ByKamo</span>
          </span>
        </a>
        
        <div className="hidden md:flex space-x-8 items-center">
          {NAVIGATION.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-[11px] uppercase tracking-widest font-bold transition-all duration-300 text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] hover:scale-105 hover:drop-shadow-sm inline-block"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;