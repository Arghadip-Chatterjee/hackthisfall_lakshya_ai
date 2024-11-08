import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace this URL with the actual URL of your FastAPI endpoint
    const response = await fetch('https://lakshya-ai-backend.onrender.com/get-next-question');

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch the next question.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching next question:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the next question.' }, { status: 500 });
  }
}
