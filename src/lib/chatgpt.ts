import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

const prisma = new PrismaClient();

// Interface for interview data
interface InterviewData {
  questions: string[];
  code: string;
  task: string;
  interviewComplete: boolean;
}

// Function to fetch the latest interview data for a specific user
export const getInterviewData = async (userId: string): Promise<InterviewData> => {
  try {
    const interviewData = await prisma.code.findUnique({
      where: { userId },
    });

    // Return the fetched interview data or default values if none exists
    return interviewData
      ? {
          questions: interviewData.questions as string[],
          code: '', // Assuming you want to handle code separately
          task: '', // Assuming the task details are fetched separately
          interviewComplete: false, // Placeholder for interview completion logic
        }
      : { questions: [], code: '', task: '', interviewComplete: false };
  } catch (error) {
    console.error('Error fetching interview data:', error);
    // Return default data if an error occurs
    return { questions: [], code: '', task: '', interviewComplete: false };
  }
};

// Function to save interview data
export const saveInterviewData = async (userId: string, data: Partial<InterviewData>): Promise<void> => {
  try {
    await prisma.code.upsert({
      where: { userId }, // Find document by userId (unique field)
      update: { questions: data.questions }, // Update with the new questions (adjust fields as necessary)
      create: {
        userId,
        questions: data.questions || [],
        topic: 'some topic', // Provide relevant fields
        experience: 'beginner', // Defaults, or dynamically fetch them
        difficulty: 'medium',
        timer: 0,
      },
    });
  } catch (error) {
    console.error('Error saving interview data:', error);
  }
};

// Function to clear the database for a specific user
export const clearDatabase = async (userId: string): Promise<void> => {
  await saveInterviewData(userId, { questions: [], code: '', task: '', interviewComplete: false });
};

// Helper function to check if the feedback suggests the interview is over
const isInterviewOver = (feedback: string): boolean => {
  const completionPhrases = [
    "no further improvements needed",
    "task complete",
    "interview is over",
    "nothing more to ask",
  ];

  return completionPhrases.some(phrase => feedback.toLowerCase().includes(phrase.toLowerCase()));
};

// Monitor code, check progress, and ask questions while storing context
export const monitorCodeAndAskQuestions = async (userId: string, codeContent: string): Promise<string> => {
  const db = await getInterviewData(userId);

  if (db.interviewComplete) {
    return "Interview is already completed. No further questions to ask.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert coding interviewer who has given a small task to the user for a coding interview. Guide them to complete the task without revealing the solution.' },
        {
          role: 'user', content: `The task is: ${db.task}. Here is the current code: ${codeContent}. Previous questions: ${db.questions.join(', ')}. Ask the user questions based on their current implementation. Focus mainly on code implementation and logic, not on design. If the current implementation and code are correct, don't ask any more questions and end the interview. Provide hints for improvements and keep responses concise.`
        },
      ],
    });

    const feedback: any = completion.choices[0].message.content;

    console.log("The new questions are:", feedback);

    // Push the new feedback into the questions array
    db.questions.push(feedback);

    if (isInterviewOver(feedback)) {
      db.interviewComplete = true;
    }

    // Save the updated data
    await saveInterviewData(userId, db);

    return db.interviewComplete
      ? "Interview is complete. No further questions or improvements needed."
      : feedback;

  } catch (error) {
    console.error('Error during OpenAI completion:', error);
    return "An error occurred while asking questions. Please try again.";
  }
};
