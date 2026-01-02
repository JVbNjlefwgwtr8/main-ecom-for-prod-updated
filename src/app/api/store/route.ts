import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, TABLES } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    const userId = request.nextUrl.searchParams.get('user_id');

    if (slug) {
      // Get store by slug (public - only safe data)
      const { data, error } = await supabaseServer
        .from(TABLES.STORES)
        .select('id, slug, name, logo_url, hero_text, hero_image, phone, showcase_email, features, upi_id, upi_enabled, show_category_images, image_display_mode, theme, bg_color, created_at, updated_at')
        .eq('slug', slug)
        .single();

      if (error) {
        return NextResponse.json(
          errorResponse('Store not found'),
          { status: 404 }
        );
      }

      return NextResponse.json(successResponse(data));
    } else if (userId) {
      // Get user's store (private - checks if user owns the store)
      const { data, error } = await supabaseServer
        .from(TABLES.STORES)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return NextResponse.json(
          errorResponse('Error fetching store'),
          { status: 400 }
        );
      }

      if (!data) {
        return NextResponse.json(successResponse(null));
      }

      return NextResponse.json(successResponse(data));
    } else {
      return NextResponse.json(
        errorResponse('slug or user_id parameter required'),
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Get store error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to fetch store'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, user_id } = body;

    if (!name || !slug || !user_id) {
      return NextResponse.json(
        errorResponse('Missing required fields'),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from(TABLES.STORES)
      .insert([
        {
          name,
          slug,
          description: description || '',
          user_id,
          logo_url: '',
          banner_url: '',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: 400 }
      );
    }

    return NextResponse.json(
      successResponse(data, 'Store created successfully'),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create store error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to create store'),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { store_id, name, logo_url, hero_text, hero_image, features, phone, showcase_email, upi_id, upi_enabled, show_category_images, image_display_mode, theme, bg_color } = body;

    if (!store_id) {
      return NextResponse.json(
        { error: 'store_id is required', success: false },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (hero_text !== undefined) updateData.hero_text = hero_text;
    if (hero_image !== undefined) updateData.hero_image = hero_image;
    if (features !== undefined) updateData.features = features;
    if (phone !== undefined) updateData.phone = phone;
    if (showcase_email !== undefined) updateData.showcase_email = showcase_email;
    if (upi_id !== undefined) updateData.upi_id = upi_id;
    if (upi_enabled !== undefined) updateData.upi_enabled = upi_enabled;
    if (show_category_images !== undefined) updateData.show_category_images = show_category_images;
    if (image_display_mode !== undefined) updateData.image_display_mode = image_display_mode;
    if (theme !== undefined) updateData.theme = theme;
    if (bg_color !== undefined) updateData.bg_color = bg_color;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update', success: false },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from(TABLES.STORES)
      .update(updateData)
      .eq('id', store_id)
      .select();

    if (error) {
      console.error('Store update error:', error);
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: data?.[0], success: true });
  } catch (error: unknown) {
    console.error('Store PUT error:', error);
    const errMsg = error instanceof Error ? error.message : 'Failed to update store';
    return NextResponse.json(
      { error: errMsg, success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { store_id } = await request.json();

    // Delete all products first
    await supabaseServer
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('store_id', store_id);

    // Delete all categories
    await supabaseServer
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('store_id', store_id);

    // Delete all banners
    await supabaseServer
      .from(TABLES.DISCOUNT_BANNERS)
      .delete()
      .eq('store_id', store_id);

    // Delete all social links
    await supabaseServer
      .from(TABLES.social_links)
      .delete()
      .eq('store_id', store_id);

    // Delete the store
    const { error } = await supabaseServer
      .from(TABLES.STORES)
      .delete()
      .eq('id', store_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
