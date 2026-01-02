import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { storeSlug, userId } = await request.json();

    if (!storeSlug || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Query the store to verify ownership
    const { data: store, error } = await supabaseServer
      .from('stores')
      .select('id, user_id, slug')
      .eq('slug', storeSlug)
      .single();

    if (error || !store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Check if the authenticated user is the owner of the store
    if (store.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You do not own this store' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User is the owner of this store' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying store ownership:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
