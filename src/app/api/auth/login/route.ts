import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Missing email or password'),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        errorResponse(error.message),
        { status: 401 }
      );
    }

    return NextResponse.json(
      successResponse(
        {
          user: data.user,
          session: data.session,
        },
        'Logged in successfully'
      )
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to login'),
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    errorResponse('Method not allowed'),
    { status: 405 }
  );
}
