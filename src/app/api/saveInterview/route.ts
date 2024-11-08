import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const interviewData = await request.json();

        // Validate input
        const { githubUrl, answers, userId } = interviewData;
        if (!githubUrl || !answers || !userId) {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        // Save interview data to the single table
        const savedInterview = await prisma.github.create({
            data: {
                userId,
                githubUrl,
                answers: answers, // Store the whole answers array as JSON
            },
        });

        return NextResponse.json(savedInterview, { status: 201 });
    } catch (error) {
        console.error('Error saving interview data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
