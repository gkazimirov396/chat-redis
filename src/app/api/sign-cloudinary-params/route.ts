import { NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  const body = await request.json();

  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({ signature }, { status: 201 });
}
