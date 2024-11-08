"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { FaBriefcase, FaGithub, FaCode, FaGraduationCap } from "react-icons/fa";

export function CanvasRevealEffectDemo() {
    return (
        <>
            <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto px-8">
                <Card 
                    title="Resume Mock Interview" 
                    icon={<FaBriefcase className="h-10 w-10 text-black dark:text-white" />} 
                    description="Prepare for your resume-based interviews with AI-powered questions."
                    buttonText="Start Interview"
                    buttonLink="/resume"
                >
                    <CanvasRevealEffect
                        animationSpeed={5.1}
                        containerClassName="bg-emerald-900"
                    />
                </Card>
                <Card 
                    title="Github Mock Interview" 
                    icon={<FaGithub className="h-10 w-10 text-black dark:text-white" />} 
                    description="Ace your GitHub-focused interviews by practicing with real questions."
                    buttonText="Start Interview"
                    buttonLink="/git"
                >
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-black"
                        colors={[
                            [236, 72, 153],
                            [232, 121, 249],
                        ]}
                        dotSize={2}
                    />
                    <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
                </Card>
                <Card 
                    title="Live Coding Interview" 
                    icon={<FaCode className="h-10 w-10 text-black dark:text-white" />} 
                    description="Sharpen your live coding skills with AI-assisted coding sessions."
                    buttonText="Start Interview"
                    buttonLink="/code"
                >
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-sky-600"
                        colors={[[125, 211, 252]]}
                    />
                </Card>
                <Card 
                    title="AI Course Generator" 
                    icon={<FaGraduationCap className="h-10 w-10 text-black dark:text-white" />} 
                    description="Generate personalized AI-driven courses to boost your skills."
                    buttonText="Generate Course"
                    buttonLink="/aicourse/gallery"
                >
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-yellow-500"
                        colors={[[255, 199, 51]]}
                    />
                </Card>
            </div>
        </>
    );
}

const Card = ({
    title,
    icon,
    description,
    buttonText,
    buttonLink,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    description: string;
    buttonText: string;
    buttonLink: string;
    children?: React.ReactNode;
}) => {
    const [hovered, setHovered] = React.useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem]"
        >
            {/* Top left and right icons */}
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-20 text-center">
                {/* Display icon and title separately */}
                <div className="flex flex-col items-center">
                    {icon}
                    <h2 className="dark:text-white text-xl mt-2 font-bold">{title}</h2>
                </div>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 opacity-0 group-hover/canvas-card:opacity-100 transition duration-300">
                    {description}
                </p>

                <a 
                    href={buttonLink}
                    className="opacity-0 group-hover/canvas-card:opacity-100 mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
                >
                    {buttonText}
                </a>
            </div>
        </div>
    );
};

const Icon = ({ className, ...rest }: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};
