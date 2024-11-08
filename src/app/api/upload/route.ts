import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form-data without using bodyParser
    const formData = await request.formData();

    // Forward the formData to the FastAPI backend
    const response = await fetch('https://nithacks-backend.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    // Check for an error in the FastAPI response
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to process upload' }, { status: 500 });
    }

    // Return the response from FastAPI
    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}



