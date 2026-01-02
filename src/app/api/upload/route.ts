import { NextRequest, NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

/**
 * Upload image to ImageKit
 * Handles: logo, product images, hero images
 * Limits: Hero images to 1 per store, optimized for all
 */
export async function POST(request: NextRequest) {
  try {
    const imagekit = getImageKit();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folder = formData.get('folder') as string; // 'logos', 'products', 'heroes'
    const store_id = formData.get('store_id') as string;

    if (!file || !fileName || !folder || !store_id) {
      return NextResponse.json(
        { error: 'Missing required fields: file, fileName, folder, store_id' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const nodeBuffer = Buffer.from(uint8Array);

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${store_id}_${timestamp}_${fileName}`;
    const folderPath = `/ecom/${folder}/${store_id}`;

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: nodeBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
      isPrivateFile: false,
      tags: [folder, store_id, timestamp.toString()],
    });

    return NextResponse.json({
      success: true,
      fileId: response.fileId,
      fileName: response.name,
      url: response.url,
      filePath: response.filePath,
      fileType: response.fileType,
      height: response.height,
      width: response.width,
    });
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
