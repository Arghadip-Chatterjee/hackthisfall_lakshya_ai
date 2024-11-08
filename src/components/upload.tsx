"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirecting to the homepage
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function UploadPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [countdown, setCountdown] = useState<number | null>(null);

  const router = useRouter();

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    if (!role.trim()) {
      alert("Please enter the role you are applying for.");
      return;
    }

    if (timer <= 0) {
      alert("Please set a valid interview timer.");
      return;
    }

    setLoading(true);
    setCountdown(timer * 60); // Convert minutes to seconds for countdown

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("role", role);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question || "No question received.");
      } else {
        alert(data.error || "Error generating question.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const handleSaveAnswer = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    try {
      const res = await fetch("/api/submit-answer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const nextQuestionRes = await fetch("/api/get-next-question");
        const nextQuestionData = await nextQuestionRes.json();

        if (nextQuestionRes.ok) {
          setQuestion(nextQuestionData.question || "No more questions.");
          setAnswer("");
        } else {
          alert(nextQuestionData.error || "Error fetching next question.");
        }
      } else {
        alert(data.error || "Error saving answer.");
      }
    } catch (error) {
      console.error("Save Answer error:", error);
      alert("An error occurred while saving your answer.");
    }
  };

  const handleClearDatabase = async () => {
    try {
      const res = await fetch("/api/clear-database", {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Database cleared successfully!");
        setQuestion("");
        setAnswer("");
      } else {
        alert(data.error || "Failed to clear the database.");
      }
    } catch (error) {
      console.error("Clear Database error:", error);
      alert("An error occurred while clearing the database.");
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      alert("Time's up! Ending the interview.");
      router.push("/");
      return;
    }

    const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);

    return () => clearTimeout(timerId);
  }, [countdown, router]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">AI Mock Interview Platform</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Upload Resume (PDF):</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleResumeUpload}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Role --</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Data Scientist">Data Scientist</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Set Timer (in minutes):</label>
        <input
          type="number"
          min="1"
          value={timer}
          onChange={(e) => setTimer(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Interview Question</h2>
        {question && (
          <div className="mb-6">
            <ReactMarkdown className="prose">{question}</ReactMarkdown>
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="border p-2 w-full mt-2"
              placeholder="Type your answer here..."
              rows={4}
            ></textarea>
            <button
              onClick={handleSaveAnswer}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Save Answer
            </button>
          </div>
        )}
      </div>

      {/* Display remaining time */}
      {countdown !== null && (
        <div className="mt-4 text-red-600 font-semibold">
          Time Remaining: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? "0" : ""}{countdown % 60}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleClearDatabase}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Database
        </button>
      </div>

      <div className="mt-8">
        <Link href="/git">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Github
          </button>
        </Link>
      </div>
    </div>
  );
}
