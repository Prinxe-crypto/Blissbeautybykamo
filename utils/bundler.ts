
import { FileItem } from '../types';

export const bundleFiles = async (
  files: FileItem[], 
  entryFileId: string,
  optimize: boolean = false
): Promise<string> => {
  const entryFile = files.find(f => f.id === entryFileId);
  if (!entryFile) throw new Error("Entry HTML file not found");

  let bundledContent = entryFile.content;

  // Helper to get file by path/name relative to current context
  const findFile = (path: string) => {
    const cleanPath = path.replace(/^\.\//, '');
    return files.find(f => f.name === cleanPath || f.name.endsWith('/' + cleanPath));
  };

  // 1. Process CSS files (Find and replace <link> tags)
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  bundledContent = bundledContent.replace(linkRegex, (match, href) => {
    const cssFile = findFile(href);
    if (cssFile) {
      // Also inline assets inside the CSS itself (like url() calls)
      let cssContent = cssFile.content;
      const urlRegex = /url\(["']?([^"']+)["']?\)/gi;
      cssContent = cssContent.replace(urlRegex, (urlMatch, urlPath) => {
        const assetFile = findFile(urlPath);
        return assetFile ? `url(${assetFile.content})` : urlMatch;
      });
      return `<style>/* Inlined from ${href} */\n${cssContent}</style>`;
    }
    return match;
  });

  // 2. Process JS files (Find and replace <script src="..."> tags)
  const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
  bundledContent = bundledContent.replace(scriptRegex, (match, src) => {
    const jsFile = findFile(src);
    return jsFile ? `<script>/* Inlined from ${src} */\n${jsFile.content}</script>` : match;
  });

  // 3. Process Images (Find and replace <img src="..."> tags)
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  bundledContent = bundledContent.replace(imgRegex, (match) => {
    return match.replace(/src=["']([^"']+)["']/, (srcMatch, src) => {
      const imgFile = findFile(src);
      return imgFile ? `src="${imgFile.content}"` : srcMatch;
    });
  });

  // Cleanup: If there are scripts or styles not caught by regex that we manually added to the list,
  // we could append them, but the above covers most standard structures.
  
  return bundledContent;
};
