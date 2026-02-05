
import JSZip from 'jszip';
import { ThemeConfig } from '../types';

export const exportStaticSite = async (
  services: any,
  theme: ThemeConfig,
  photos: string[],
  info: any,
  bank: any,
  policies: any[],
  faq: any[]
) => {
  const zip = new JSZip();

  // 1. Create Style.css
  const cssContent = `
:root {
  --theme-primary: ${theme.colors.primary};
  --theme-accent: ${theme.colors.accent};
  --theme-bg-main: ${theme.colors.bgMain};
  --theme-bg-surface: ${theme.colors.bgSurface};
  --theme-text-main: ${theme.colors.textMain};
  --theme-text-muted: ${theme.colors.textMuted};
  --theme-border: ${theme.colors.border};
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--theme-bg-main);
  color: var(--theme-text-main);
  margin: 0;
  scroll-behavior: smooth;
}

h1, h2, h3, .serif {
  font-family: 'Playfair Display', serif;
}

.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

/* Add critical animation styles */
@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.animate-float { animation: floatUpDown 1.8s ease-in-out infinite; }
`;
  zip.file("css/style.css", cssContent);

  // 2. Create Data.js (The dynamic content)
  const dataJs = `
window.SALON_DATA = {
  services: ${JSON.stringify(services)},
  info: ${JSON.stringify(info)},
  bank: ${JSON.stringify(bank)},
  policies: ${JSON.stringify(policies)},
  faq: ${JSON.stringify(faq)},
  photos: ${JSON.stringify(photos)}
};
`;
  zip.file("js/data.js", dataJs);

  // 3. Create Main.js (Simple logic for non-React static site)
  const mainJs = `
document.addEventListener('DOMContentLoaded', () => {
  console.log('BlissBeauty Static Engine Initialized');
  // Add basic interactions like mobile menu or FAQ toggles here
});
`;
  zip.file("js/main.js", mainJs);

  // 4. Create index.html (Standard structure)
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlissBeautyByKamo | Luxury Nail Artistry</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-stone-50">
    <header class="p-6 sticky top-0 z-50 glass border-b" style="border-color: var(--theme-border)">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold serif italic">BlissBeautyByKamo</h1>
        <nav class="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest">
          <a href="#portfolio">Portfolio</a>
          <a href="#services">Prices</a>
          <a href="#location">Location</a>
          <a href="https://wa.me/${info.whatsapp}" class="text-[var(--theme-primary)]">Book Now</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="py-32 text-center">
        <h2 class="text-7xl font-bold serif italic mb-4">Precision Artistry</h2>
        <p class="italic opacity-60">Hand-crafted by Kamo</p>
      </section>

      <section id="portfolio" class="py-20 px-6 max-w-7xl mx-auto">
        <h3 class="text-center text-4xl font-bold serif italic mb-12">Latest Work</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${photos.map(p => `<img src="${p}" class="w-full aspect-square object-cover rounded-2xl shadow-sm">`).join('')}
        </div>
      </section>

      <section id="services" class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-6">
          <h3 class="text-center text-4xl font-bold serif italic mb-12">Price List</h3>
          <!-- Dynamic services rendering would happen here or be pre-rendered -->
        </div>
      </section>
    </main>

    <footer class="py-20 bg-stone-900 text-white text-center">
      <p class="text-[10px] font-bold uppercase tracking-[0.3em]">&copy; ${new Date().getFullYear()} BlissBeautyByKamo</p>
    </footer>

    <script src="js/data.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
`;
  zip.file("index.html", htmlContent);

  // Generate ZIP
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = `blissbeauty_export_${Date.now()}.zip`;
  link.click();
  URL.revokeObjectURL(url);
};
