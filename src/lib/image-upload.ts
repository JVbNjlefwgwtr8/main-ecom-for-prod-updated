/**
 * Client-side image upload utility for ImageKit
 */

export interface UploadResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  url?: string;
  filePath?: string;
  fileType?: string;
  height?: number;
  width?: number;
  error?: string;
}

/**
 * Upload image to ImageKit via API
 * @param file - Image file to upload
 * @param folder - Folder type: 'logos', 'products', 'heroes'
 * @param store_id - Store ID
 * @returns Upload response with image URL
 */
export async function uploadImageToImageKit(
  file: File,
  folder: 'logos' | 'products' | 'heroes',
  store_id: string
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('folder', folder);
    formData.append('store_id', store_id);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Upload failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      ...data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Convert File to base64 for preview before upload
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true };
}
