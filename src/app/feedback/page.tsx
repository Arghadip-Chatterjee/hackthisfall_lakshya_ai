// app/feedback/Feedback.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

const Feedback: React.FC = () => {
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    
    // Function to fetch feedback from your API
    const fetchFeedback = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId'); // Example: get userId from local storage

        if (!userId) {
            router.push('/'); // Redirect if userId not found
            return;
        }

        try {
            const response = await fetch(`/api/feedback?userId=${userId}`);
            const data = await response.json();
            setFeedback(data.feedback); // Assume feedback comes as markdown format
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedback('Failed to load feedback.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    if (loading) {
        return <div className='flex text-center justify-center min-h-screen items-center text-gray-300'>Loading feedback...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-amber-50">
            <h1 className="text-3xl font-semibold mb-4">Interview Feedback</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-2">Feedback Report</h2>
                {feedback ? (
                    <ReactMarkdown>{feedback}</ReactMarkdown> // Render markdown content
                ) : (
                    <p>No feedback available.</p>
                )}
            </div>
            <button
                onClick={() => router.back()}
                className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Go Back
            </button>
        </div>
    );
};

export default Feedback;
