import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { createAuthenticatedClient } from '@/lib/supabase';

// Helper to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Product ID is required'),
        { status: 400 }
      );
    }

    // Get auth token from request
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        errorResponse('Unauthorized - no auth token'),
        { status: 401 }
      );
    }

    const body = await request.json();

    // Use authenticated client to respect RLS policies
    const authenticatedClient = createAuthenticatedClient(token);

    const { data, error } = await authenticatedClient
      .from('products')
      .update(body)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update product error:', error);
      return NextResponse.json(
        errorResponse(error.message || 'Failed to update product'),
        { status: 400 }
      );
    }

    return NextResponse.json(successResponse({ product: data?.[0] }));
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to update product'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    
    if (!id) {
      return NextResponse.json(
        errorResponse('Product ID is required'),
        { status: 400 }
      );
    }

    // Get auth token from request
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        errorResponse('Unauthorized - no auth token'),
        { status: 401 }
      );
    }

    // Use authenticated client to respect RLS policies
    const authenticatedClient = createAuthenticatedClient(token);

    const { error } = await authenticatedClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete product error:', error);
      return NextResponse.json(
        errorResponse(error.message || 'Failed to delete product'),
        { status: 400 }
      );
    }

    return NextResponse.json(successResponse({ success: true }));
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to delete product'),
      { status: 500 }
    );
  }
}
