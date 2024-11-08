"use server";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the type for the response data
interface TaskResponse {
    task: string;
}

// GET request handler
export async function GET() {
    try {
        // Fetch the latest task from the MongoDB collection
        const latestTask = await prisma.task.findFirst({
            orderBy: {
                createdAt: 'desc', // Assuming you have a timestamp field to order by
            },
        });

        // Check if a task was found
        const taskResponse: TaskResponse = {
            task: latestTask?.description || 'No task available',
        };

        return NextResponse.json(taskResponse);
    } catch (error) {
        console.error('Error fetching task from database:', error);
        return NextResponse.json({ message: 'Error fetching task' }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure to disconnect from the database
    }
}
