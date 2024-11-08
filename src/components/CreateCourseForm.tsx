'use client';
// "use strict";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateCourseForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [units, setUnits] = useState(["", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUnit = () => {
    setUnits([...units, ""]);
  };

  const handleRemoveUnit = () => {
    setUnits(units.slice(0, -1));
  };

  const handleUnitChange = (index: number, value: string) => {
    const newUnits = [...units];
    newUnits[index] = value;
    setUnits(newUnits);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (units.some((unit) => unit === "")) {
      alert("Please fill all the units");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/course/createChapters", {
        method: "POST",
        body: JSON.stringify({ title, units }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Course created successfully");
        console.log("Course Created Successfully");
        router.push(`/aicourse/create/${result.course_id}`);
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle redirect to the gallery page
  const handleGoToGallery = () => {
    router.push('/aicourse/gallery');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full mt-4">
        <div className="flex flex-col items-start w-full sm:items-center sm:flex-row">
          <label className="flex-[1] text-xl">Title</label>
          <div className="flex-[6]">
            <input
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Enter the main topic of the course"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <AnimatePresence>
          {units.map((unit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.2 },
              }}
            >
              <div className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                <label className="flex-[1] text-xl">Unit {index + 1}</label>
                <div className="flex-[6] py-2">
                  <input
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholder="Enter subtopic of the course"
                    value={unit}
                    onChange={(e) => handleUnitChange(index, e.target.value)}
                    required
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex items-center justify-center mt-4">
          <div className="flex-[1] border-t border-gray-300" />
          <div className="mx-4 flex">
            <button
              type="button"
              className="p-2 border border-gray-300 rounded flex flex-wrap"
              onClick={handleAddUnit}
            >
              Add Unit
              <Plus className="w-4 h-4 ml-2 text-green-500 my-auto" />
            </button>

            <button
              type="button"
              className="p-2 border border-gray-300 rounded ml-2 flex flex-wrap"
              onClick={handleRemoveUnit}
            >
              Remove Unit
              <Trash className="w-4 h-4 ml-2 text-red-500 my-auto" />
            </button>
          </div>
          <div className="flex-[1] border-t border-gray-300" />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className={`w-full p-3 mt-6 text-white rounded ${isLoading ? "bg-gray-400" : "bg-blue-500"}`}
        >
          {isLoading ? "Loading..." : "Let's Go!"}
        </button>

        {/* New Button for redirecting to gallery */}
        <button
          type="button"
          onClick={handleGoToGallery}
          className="w-full p-3 mt-4 bg-green-500 text-white rounded"
        >
          Go to Gallery
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
