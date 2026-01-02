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
    const storeId = request.nextUrl.searchParams.get('store_id');

    if (!storeId) {
      return NextResponse.json(
        errorResponse('store_id is required'),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('store_id', storeId);

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to fetch categories'),
        { status: 400 }
      );
    }

    return NextResponse.json(successResponse(data || []));
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to fetch categories'),
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
    const { name, image_url, store_id } = await request.json();

    const { data, error } = await authenticatedClient
      .from(TABLES.CATEGORIES)
      .insert([{ name, image_url, store_id }])
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
    const { id, name, image_url } = await request.json();

    const { data, error } = await authenticatedClient
      .from(TABLES.CATEGORIES)
      .update({ name, image_url })
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
