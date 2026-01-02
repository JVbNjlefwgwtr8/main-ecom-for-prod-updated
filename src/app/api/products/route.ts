import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, createAuthenticatedClient, TABLES } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/api-utils';

// Helper to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function GET(request: NextRequest) {
  try {
    const storeSlug = request.nextUrl.searchParams.get('store_slug');
    const storeId = request.nextUrl.searchParams.get('store_id');

    let targetStoreId = storeId;

    if (!storeSlug && !storeId) {
      return NextResponse.json(
        errorResponse('store_slug or store_id is required'),
        { status: 400 }
      );
    }

    if (storeSlug && !storeId) {
      const { data: storeData, error: storeError } = await supabaseServer
        .from(TABLES.STORES)
        .select('id')
        .eq('slug', storeSlug)
        .single();

      if (storeError) {
        return NextResponse.json(
          errorResponse('Store not found'),
          { status: 404 }
        );
      }
      targetStoreId = storeData.id;
    }

    const { data, error } = await supabaseServer
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('store_id', targetStoreId);

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to fetch products'),
        { status: 400 }
      );
    }

    return NextResponse.json(successResponse(data || []));
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to fetch products'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        errorResponse('Unauthorized - no auth token'),
        { status: 401 }
      );
    }

    const authenticatedClient = createAuthenticatedClient(token);
    const { name, description, price, mrp, category, image_url, in_stock, store_id } = await request.json();

    const { data, error } = await authenticatedClient
      .from(TABLES.PRODUCTS)
      .insert([
        {
          name,
          description,
          price,
          mrp,
          category,
          image_url,
          in_stock,
          store_id,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ data: data[0], success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        errorResponse('Unauthorized - no auth token'),
        { status: 401 }
      );
    }

    const authenticatedClient = createAuthenticatedClient(token);
    const { id, name, description, price, mrp, category, image_url, in_stock } = await request.json();

    const { data, error } = await authenticatedClient
      .from(TABLES.PRODUCTS)
      .update({
        name,
        description,
        price,
        mrp,
        category,
        image_url,
        in_stock,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data: data[0], success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
