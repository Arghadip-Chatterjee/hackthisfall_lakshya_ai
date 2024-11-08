// app/api/generate-task/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});


export async function POST(request: Request) {
  const { prompt } = await request.json();

  // Call the OpenAI API to generate a task
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert Coding Interviewer who will generate small tasks to test coding Skills in a Live Interview. Do not tell any way to solve task or give hints. Only Provide the Task name and Short Description' },
      { role: 'user', content: prompt },
    ],
  });

  const task = completion.choices[0].message.content;
  console.log("The First Task", task);

  return NextResponse.json({ task });
}
