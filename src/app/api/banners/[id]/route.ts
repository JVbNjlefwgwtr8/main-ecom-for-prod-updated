import { createAuthenticatedClient, TABLES } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - no auth token' },
        { status: 401 }
      );
    }

    const authenticatedClient = createAuthenticatedClient(token);
    const { id } = await props.params;
    const body = await request.json();

    const { data, error } = await authenticatedClient
      .from(TABLES.DISCOUNT_BANNERS)
      .update(body)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - no auth token' },
        { status: 401 }
      );
    }

    const authenticatedClient = createAuthenticatedClient(token);
    const { id } = await props.params;

    const { error } = await authenticatedClient
      .from(TABLES.DISCOUNT_BANNERS)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

