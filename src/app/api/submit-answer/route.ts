import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }

    const response = await fetch('https://lakshya-ai-backend.onrender.com/submit-answer', {
      method: 'POST',
      body: new URLSearchParams({ question, answer }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to save answer' }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Submit Answer API error:', error);
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
  }
}
