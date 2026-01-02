export function setFavicon(logoUrl: string | null | undefined, storeName?: string) {
  let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  if (logoUrl) {
    faviconLink.href = logoUrl;
    faviconLink.type = 'image/png';
    return;
  }

  if (storeName) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 64, 64);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#14b8a6');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(0, 0, 64, 64, 12);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(storeName[0].toUpperCase(), 32, 34);
      
      faviconLink.href = canvas.toDataURL('image/png');
      faviconLink.type = 'image/png';
    }
  }
}

export function getFaviconUrl(logoUrl: string | null | undefined): string | null {
  return logoUrl || null;
}
