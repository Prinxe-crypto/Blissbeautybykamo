
import { ThemeConfig } from './types';

export const SERVICE_GROUPS = {
  plainNails: [
    { name: 'Short Plain Nails', price: 'R150' },
    { name: 'Medium Plain Nails', price: 'R180' },
    { name: 'Medium Long Nails', price: 'R210' },
    { name: 'Xlong Plain Nails', price: 'R250' }
  ],
  frenchOmbre: [
    { name: 'Short French', price: 'R170' },
    { name: 'Medium French', price: 'R200' },
    { name: 'Medium Long French', price: 'R230' },
    { name: 'Extra Long French', price: 'R260' }
  ],
  polyGel: [
    { name: 'Short Nails', price: 'R150' },
    { name: 'Medium Nails', price: 'R180' },
    { name: 'Long Nails', price: 'R210' },
    { name: 'Xlong Nails', price: 'R250' }
  ],
  extras: [
    { name: 'Soak Off', price: 'R80' },
    { name: 'Plain Refill', price: 'R130' },
    { name: 'Gel X', price: 'R150' },
    { name: 'Plain Pedicure', price: 'R100' },
    { name: 'French Design Pedi', price: 'R120' }
  ],
  additions: [
    { name: 'Charms', price: 'R5' },
    { name: '3D Design per nail', price: 'R10' },
    { name: 'Bow ties per nail', price: 'R10' },
    { name: 'Butterflies per nail', price: 'R10' }
  ]
};

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  original: {
    id: 'original',
    name: 'Original Rose',
    colors: {
      primary: '#881337',    
      accent: '#e11d48',     
      bgMain: '#fafaf9',     
      bgSurface: '#ffffff',  
      textMain: '#1c1917',   
      textMuted: '#78716c',  
      border: '#ffe4e6'      
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Royal',
    colors: {
      primary: '#7e22ce',    
      accent: '#a855f7',     
      bgMain: '#09090b',     
      bgSurface: '#18181b',  
      textMain: '#fafafa',   
      textMuted: '#a1a1aa',  
      border: '#3b0764'      
    }
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Luxe',
    colors: {
      primary: '#6b21a8',    
      accent: '#9333ea',     
      bgMain: '#fdf4ff',     
      bgSurface: '#ffffff',  
      textMain: '#2e1065',   
      textMuted: '#7c3aed',  
      border: '#f5d0fe'      
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Gold',
    colors: {
      primary: '#064e3b',    
      accent: '#fbbf24',     
      bgMain: '#f0fdf4',     
      bgSurface: '#ffffff',  
      textMain: '#064e3b',   
      textMuted: '#059669',  
      border: '#dcfce7'      
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: {
      primary: '#9a3412',    
      accent: '#f97316',     
      bgMain: '#fffafb',     
      bgSurface: '#ffffff',  
      textMain: '#431407',   
      textMuted: '#ea580c',  
      border: '#ffedd5'      
    }
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Noir',
    colors: {
      primary: '#18181b',    
      accent: '#52525b',     
      bgMain: '#f4f4f5',     
      bgSurface: '#ffffff',  
      textMain: '#09090b',   
      textMuted: '#71717a',  
      border: '#e4e4e7'      
    }
  },
  oceanic: {
    id: 'oceanic',
    name: 'Oceanic Mist',
    colors: {
      primary: '#155e75',    
      accent: '#0891b2',     
      bgMain: '#f0f9ff',     
      bgSurface: '#ffffff',  
      textMain: '#164e63',   
      textMuted: '#0e7490',  
      border: '#cffafe'      
    }
  }
};

export const ALL_SERVICE_OPTIONS = [
  ...SERVICE_GROUPS.plainNails,
  ...SERVICE_GROUPS.frenchOmbre,
  ...SERVICE_GROUPS.polyGel,
  ...SERVICE_GROUPS.extras,
  ...SERVICE_GROUPS.additions
];

export const GALLERY_IMAGES = [
  { 
    id: 1,
    url: 'https://images.unsplash.com/photo-1604654894610-df490c9a7c0d?q=80&w=1000&auto=format', 
    category: 'Signature Art', 
    title: 'The Signature Stiletto',
    desc: 'Cherries, Leopard, and Gold Star artistry.'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1632345033839-230883ce6471?q=80&w=1000&auto=format',
    category: 'Minimalist',
    title: 'The Golden Minimalist',
    desc: 'Classic Square French with gold circle charm.'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1000&auto=format',
    category: '3D Floral',
    title: 'The Zesty Floral',
    desc: 'Orange square French with 3D blossoms.'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1600010041477-96a92ec42838?q=80&w=1000&auto=format',
    category: 'Marble',
    title: 'The Mocha Marble',
    desc: 'Almond tips with white 3D bows.'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format',
    category: 'Luxury',
    title: 'The Ruby Blossom',
    desc: 'Long square red French with 3D red flowers.'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1000&auto=format',
    category: 'Duo Set',
    title: 'The Sun-Kissed Duo',
    desc: 'Orange Stiletto hands and French toes.'
  }
];

export const NAVIGATION = [
  { name: 'Home', href: '#' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Prices', href: '#services' },
  { name: 'Directions', href: '#location' },
  { name: 'Book Now', href: '#booking' }
];

export const MAPS_LINK = "https://www.google.com/maps/place//data=!4m2!3m1!1s0x1e95abd33811b2bd:0x945506b54a0be106!11m1!4b1?entry=s&sa=X&ved=1t:8290&ictx=111#Intent;scheme=http;package=com.google.android.apps.maps;S.browser_fallback_url=https://www.google.com/maps/place//data=!4m2!3m1!1s0x1e95abd33811b2bd:0x945506b54a0be106!11m1!4b1?entry=s&sa=X&ved=2ahUKEwjYrvP3poiSAxW0YEEAHZf7BBEQ4kB6BAgEEAA;end";