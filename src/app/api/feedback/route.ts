// app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateFeedback } from '@/lib/feedback'; // Adjust to point to your feedback generation function

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Generate new feedback
        const feedback = await generateFeedback(userId);

        // Upsert feedback for the user: Update if it exists, otherwise create
        const feedbackRecord = await prisma.feedback.upsert({
            where: { userId },
            update: { feedback }, // Update feedback if record exists
            create: {
                userId,
                feedback, // Create new record if none exists
            },
        });

        return NextResponse.json({ feedback: feedbackRecord.feedback });
    } catch (error) {
        console.error('Error fetching or generating feedback:', error);
        return NextResponse.json({ error: 'Error fetching or generating feedback' }, { status: 500 });
    }
}
