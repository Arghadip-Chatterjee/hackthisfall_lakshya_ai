import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { topic, description } = await req.json(); // Parse JSON body

    // Validate input
    if (!topic || !description) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    // Store the task in MongoDB
    const newTask = await prisma.task.create({
      data: {
        topic,
        description,
      },
    });

    return NextResponse.json({ message: 'Task stored successfully', task: newTask }, { status: 200 });
  } catch (error) {
    console.error('Error storing task:', error);
    return NextResponse.json({ message: 'Error storing task' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure to disconnect from the database
  }
}
