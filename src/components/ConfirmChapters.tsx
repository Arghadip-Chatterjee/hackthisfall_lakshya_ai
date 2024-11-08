"use client";
import { Chapter, Course, Unit } from "@prisma/client";
import React from "react";
import ChapterCard, { ChapterCardHandler } from "./ChapterCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import 'tailwindcss/tailwind.css';

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const ConfirmChapters = ({ course }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [chapterRefs, setChapterRefs] = React.useState<Record<string, React.RefObject<ChapterCardHandler>>>({});
  React.useEffect(() => {
    const newChapterRefs: Record<string, React.RefObject<ChapterCardHandler>> = {};
    course.units.forEach((unit) => {
      unit.chapters.forEach((chapter) => {
        newChapterRefs[chapter.id] = React.createRef();
      });
    });
    setChapterRefs(newChapterRefs);
  }, [course.units]);
  const [completedChapters, setCompletedChapters] = React.useState<Set<String>>(
    new Set()
  );
  const totalChaptersCount = React.useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);
  console.log(totalChaptersCount, completedChapters.size);

  return (
    <div className="w-full mt-4">
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-5">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h3 className="text-2xl font-bold">{unit.name}</h3>
            <div className="mt-3">
              {unit.chapters.map((chapter, chapterIndex) => {
                return (
                  <ChapterCard
                    completedChapters={completedChapters}
                    setCompletedChapters={setCompletedChapters}
                    ref={chapterRefs[chapter.id]}
                    key={chapter.id}
                    chapter={chapter}
                    chapterIndex={chapterIndex}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center mt-4">
        <div className="flex-[1]" />
        <div className="flex items-center mx-4">
          <Link href="/aicourse">
            <div className="flex items-center font-semibold text-primary">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </div>
          </Link>
          {totalChaptersCount === completedChapters.size ? (
            <Link href={`/aicourse/course/${course.id}/0/0`}>
              <div className="flex items-center ml-4 font-semibold text-primary">
                Save & Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ) : (
            <button
              className="flex items-center ml-4 font-semibold text-primary"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                Object.values(chapterRefs).forEach((ref) => {
                  ref.current?.triggerLoad();
                });
              }}
            >
              Generate
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
        <div className="flex-[1]" />
      </div>
    </div>
  );
};

export default ConfirmChapters;
