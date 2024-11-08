import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const prisma = new PrismaClient();

// Function to get user feedback
export const generateFeedback = async (userId: string): Promise<string> => {
  try {
    // Fetch the last 3 interviews of the user, ordered by createdAt (assuming this field exists)
    const pastInterviews = await prisma.github.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Order by createdAt to get the most recent ones
      take: 3, // Limit to last 3 interviews
    });

    // Check if there are no interviews to provide feedback for
    if (pastInterviews.length === 0) {
      return 'No past interviews found for feedback.';
    }

    // Construct a prompt for ChatGPT
    const prompt = constructFeedbackPrompt(pastInterviews);

    // Call the ChatGPT API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a feedback generator for coding interviews.' },
        { role: 'user', content: prompt },
      ],
    });

    // Extract and return the feedback
     const result:any = completion.choices[0].message.content;
     return result;
  } catch (error) {
    console.error('Error generating feedback:', error);
    return 'An error occurred while generating feedback.';
  }
};

// Helper function to construct the feedback prompt
const constructFeedbackPrompt = (interviews: any[]): string => {
  let feedbackPrompt = 'Here are the details of the last three interviews:\n\n';

  interviews.forEach((interview, index) => {
    feedbackPrompt += `Interview ${index + 1}:\n`;
    feedbackPrompt += `GitHub URL: ${interview.githubUrl}\n`;
    feedbackPrompt += `Answers: ${JSON.stringify(interview.answers, null, 2)}\n\n`; // Pretty print answers
  });

  feedbackPrompt += 'Please provide feedback on the user’s performance, highlighting weak topics and areas for improvement.';

  return feedbackPrompt;
};
