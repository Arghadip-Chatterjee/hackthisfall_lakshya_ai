'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const InterviewForm = () => {
    const [topic, setTopic] = useState<string>('');
    const [experience, setExperience] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [timer, setTimer] = useState<string>(''); // New state for timer
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const router = useRouter();

    const handleStartInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the form is submitted

        // Map topics to their corresponding Stackblitz templates
        const topicToTemplateMap: any = {
            'Angular': 'angular-cli',
            'Html': 'html',
            'React': 'create-react-app',
            'Node.js': 'node',
            'JavaScript': 'javascript',
            'TypeScript': 'typescript',
            'Vue': 'vue',
            'Polymer': 'polymer',
        };

        // Get the appropriate template based on the selected topic
        const template = topicToTemplateMap[topic];

        // Construct the prompt for the ChatGPT API
        const prompt = `Create a ${difficulty} level coding task for a ${experience} developer, based on the topic ${topic}.`;

        try {
            // Call the ChatGPT API to generate the task
            const response = await fetch('/api/generate-task', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const generatedTask = data.task;

            const userId: string | null = localStorage.getItem("userId");

            // Store the task in the database before redirecting
            await fetch('/api/store-task', {
                method: 'POST',
                body: JSON.stringify({ task: generatedTask }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Redirect to the code editor with the selected parameters and timer
            router.push(`/interview?topic=${topic}&experience=${experience}&difficulty=${difficulty}&template=${template}&timer=${timer}&userId=${userId}`);
        } catch (error) {
            console.error('Error starting interview:', error);
        } finally {
            setIsLoading(false); // Set loading to false after the process
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-100">
            <form onSubmit={handleStartInterview} className="bg-white p-8 rounded shadow-md max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6">Start Your Mock Interview</h1>

                <label className="block mb-2">Interview Topic:</label>
                <select className="w-full mb-4 p-2 border" value={topic} onChange={(e) => setTopic(e.target.value)} required>
                    <option value="" disabled>Select a Topic</option>
                    <option value="Angular">Angular</option>
                    <option value="Html">HTML</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="Vue">Vue</option>
                    <option value="Polymer">Polymer</option>
                </select>

                <label className="block mb-2">Experience Level:</label>
                <select className="w-full mb-4 p-2 border" value={experience} onChange={(e) => setExperience(e.target.value)} required>
                    <option value="" disabled>Select Experience</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                </select>

                <label className="block mb-2">Difficulty Level:</label>
                <select className="w-full mb-4 p-2 border" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                    <option value="" disabled>Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Hard">Hard</option>
                </select>

                {/* New Timer Input Field */}
                <label className="block mb-2">Interview Timer (in minutes):</label>
                <input
                    type="number"
                    className="w-full mb-4 p-2 border"
                    value={timer}
                    onChange={(e) => setTimer(e.target.value)}
                    placeholder="Enter timer in minutes"
                    min="1" // Minimum timer value
                    required
                />

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Start Interview'}
                </button>
            </form>
        </div>
    );
};

export default InterviewForm;
