import ImageKit from 'imagekit';

let imagekit: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (!imagekit) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error('Missing ImageKit configuration. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT');
    }

    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }

  return imagekit;
}

/**
 * Generate ImageKit URL with optimizations
 * @param filePath - Path to file in ImageKit or full URL
 * @param transformation - Optional transformation parameters
 * @returns Optimized ImageKit URL or original URL if not from ImageKit
 */
export function getOptimizedImageUrl(
  filePath: string,
  transformation?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';
  
  if (!filePath) return '';
  
  // If it's a full URL and NOT from ImageKit, return as-is (old images, external CDNs, etc)
  if (filePath.startsWith('http')) {
    if (!baseUrl || !filePath.includes(baseUrl)) {
      // External URL or old format - don't try to optimize
      return filePath;
    }
  }
  
  // If filePath already contains optimization params, return as-is
  if (filePath.includes('?') || filePath.includes('/tr:')) {
    return filePath;
  }

  // If it's a relative path (ImageKit storage), build the full URL
  let url = filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
  
  if (transformation) {
    const params = new URLSearchParams();
    if (transformation.width) params.append('w', transformation.width.toString());
    if (transformation.height) params.append('h', transformation.height.toString());
    if (transformation.quality) params.append('q', transformation.quality.toString());
    if (transformation.format) params.append('f', transformation.format);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

/**
 * Get responsive image sources for srcset
 * @param filePath - Path to file in ImageKit
 * @returns Array of responsive image sources
 */
export function getResponsiveImageSources(filePath: string) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';
  
  if (!filePath) return [];

  return [
    { width: 320, url: getOptimizedImageUrl(filePath, { width: 320, quality: 75 }) },
    { width: 640, url: getOptimizedImageUrl(filePath, { width: 640, quality: 80 }) },
    { width: 1024, url: getOptimizedImageUrl(filePath, { width: 1024, quality: 85 }) },
    { width: 1280, url: getOptimizedImageUrl(filePath, { width: 1280, quality: 90 }) },
  ];
}
