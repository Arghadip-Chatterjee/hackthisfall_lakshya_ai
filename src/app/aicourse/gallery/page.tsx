import GalleryCourseCard from "@/components/GalleryCourseCard";
import { prisma } from "@/lib/prisma";
import React from "react";
// import 'tailwindcss/tailwind.css';
import Link from "next/link";




const GalleryPage = async () => {
  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: { chapters: true },
      },
    },
  });
  return (
    <div className="py-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <Link href={"/aicourse"} >
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            Create Course
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((course) => (
          <GalleryCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div >
  );
};

export default GalleryPage;
