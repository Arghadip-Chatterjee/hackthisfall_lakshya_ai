import ConfirmChapters from "@/components/ConfirmChapters";
import { prisma } from "@/lib/prisma";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
// import 'tailwindcss/tailwind.css';

type Props = {
  params: {
    courseId: string;
  };
};

const CreateChapters = async ({ params: { courseId } }: Props) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/aicourse/gallery");
  }

  return (
    <div className="flex flex-col items-start max-w-xl mx-auto my-16">
      <h5 className="text-sm uppercase text-seconday-foreground/60">
        Course Name
      </h5>
      <h1 className="text-5xl font-bold">{course.name}</h1>

      <div className="flex p-4 mt-5 border-none bg-secondary">
        <Info className="w-12 h-12 mr-3 text-blue-400" />
        <div>
          We generated chapters for each of your units. Look over them and then
          click the Button to confirm and continue
        </div>
      </div>
      <ConfirmChapters course={course} />
    </div>
  );
};

export default CreateChapters;
