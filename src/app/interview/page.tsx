'use client';

import { useEffect, useState } from 'react';
import sdk, { Project, VM } from '@stackblitz/sdk';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import { monitorCodeAndAskQuestions, clearDatabase } from '@/lib/chatgpt';

const Interview = () => {
    const [projectInitialized, setProjectInitialized] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [task, setTask] = useState('');  // Task state
    const [currentQuestion, setCurrentQuestion] = useState('');  // Single question state
    const [timerDuration, setTimerDuration] = useState(0);  // Timer duration in seconds
    const [timeLeft, setTimeLeft] = useState(1);  // Time left in seconds
    const [isTimeUp, setIsTimeUp] = useState(false); // Track if the time is up
    const searchParams = useSearchParams();
    const topic: any = searchParams.get('topic');
    const experience = searchParams.get('experience');
    const difficulty = searchParams.get('difficulty');
    const interviewTimer = searchParams.get('timer'); // Get the timer from the query params
    const userId:any = searchParams.get("userId");

    const title = `${topic} Interview Project`;
    const router = useRouter();
    
    // Map topics to templates
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

    const template = topicToTemplateMap[topic]; // Dynamically determine template based on topic

    // Fetch the task from the database
    useEffect(() => {
        const fetchTask = async () => {
            const response = await fetch('/api/get-task');
            const data = await response.json();
            setTask(data.task);
        };

        fetchTask();
    }, []);

    useEffect(() => {
        // Set timer duration based on the parameter from the search params
        if (interviewTimer) {
            const durationInMinutes = parseInt(interviewTimer, 10);
            setTimerDuration(durationInMinutes * 60); // Convert minutes to seconds
            setTimeLeft(durationInMinutes * 60); // Initialize time left
        }
    }, [interviewTimer]);

    useEffect(() => {
        const initializeProject = async () => {
            let vm: VM | null = null;

            // Define required files for each template
            const templateFiles: any = {
                'angular-cli': {
                    'index.html': `<h1>Angular CLI generated project</h1>`,
                    'main.ts': `console.log('Hello ${topic} from Angular!');`
                },
                'create-react-app': {
                    'index.html': `<div id="root"></div>`,
                    'index.js': `import React from 'react'; import ReactDOM from 'react-dom'; ReactDOM.render(<h1>Hello ${topic} from React!</h1>, document.getElementById('root'));`,
                },
                'html': {
                    'index.html': `<h1>HTML generated project</h1>`
                },
                'javascript': {
                    'index.html': `<h1>JS SDK generated project</h1>`,
                    'index.js': `console.log('Hello ${topic}!');`
                },
                'polymer': {
                    'index.html': `<h1>Polymer generated project</h1>`
                },
                'typescript': {
                    'index.html': `<h1>TypeScript SDK generated project</h1>`,
                    'index.ts': `console.log('Hello ${topic} from TypeScript!');`
                },
                'vue': {
                    'public/index.html': `<div id="app"></div>`,
                    'src/main.js': `import Vue from 'vue'; new Vue({el: '#app', template: '<h1>Hello ${topic} from Vue!</h1>'});`
                },
                'node': {
                    'index.js': `console.log('Hello ${topic} from Node.js!');`,
                    'package.json': JSON.stringify({
                        name: `${topic} Interview Project`,
                        scripts: { start: "node index.js" },
                        dependencies: { serve: "^14.0.0" },
                        stackblitz: { installDependencies: true, startCommand: "npm start" }
                    }, null, 2)
                }
            };

            // Dynamically determine the key file to monitor based on the template
            const keyFiles: any = {
                'angular-cli': 'main.ts',
                'create-react-app': 'index.js',
                'html': 'index.html',
                'javascript': 'index.js',
                'polymer': 'index.html',
                'typescript': 'index.ts',
                'vue': 'src/main.js',
                'node': 'index.js'
            };

            const keyFile = keyFiles[template];  // Get the main file based on template
            const files = templateFiles[template]; // Get files for the selected template

            const project: Project = {
                title,
                description: `A ${difficulty} task for ${experience} developer in ${topic}`,
                template,
                files
            };

            // Embed the Stackblitz project
            vm = await sdk.embedProject('embed', project, {
                clickToLoad: true,
                openFile: keyFile,  // Open the main file dynamically
                terminalHeight: 50,
            });

            console.log("the vm is:", vm);
            setProjectInitialized(true);

            // Handle code monitoring
            const intervalId = setInterval(async () => {
                // Fetch the current code snapshot
                const fileSnapshot: any = await vm.getFsSnapshot();

                if (fileSnapshot) {
                    // Iterate through all the files in the snapshot
                    for (const file in fileSnapshot) {
                        const currentCode = fileSnapshot[file];

                        // Generate a new question based on the current code
                        const newQuestion: any = await monitorCodeAndAskQuestions(userId,currentCode);

                        if (newQuestion) {
                            setCurrentQuestion(newQuestion); // Replace the old question with the new question
                        }
                    }
                }
            }, 20000); // Check every 20 seconds

            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId);
        };

        // Check if the project is not initialized before initializing
        if (!projectInitialized) {
            initializeProject();
        }
    }, [projectInitialized, title, topic, experience, difficulty, template]);

    // Timer functionality
    useEffect(() => {
        if (timeLeft <= 0) {
            // Handle the timer expiring
            console.log("Time's up!");
            setIsTimeUp(true); // Set time up state
            return; // Exit if time has expired
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => Math.max(prevTime - 1, 0)); // Decrement time left
        }, 1000); // Update every second

        // Clean up the interval when the component unmounts
        return () => clearInterval(timerId);
    }, [timeLeft]);

    // Redirect to homepage when time is up
    useEffect(() => {
        if (isTimeUp) {
            router.push('/'); // Redirect to homepage
        }
    }, [isTimeUp, router]);

    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-semibold mt-10">Interview Task: Build a Navbar in {topic}</h1>

            {/* Display the task
            <div className="mt-5 bg-gray-100 p-4 rounded shadow-md w-full max-w-3xl">
                <h2 className="text-xl font-semibold">Task:</h2>
                <p>{task}</p>
            </div> */}

            {/* Display the current question */}
            <div className="mt-5 bg-white p-4 rounded shadow-md w-full max-w-3xl">
                <h2 className="text-xl font-semibold">Current Question:</h2>
                <ReactMarkdown>{currentQuestion || "No question yet"}</ReactMarkdown>
            </div>

            {/* Display timer */}
            <div className="mt-5 bg-yellow-100 p-4 rounded shadow-md w-full max-w-3xl">
                <h2 className="text-xl font-semibold">Time Left:</h2>
                <p>{timeLeft > 0 ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : "0:00"}</p>
            </div>

            <div id="embed" className="w-full h-[600px] mt-5" />
        </div>
    );
};

export default Interview;
